import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    // Uses the raw client: at this point we only know the user id, not yet a
    // confirmed tenant-scoped context for this lookup (it IS the lookup that
    // tells us the tenant), so this one query intentionally bypasses scoping.
    const user = await this.prisma.raw.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        avatarUrl: true,
        isPlatformAdmin: true,
        tenantId: true,
        role: { select: { id: true, name: true } },
        tenant: { select: { id: true, slug: true, businessName: true, subscriptionStatus: true, subscriptionPlan: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
