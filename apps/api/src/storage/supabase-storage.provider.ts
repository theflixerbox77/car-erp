import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StorageProvider, StorageVisibility, UploadResult } from './storage-provider.interface';

@Injectable()
export class SupabaseStorageProvider implements StorageProvider {
  private readonly client: SupabaseClient;
  private readonly publicBucket: string;
  private readonly privateBucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = createClient(this.config.getOrThrow<string>('SUPABASE_URL'), this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'));
    this.publicBucket = this.config.getOrThrow<string>('SUPABASE_PUBLIC_BUCKET');
    this.privateBucket = this.config.getOrThrow<string>('SUPABASE_PRIVATE_BUCKET');
  }

  private bucketFor(visibility: StorageVisibility): string {
    return visibility === 'public' ? this.publicBucket : this.privateBucket;
  }

  async upload(visibility: StorageVisibility, path: string, file: Buffer, contentType: string): Promise<UploadResult> {
    const bucket = this.bucketFor(visibility);
    const { error } = await this.client.storage.from(bucket).upload(path, file, { contentType, upsert: false });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);

    const url = visibility === 'public' ? this.getPublicUrl(path) : await this.getSignedUrl(path);
    return { path, url };
  }

  getPublicUrl(path: string): string {
    const { data } = this.client.storage.from(this.publicBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async getSignedUrl(path: string, expiresInSeconds = 60 * 10): Promise<string> {
    const { data, error } = await this.client.storage.from(this.privateBucket).createSignedUrl(path, expiresInSeconds);
    if (error) throw new Error(`Failed to sign URL: ${error.message}`);
    return data.signedUrl;
  }

  async delete(visibility: StorageVisibility, path: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucketFor(visibility)).remove([path]);
    if (error) throw new Error(`Storage delete failed: ${error.message}`);
  }
}
