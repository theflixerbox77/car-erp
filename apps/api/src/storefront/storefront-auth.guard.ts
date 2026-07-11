import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { CustomerTokenPayload } from './storefront-auth.service';

interface CustomerRequest extends Request {
  customerAccount?: { id: string; tenantId: string };
}

/** Guards routes under /storefront/account/* -- verifies the customer JWT (separate secret/audience from staff auth). */
@Injectable()
export class StorefrontAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomerRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      throw new UnauthorizedException('Missing access token');

    try {
      const payload = this.jwt.verify<CustomerTokenPayload>(
        authHeader.slice('Bearer '.length),
        {
          secret: this.config.get<string>('STOREFRONT_JWT_SECRET'),
        },
      );
      if (payload.type !== 'storefront')
        throw new UnauthorizedException('Invalid token');
      request.customerAccount = { id: payload.sub, tenantId: payload.tenantId };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
