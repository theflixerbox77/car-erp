import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PUBLIC_VEHICLE_SELECT,
  toPublicVehicle,
} from './dto/public-vehicle.mapper';

@Injectable()
export class StorefrontCustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async listWishlist(tenantId: string, customerAccountId: string) {
    const rows = await this.prisma.raw.wishlist.findMany({
      where: { tenantId, customerAccountId },
      include: { vehicle: { select: PUBLIC_VEHICLE_SELECT } },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => toPublicVehicle(r.vehicle));
  }

  async addToWishlist(
    tenantId: string,
    customerAccountId: string,
    vehicleId: string,
  ) {
    await this.prisma.raw.wishlist.upsert({
      where: { customerAccountId_vehicleId: { customerAccountId, vehicleId } },
      update: {},
      create: { tenantId, customerAccountId, vehicleId },
    });
    return { success: true };
  }

  async removeFromWishlist(customerAccountId: string, vehicleId: string) {
    await this.prisma.raw.wishlist.deleteMany({
      where: { customerAccountId, vehicleId },
    });
    return { success: true };
  }

  listBookings(tenantId: string, customerAccountId: string) {
    return this.prisma.raw.booking.findMany({
      where: { tenantId, customerAccountId },
      include: {
        vehicle: {
          select: { brand: true, model: true, year: true, stockNumber: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
