export type StorageVisibility = 'public' | 'private';

export interface UploadResult {
  path: string;
  url: string;
}

/**
 * Abstraction over the object storage backend. Supabase Storage is the Phase 1
 * implementation; swapping to S3/R2 later (the original spec's stated preference)
 * means writing a new class against this interface, not touching call sites.
 */
export interface StorageProvider {
  upload(visibility: StorageVisibility, path: string, file: Buffer, contentType: string): Promise<UploadResult>;
  getPublicUrl(path: string): string;
  /** Only meaningful for private objects; throws if called against the public bucket. */
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
  delete(visibility: StorageVisibility, path: string): Promise<void>;
}

export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');
