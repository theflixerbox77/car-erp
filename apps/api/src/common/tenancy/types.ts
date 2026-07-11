export interface AccessTokenPayload {
  sub: string; // user id
  tenantId: string | null;
  isPlatformAdmin: boolean;
  roleId: string | null;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  tenantId: string | null;
  type: 'refresh';
}

export interface RequestUser {
  id: string;
  tenantId: string | null;
  isPlatformAdmin: boolean;
  roleId: string | null;
}
