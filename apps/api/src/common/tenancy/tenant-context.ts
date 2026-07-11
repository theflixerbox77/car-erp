import { AsyncLocalStorage } from 'node:async_hooks';

export type TenancyMode = 'tenant' | 'platform';

export interface RequestTenantContext {
  mode: TenancyMode;
  tenantId: string | null;
  userId: string | null;
}

export const tenantContextStorage = new AsyncLocalStorage<RequestTenantContext>();

export function getTenantContext(): RequestTenantContext | undefined {
  return tenantContextStorage.getStore();
}

export function runWithTenantContext<T>(context: RequestTenantContext, fn: () => T): T {
  return tenantContextStorage.run(context, fn);
}
