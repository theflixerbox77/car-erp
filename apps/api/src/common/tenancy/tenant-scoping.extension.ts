import { Prisma } from '../../../generated/prisma/client';
import { TENANT_SCOPED_MODELS } from './tenant-scoped-models';
import { getTenantContext } from './tenant-context';

export class MissingTenantContextError extends Error {
  constructor(model: string, operation: string) {
    super(
      `Refusing to run ${model}.${operation}: no tenant context is set. ` +
        `Every request touching a tenant-scoped model must pass through TenantGuard first.`,
    );
    this.name = 'MissingTenantContextError';
  }
}

const WRITE_MANY_OPS = new Set(['updateMany', 'deleteMany']);
const READ_OPS = new Set(['findFirst', 'findFirstOrThrow', 'findMany', 'findUnique', 'findUniqueOrThrow', 'count', 'aggregate', 'groupBy']);

/**
 * Injects `tenantId` into the correct clause for each Prisma operation shape.
 * This is intentionally exhaustive rather than best-effort: an operation that
 * falls through unhandled would run unscoped, which is exactly the failure
 * mode this whole mechanism exists to prevent.
 */
function scopeArgs(operation: string, args: any, tenantId: string): any {
  const scoped = { ...(args ?? {}) };

  if (READ_OPS.has(operation) || WRITE_MANY_OPS.has(operation) || operation === 'delete' || operation === 'update') {
    scoped.where = { ...(scoped.where ?? {}), tenantId };
    return scoped;
  }

  if (operation === 'create') {
    scoped.data = { ...(scoped.data ?? {}), tenantId };
    return scoped;
  }

  if (operation === 'createMany' || operation === 'createManyAndReturn') {
    const data = Array.isArray(scoped.data) ? scoped.data : [scoped.data];
    scoped.data = data.map((row: any) => ({ ...row, tenantId }));
    return scoped;
  }

  if (operation === 'upsert') {
    scoped.where = { ...(scoped.where ?? {}), tenantId };
    scoped.create = { ...(scoped.create ?? {}), tenantId };
    return scoped;
  }

  throw new Error(`Tenant scoping does not know how to handle Prisma operation "${operation}" — add it to scopeArgs().`);
}

export function tenantScopingExtension() {
  return Prisma.defineExtension({
    name: 'tenant-scoping',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !TENANT_SCOPED_MODELS.has(model)) {
            return query(args);
          }

          const ctx = getTenantContext();
          if (!ctx) {
            throw new MissingTenantContextError(model, operation);
          }

          if (ctx.mode === 'platform') {
            // Platform admin routes explicitly operate across tenants.
            return query(args);
          }

          if (!ctx.tenantId) {
            throw new MissingTenantContextError(model, operation);
          }

          return query(scopeArgs(operation, args, ctx.tenantId));
        },
      },
    },
  });
}
