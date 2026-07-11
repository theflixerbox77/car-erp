import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PUBLIC_VEHICLE_SELECT, PUBLIC_VEHICLE_STATUSES, toPublicVehicle } from './dto/public-vehicle.mapper';
import { QueryPublicVehiclesDto } from './dto/query-public-vehicles.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { CreateBookingDto } from './dto/create-booking.dto';

const SORT_COLUMN_MAP: Record<string, string> = {
  created_at: 'createdAt',
  year: 'year',
  selling_price: 'sellingPrice',
  mileage: 'mileage',
};

@Injectable()
export class StorefrontService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Every storefront method resolves the tenant from the slug first, then
   * uses the raw (unscoped) Prisma client with an explicit tenantId filter --
   * these are anonymous public requests with no JWT, so the AsyncLocalStorage
   * tenant context the extension relies on was never established.
   */
  async resolveTenant(slug: string) {
    const tenant = await this.prisma.raw.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        businessName: true,
        logoUrl: true,
        address: true,
        city: true,
        country: true,
        phone: true,
        whatsappNumber: true,
        storefrontSettings: true,
        subscriptionStatus: true,
      },
    });
    if (!tenant || tenant.subscriptionStatus !== 'active') throw new NotFoundException('Dealer not found');
    return tenant;
  }

  async listVehicles(slug: string, query: QueryPublicVehiclesDto) {
    const tenant = await this.resolveTenant(slug);
    const db = this.prisma.raw;

    const where: Record<string, unknown> = { tenantId: tenant.id, status: { in: PUBLIC_VEHICLE_STATUSES } };
    if (query.brand) where.brand = { equals: query.brand, mode: 'insensitive' };
    if (query.color) where.color = { equals: query.color, mode: 'insensitive' };
    if (query.transmission) where.transmission = { equals: query.transmission, mode: 'insensitive' };
    if (query.fuelType) where.fuelType = { equals: query.fuelType, mode: 'insensitive' };
    if (query.minYear || query.maxYear) where.year = { gte: query.minYear, lte: query.maxYear };
    if (query.maxMileage) where.mileage = { lte: query.maxMileage };
    if (query.minPrice || query.maxPrice) where.sellingPrice = { gte: query.minPrice, lte: query.maxPrice };
    if (query.search) {
      where.OR = [
        { brand: { contains: query.search, mode: 'insensitive' } },
        { model: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortColumn = SORT_COLUMN_MAP[query.sortBy ?? 'created_at'];

    const [items, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        take: query.limit,
        skip: query.offset,
        orderBy: { [sortColumn]: query.sortDir ?? 'desc' },
        select: PUBLIC_VEHICLE_SELECT,
      }),
      db.vehicle.count({ where }),
    ]);

    return { tenant, items: items.map(toPublicVehicle), total, limit: query.limit, offset: query.offset };
  }

  async getVehicle(slug: string, vehicleId: string) {
    const tenant = await this.resolveTenant(slug);
    const vehicle = await this.prisma.raw.vehicle.findUnique({ where: { id: vehicleId }, select: PUBLIC_VEHICLE_SELECT });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    // findUnique above ignores tenant scope by design (raw client) -- verify ownership explicitly.
    const owned = await this.prisma.raw.vehicle.findFirst({ where: { id: vehicleId, tenantId: tenant.id } });
    if (!owned || !PUBLIC_VEHICLE_STATUSES.includes(owned.status as (typeof PUBLIC_VEHICLE_STATUSES)[number])) {
      throw new NotFoundException('Vehicle not found');
    }
    return { tenant, vehicle: toPublicVehicle(vehicle) };
  }

  async createInquiry(slug: string, dto: CreateInquiryDto) {
    const tenant = await this.resolveTenant(slug);
    if (dto.vehicleId) {
      const vehicle = await this.prisma.raw.vehicle.findFirst({ where: { id: dto.vehicleId, tenantId: tenant.id } });
      if (!vehicle) throw new BadRequestException('Vehicle not found');
    }
    return this.prisma.raw.storefrontInquiry.create({
      data: {
        tenantId: tenant.id,
        vehicleId: dto.vehicleId,
        customerName: dto.customerName,
        phone: dto.phone,
        email: dto.email,
        message: dto.message,
        source: dto.source ?? 'contact_form',
      },
    });
  }

  async createBooking(slug: string, dto: CreateBookingDto, customerAccountId?: string) {
    const tenant = await this.resolveTenant(slug);
    const vehicle = await this.prisma.raw.vehicle.findFirst({ where: { id: dto.vehicleId, tenantId: tenant.id } });
    if (!vehicle) throw new BadRequestException('Vehicle not found');

    return this.prisma.raw.booking.create({
      data: {
        tenantId: tenant.id,
        vehicleId: dto.vehicleId,
        customerAccountId,
        type: dto.type,
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        note: dto.note,
      },
    });
  }
}
