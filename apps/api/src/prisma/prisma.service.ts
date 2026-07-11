import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { tenantScopingExtension } from '../common/tenancy/tenant-scoping.extension';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const basePrisma = new PrismaClient({ adapter });

/**
 * Single process-wide extended client. Tenant scoping is resolved per-call from
 * AsyncLocalStorage (see tenant-context.ts), not baked into the client instance,
 * so there is exactly one PrismaClient for the whole app — no per-request
 * instantiation cost.
 */
export const tenantScopedPrisma = basePrisma.$extends(tenantScopingExtension());

export type TenantScopedPrismaClient = typeof tenantScopedPrisma;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  readonly client: TenantScopedPrismaClient = tenantScopedPrisma;

  /** Escape hatch for platform-admin flows that intentionally query across tenants. Use sparingly and only inside routes guarded by an IsPlatformAdmin check. */
  readonly raw: PrismaClient = basePrisma;

  async onModuleInit() {
    await basePrisma.$connect();
    this.logger.log('Connected to Postgres via Prisma');
  }

  async onModuleDestroy() {
    await basePrisma.$disconnect();
  }
}
