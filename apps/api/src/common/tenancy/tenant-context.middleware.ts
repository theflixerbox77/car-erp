import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { runWithTenantContext } from './tenant-context';
import { AccessTokenPayload, RequestUser } from './types';

declare module 'express' {
  interface Request {
    user?: RequestUser;
  }
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }
  const cookies = req.cookies as unknown as Record<string, string> | undefined;
  const cookieToken = cookies?.['access_token'];
  return cookieToken ?? null;
}

/**
 * Runs on every request, before any guard. Verifies the access token (if present)
 * and establishes the AsyncLocalStorage tenant context for the *entire* downstream
 * request lifecycle (guards, interceptors, controller, and every Prisma call they
 * make). Requests with no/invalid token proceed with no context set, which is the
 * correct fail-closed state for public routes and means JwtAuthGuard, not this
 * middleware, is what actually blocks unauthenticated access to protected routes.
 */
@Injectable()
export class TenantContextMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = extractToken(req);

    if (!token) {
      next();
      return;
    }

    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      if (payload.type !== 'access') {
        next();
        return;
      }

      req.user = {
        id: payload.sub,
        tenantId: payload.tenantId,
        isPlatformAdmin: payload.isPlatformAdmin,
        roleId: payload.roleId,
      };

      const mode =
        payload.isPlatformAdmin && !payload.tenantId ? 'platform' : 'tenant';

      runWithTenantContext(
        { mode, tenantId: payload.tenantId, userId: payload.sub },
        next,
      );
    } catch {
      // Invalid/expired token: leave req.user unset, let JwtAuthGuard reject protected routes.
      next();
    }
  }
}
