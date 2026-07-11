import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { ChangeStatusDto } from './dto/change-status.dto';

const SORT_COLUMN_MAP: Record<string, string> = {
  created_at: 'createdAt',
  year: 'year',
  selling_price: 'sellingPrice',
  mileage: 'mileage',
};

/** Prisma returns Decimal.js instances for @db.Decimal columns — coerce explicitly, `+` on them concatenates strings instead of adding. */
function toNum(value: unknown): number {
  if (value == null) return 0;
  return typeof value === 'number' ? value : Number(value);
}

function computeTotalCost(v: {
  importCost?: unknown;
  auctionCost?: unknown;
  shippingCost?: unknown;
  customsCost?: unknown;
  repairCost?: unknown;
  registrationCost?: unknown;
}): number {
  return (
    toNum(v.importCost) +
    toNum(v.auctionCost) +
    toNum(v.shippingCost) +
    toNum(v.customsCost) +
    toNum(v.repairCost) +
    toNum(v.registrationCost)
  );
}

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateVehicleDto) {
    const totalCost = computeTotalCost(dto);
    const expectedProfit =
      dto.expectedProfit ??
      (dto.sellingPrice != null ? dto.sellingPrice - totalCost : undefined);

    const existing = await this.prisma.client.vehicle.findUnique({
      where: {
        tenantId_stockNumber: { tenantId, stockNumber: dto.stockNumber },
      },
    });
    if (existing)
      throw new BadRequestException(
        'A vehicle with that stock number already exists',
      );

    return this.prisma.client.vehicle.create({
      data: {
        ...dto,
        tenantId,
        registrationExpiry: dto.registrationExpiry
          ? new Date(dto.registrationExpiry)
          : undefined,
        totalCost,
        expectedProfit,
        createdBy: userId,
      },
    });
  }

  async findAll(tenantId: string, query: QueryVehiclesDto) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.brand) where.brand = { equals: query.brand, mode: 'insensitive' };
    if (query.search) {
      where.OR = [
        { stockNumber: { contains: query.search, mode: 'insensitive' } },
        { vin: { contains: query.search, mode: 'insensitive' } },
        { brand: { contains: query.search, mode: 'insensitive' } },
        { model: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortColumn = SORT_COLUMN_MAP[query.sortBy ?? 'created_at'];

    const [items, total] = await Promise.all([
      this.prisma.client.vehicle.findMany({
        where,
        take: query.limit,
        skip: query.offset,
        orderBy: { [sortColumn]: query.sortDir ?? 'desc' },
        include: { media: { where: { isPrimary: true }, take: 1 } },
      }),
      this.prisma.client.vehicle.count({ where }),
    ]);

    return { items, total, limit: query.limit, offset: query.offset };
  }

  async findOne(tenantId: string, id: string) {
    const vehicle = await this.prisma.client.vehicle.findUnique({
      where: { id },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  private async requireOwned(id: string) {
    const vehicle = await this.prisma.client.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(tenantId: string, id: string, dto: UpdateVehicleDto) {
    const current = await this.requireOwned(id);

    const merged = { ...current, ...dto };
    const totalCost = computeTotalCost(merged);
    const sellingPrice =
      dto.sellingPrice ??
      (current.sellingPrice ? Number(current.sellingPrice) : undefined);
    const expectedProfit =
      dto.expectedProfit ??
      (sellingPrice != null ? sellingPrice - totalCost : undefined);

    return this.prisma.client.vehicle.update({
      where: { id },
      data: {
        ...dto,
        registrationExpiry: dto.registrationExpiry
          ? new Date(dto.registrationExpiry)
          : undefined,
        totalCost,
        expectedProfit,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.requireOwned(id);
    await this.prisma.client.vehicle.delete({ where: { id } });
  }

  async changeStatus(
    tenantId: string,
    id: string,
    userId: string,
    dto: ChangeStatusDto,
  ) {
    const vehicle = await this.requireOwned(id);
    if (vehicle.status === dto.status) return vehicle;

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.vehicle.update({
        where: { id },
        data: {
          status: dto.status,
          soldAt: dto.status === 'sold' ? new Date() : vehicle.soldAt,
        },
      });
      await tx.vehicleStatusHistory.create({
        data: {
          vehicleId: id,
          tenantId,
          fromStatus: vehicle.status,
          toStatus: dto.status,
          changedBy: userId,
          note: dto.note,
        },
      });
      return updated;
    });
  }
}
