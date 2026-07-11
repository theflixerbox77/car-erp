import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_PROVIDER } from '../storage/storage-provider.interface';
import type { StorageProvider } from '../storage/storage-provider.interface';

const MEDIA_TYPES = ['image', 'video', '360', 'document'] as const;
type MediaType = (typeof MEDIA_TYPES)[number];

// Soft cap despite the spec's "unlimited photos" — abuse protection, easy to raise later.
const MAX_MEDIA_PER_VEHICLE = 60;

function bucketVisibility(type: MediaType): 'public' | 'private' {
  return type === 'document' ? 'private' : 'public';
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_').slice(-100);
}

@Injectable()
export class VehicleMediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  async upload(
    tenantId: string,
    vehicleId: string,
    userId: string,
    type: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    if (!MEDIA_TYPES.includes(type as MediaType)) {
      throw new BadRequestException(`Invalid media type "${type}"`);
    }

    const vehicle = await this.prisma.client.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const existingCount = await this.prisma.client.vehicleMedia.count({
      where: { vehicleId },
    });
    if (existingCount >= MAX_MEDIA_PER_VEHICLE) {
      throw new BadRequestException(
        `This vehicle already has the maximum of ${MAX_MEDIA_PER_VEHICLE} media items`,
      );
    }

    const path = `${tenantId}/${vehicleId}/${randomUUID()}-${sanitizeFileName(file.originalname)}`;
    const visibility = bucketVisibility(type as MediaType);
    const { url } = await this.storage.upload(
      visibility,
      path,
      file.buffer,
      file.mimetype,
    );

    const isPrimary = existingCount === 0 && type === 'image';

    return this.prisma.client.vehicleMedia.create({
      data: {
        vehicleId,
        tenantId,
        type,
        url,
        storagePath: path,
        isPrimary,
        sortOrder: existingCount,
        uploadedBy: userId,
      },
    });
  }

  async remove(tenantId: string, vehicleId: string, mediaId: string) {
    const media = await this.prisma.client.vehicleMedia.findUnique({
      where: { id: mediaId },
    });
    if (!media || media.vehicleId !== vehicleId)
      throw new NotFoundException('Media not found');

    await this.storage.delete(
      bucketVisibility(media.type as MediaType),
      media.storagePath,
    );
    await this.prisma.client.vehicleMedia.delete({ where: { id: mediaId } });
  }

  async setPrimary(tenantId: string, vehicleId: string, mediaId: string) {
    const media = await this.prisma.client.vehicleMedia.findUnique({
      where: { id: mediaId },
    });
    if (!media || media.vehicleId !== vehicleId)
      throw new NotFoundException('Media not found');

    return this.prisma.client.$transaction(async (tx) => {
      await tx.vehicleMedia.updateMany({
        where: { vehicleId },
        data: { isPrimary: false },
      });
      return tx.vehicleMedia.update({
        where: { id: mediaId },
        data: { isPrimary: true },
      });
    });
  }

  /** Private-bucket documents need a fresh signed URL per read — the stored `url` on document rows is a snapshot, not reusable. */
  async getSignedDocumentUrl(vehicleId: string, mediaId: string) {
    const media = await this.prisma.client.vehicleMedia.findUnique({
      where: { id: mediaId },
    });
    if (!media || media.vehicleId !== vehicleId || media.type !== 'document')
      throw new NotFoundException('Document not found');
    return this.storage.getSignedUrl(media.storagePath);
  }
}
