import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';

const BUSINESS_SELECT = {
  id: true,
  slug: true,
  businessName: true,
  legalName: true,
  logoUrl: true,
  address: true,
  city: true,
  country: true,
  phone: true,
  whatsappNumber: true,
  customDomain: true,
  subscriptionPlan: true,
  subscriptionStatus: true,
  storefrontSettings: true,
};

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Settings routes are guarded by TenantScopedGuard + resolve tenantId from the
   * caller's JWT (never from params/body), so a dealer can only ever read/write
   * their own tenant row here despite using the raw (unscoped) client -- Tenant
   * itself carries no tenant_id column for the scoping extension to key off.
   */
  async getBusiness(tenantId: string) {
    const tenant = await this.prisma.raw.tenant.findUnique({
      where: { id: tenantId },
      select: BUSINESS_SELECT,
    });
    if (!tenant) throw new NotFoundException('Dealer not found');
    return tenant;
  }

  async updateBusiness(tenantId: string, dto: UpdateBusinessSettingsDto) {
    const existing = await this.prisma.raw.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!existing) throw new NotFoundException('Dealer not found');

    const { about, heroImageUrl, ...tenantFields } = dto;
    const currentStorefrontSettings =
      (existing.storefrontSettings as Record<string, unknown>) ?? {};
    const storefrontSettings = {
      ...currentStorefrontSettings,
      ...(about !== undefined ? { about } : {}),
      ...(heroImageUrl !== undefined ? { heroImageUrl } : {}),
    };

    return this.prisma.raw.tenant.update({
      where: { id: tenantId },
      data: { ...tenantFields, storefrontSettings },
      select: BUSINESS_SELECT,
    });
  }
}
