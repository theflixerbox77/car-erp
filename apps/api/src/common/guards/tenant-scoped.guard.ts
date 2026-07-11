import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

/** Blocks platform-admin-only sessions (tenantId === null) from dealer-scoped routes like /vehicles. */
@Injectable()
export class TenantScopedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user?.tenantId) {
      throw new ForbiddenException('This resource belongs to a dealer account, not a platform admin');
    }
    return true;
  }
}
