import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SYSTEM_ROLE_TEMPLATES } from '../common/constants/permissions';
import { RegisterDealerDto } from './dto/register-dealer.dto';
import { LoginDto } from './dto/login.dto';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../common/tenancy/types';

const OWNER_ROLE_NAME = 'Owner';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async registerDealer(dto: RegisterDealerDto) {
    const db = this.prisma.raw;

    const [existingSlug, existingEmail] = await Promise.all([
      db.tenant.findUnique({ where: { slug: dto.slug } }),
      db.user.findUnique({ where: { email: dto.ownerEmail.toLowerCase() } }),
    ]);
    if (existingSlug)
      throw new ConflictException('That dealer URL is already taken');
    if (existingEmail)
      throw new ConflictException('An account with that email already exists');

    const passwordHash = await bcrypt.hash(dto.ownerPassword, 12);

    // Permissions are a static, global catalog (not tenant data) — read once, outside
    // the transaction, so the transaction itself only does the writes that must be atomic.
    const allPermissionCodes = [
      ...new Set(SYSTEM_ROLE_TEMPLATES.flatMap((t) => t.permissions)),
    ];
    const permissions = await db.permission.findMany({
      where: { code: { in: allPermissionCodes } },
    });
    const permissionIdByCode = new Map(permissions.map((p) => [p.code, p.id]));

    const result = await db.$transaction(
      async (tx) => {
        const tenant = await tx.tenant.create({
          data: {
            slug: dto.slug,
            businessName: dto.businessName,
            phone: dto.phone,
            subscriptionStatus: 'pending_approval',
            subscriptionPlan: 'trial',
          },
        });

        // Single batched insert for all role templates instead of N sequential creates.
        await tx.role.createMany({
          data: SYSTEM_ROLE_TEMPLATES.map((t) => ({
            tenantId: tenant.id,
            name: t.name,
            isSystem: true,
          })),
        });
        const roles = await tx.role.findMany({
          where: { tenantId: tenant.id },
        });
        const roleIdByName = new Map(roles.map((r) => [r.name, r.id]));

        const rolePermissionRows = SYSTEM_ROLE_TEMPLATES.flatMap((template) => {
          const roleId = roleIdByName.get(template.name);
          if (!roleId) return [];
          return template.permissions
            .map((code) => permissionIdByCode.get(code))
            .filter((permissionId): permissionId is string =>
              Boolean(permissionId),
            )
            .map((permissionId) => ({ roleId, permissionId }));
        });
        if (rolePermissionRows.length > 0) {
          await tx.rolePermission.createMany({ data: rolePermissionRows });
        }

        const ownerRoleId = roleIdByName.get(OWNER_ROLE_NAME);
        const owner = await tx.user.create({
          data: {
            tenantId: tenant.id,
            email: dto.ownerEmail.toLowerCase(),
            passwordHash,
            fullName: dto.ownerFullName,
            phone: dto.phone,
            roleId: ownerRoleId,
            isPlatformAdmin: false,
            status: 'active',
          },
        });

        return { tenant, owner };
      },
      { timeout: 15000 },
    );

    return this.issueTokens({
      id: result.owner.id,
      tenantId: result.tenant.id,
      isPlatformAdmin: false,
      roleId: result.owner.roleId,
    });
  }

  async login(dto: LoginDto) {
    const db = this.prisma.raw;
    const user = await db.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    let tenant: {
      id: string;
      slug: string;
      businessName: string;
      subscriptionStatus: string;
    } | null = null;
    if (user.tenantId) {
      tenant = await db.tenant.findUnique({
        where: { id: user.tenantId },
        select: {
          id: true,
          slug: true,
          businessName: true,
          subscriptionStatus: true,
        },
      });
    }

    const tokens = await this.issueTokens({
      id: user.id,
      tenantId: user.tenantId,
      isPlatformAdmin: user.isPlatformAdmin,
      roleId: user.roleId,
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        isPlatformAdmin: user.isPlatformAdmin,
      },
      tenant,
    };
  }

  async refresh(refreshToken: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = this.jwt.verify<RefreshTokenPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user = await this.prisma.raw.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Account no longer active');
    }

    return this.issueTokens({
      id: user.id,
      tenantId: user.tenantId,
      isPlatformAdmin: user.isPlatformAdmin,
      roleId: user.roleId,
    });
  }

  private async issueTokens(user: {
    id: string;
    tenantId: string | null;
    isPlatformAdmin: boolean;
    roleId: string | null;
  }) {
    const accessPayload: AccessTokenPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      isPlatformAdmin: user.isPlatformAdmin,
      roleId: user.roleId,
      type: 'access',
    };
    const refreshPayload: RefreshTokenPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') as never,
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') as never,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
