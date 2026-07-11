import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  // Platform-admin only: intentionally queries across all tenants via the raw client.
  list() {
    return this.prisma.raw.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        businessName: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        createdAt: true,
        approvedAt: true,
      },
    });
  }

  private async requireTenant(id: string) {
    const tenant = await this.prisma.raw.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Dealer not found');
    return tenant;
  }

  async approve(id: string, approvedByUserId: string) {
    await this.requireTenant(id);
    return this.prisma.raw.tenant.update({
      where: { id },
      data: { subscriptionStatus: 'active', approvedBy: approvedByUserId, approvedAt: new Date() },
    });
  }

  async suspend(id: string) {
    await this.requireTenant(id);
    return this.prisma.raw.tenant.update({ where: { id }, data: { subscriptionStatus: 'suspended' } });
  }

  async reactivate(id: string) {
    await this.requireTenant(id);
    return this.prisma.raw.tenant.update({ where: { id }, data: { subscriptionStatus: 'active' } });
  }
}
