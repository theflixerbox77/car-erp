import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../common/audit/audit-log.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
  ) {}

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
    const before = await this.requireTenant(id);
    const after = await this.prisma.raw.tenant.update({
      where: { id },
      data: {
        subscriptionStatus: 'active',
        approvedBy: approvedByUserId,
        approvedAt: new Date(),
      },
    });
    await this.auditLog.record({
      tenantId: id,
      userId: approvedByUserId,
      action: 'dealer.approve',
      entityType: 'Tenant',
      entityId: id,
      beforeData: { subscriptionStatus: before.subscriptionStatus },
      afterData: { subscriptionStatus: after.subscriptionStatus },
    });
    return after;
  }

  async suspend(id: string, actorUserId: string) {
    const before = await this.requireTenant(id);
    const after = await this.prisma.raw.tenant.update({
      where: { id },
      data: { subscriptionStatus: 'suspended' },
    });
    await this.auditLog.record({
      tenantId: id,
      userId: actorUserId,
      action: 'dealer.suspend',
      entityType: 'Tenant',
      entityId: id,
      beforeData: { subscriptionStatus: before.subscriptionStatus },
      afterData: { subscriptionStatus: after.subscriptionStatus },
    });
    return after;
  }

  async reactivate(id: string, actorUserId: string) {
    const before = await this.requireTenant(id);
    const after = await this.prisma.raw.tenant.update({
      where: { id },
      data: { subscriptionStatus: 'active' },
    });
    await this.auditLog.record({
      tenantId: id,
      userId: actorUserId,
      action: 'dealer.reactivate',
      entityType: 'Tenant',
      entityId: id,
      beforeData: { subscriptionStatus: before.subscriptionStatus },
      afterData: { subscriptionStatus: after.subscriptionStatus },
    });
    return after;
  }
}
