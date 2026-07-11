import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateInteractionDto } from './dto/create-interaction.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateCustomerDto) {
    return this.prisma.client.customer.create({ data: { ...dto, tenantId } });
  }

  findAll(search?: string) {
    return this.prisma.client.customer.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.client.customer.findUnique({
      where: { id },
      include: {
        interactions: { orderBy: { occurredAt: 'desc' } },
        interests: { include: { vehicle: { select: { id: true, brand: true, model: true, year: true, stockNumber: true } } } },
        leads: { orderBy: { createdAt: 'desc' } },
        sales: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.requireExists(id);
    return this.prisma.client.customer.update({ where: { id }, data: dto });
  }

  private async requireExists(id: string) {
    const customer = await this.prisma.client.customer.findUnique({ where: { id } });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async addInteraction(tenantId: string, customerId: string, userId: string, dto: CreateInteractionDto) {
    await this.requireExists(customerId);
    return this.prisma.client.customerInteraction.create({
      data: {
        tenantId,
        customerId,
        type: dto.type,
        summary: dto.summary,
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : undefined,
        createdBy: userId,
      },
    });
  }

  async addInterestedVehicle(tenantId: string, customerId: string, vehicleId: string) {
    await this.requireExists(customerId);
    return this.prisma.client.customerInterestedVehicle.upsert({
      where: { customerId_vehicleId: { customerId, vehicleId } },
      update: {},
      create: { tenantId, customerId, vehicleId },
    });
  }
}
