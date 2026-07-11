/**
 * Prisma model names (as they appear in schema.prisma, PascalCase) that carry a
 * tenant_id column and must never be queried without an active tenant context.
 * Add every new tenant-owned model here the moment its migration lands —
 * the extension in tenant-scoping.extension.ts fails closed for anything NOT
 * in this set only if it's also not explicitly exempted, so an omission here
 * is a silent cross-tenant leak, not a safe default.
 */
export const TENANT_SCOPED_MODELS = new Set<string>([
  'Role',
  'User',
  'AuditLog',
  'Vehicle',
  'VehicleMedia',
  'VehicleStatusHistory',
]);
