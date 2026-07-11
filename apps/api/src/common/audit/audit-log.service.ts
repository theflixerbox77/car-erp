import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface AuditEntry {
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  beforeData?: unknown;
  afterData?: unknown;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Platform-admin and other cross-tenant actions use the raw client -- there is often no single-tenant JWT context here. */
  async record(entry: AuditEntry) {
    await this.prisma.raw.auditLog.create({
      data: {
        tenantId: entry.tenantId ?? undefined,
        userId: entry.userId ?? undefined,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? undefined,
        beforeData: entry.beforeData as never,
        afterData: entry.afterData as never,
      },
    });
  }
}
