import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }
    if (user.isPlatformAdmin) {
      return true;
    }
    if (!user.roleId) {
      throw new ForbiddenException('No role assigned');
    }

    const grantedCount = await this.prisma.client.rolePermission.count({
      where: {
        roleId: user.roleId,
        permission: { code: { in: required } },
      },
    });

    if (grantedCount < required.length) {
      throw new ForbiddenException(`Missing required permission(s): ${required.join(', ')}`);
    }

    return true;
  }
}
