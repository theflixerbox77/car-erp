import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

const SALE_INCLUDE = {
  customer: { select: { id: true, fullName: true, phone: true, email: true } },
  vehicle: { select: { id: true, brand: true, model: true, year: true, stockNumber: true, totalCost: true } },
  payments: { orderBy: { paidAt: 'desc' as const } },
  documents: { orderBy: { generatedAt: 'desc' as const } },
};

function toNum(value: unknown): number {
  if (value == null) return 0;
  return typeof value === 'number' ? value : Number(value);
}

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, userId: string, dto: CreateSaleDto) {
    const vehicle = await this.prisma.client.vehicle.findUnique({ where: { id: dto.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.status === 'sold') throw new BadRequestException('This vehicle is already sold');

    const discount = dto.discount ?? 0;
    const commissionRate = dto.commissionRate ?? 0;
    const netTotal = dto.salePrice - discount;
    const commissionAmount = (netTotal * commissionRate) / 100;
    const profit = netTotal - toNum(vehicle.totalCost) - commissionAmount;

    return this.prisma.client.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          tenantId,
          leadId: dto.leadId,
          customerId: dto.customerId,
          vehicleId: dto.vehicleId,
          salespersonId: dto.salespersonId ?? userId,
          salePrice: dto.salePrice,
          discount,
          commissionRate,
          commissionAmount,
          profit,
          deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : undefined,
          warrantyMonths: dto.warrantyMonths,
          warrantyNotes: dto.warrantyNotes,
        },
        include: SALE_INCLUDE,
      });

      await tx.vehicle.update({ where: { id: dto.vehicleId }, data: { status: 'sold', soldAt: new Date() } });
      await tx.vehicleStatusHistory.create({
        data: { vehicleId: dto.vehicleId, tenantId, fromStatus: vehicle.status, toStatus: 'sold', changedBy: userId, note: `Sale ${sale.id}` },
      });

      if (dto.leadId) {
        const lead = await tx.lead.findUnique({ where: { id: dto.leadId } });
        if (lead && lead.stage !== 'completed') {
          await tx.lead.update({ where: { id: dto.leadId }, data: { stage: 'completed' } });
          await tx.leadStageHistory.create({
            data: { leadId: dto.leadId, tenantId, fromStage: lead.stage, toStage: 'completed', changedBy: userId, note: `Converted to sale ${sale.id}` },
          });
        }
      }

      return sale;
    });
  }

  findAll() {
    return this.prisma.client.sale.findMany({ include: SALE_INCLUDE, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const sale = await this.prisma.client.sale.findUnique({ where: { id }, include: SALE_INCLUDE });
    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async recordPayment(tenantId: string, saleId: string, userId: string, dto: RecordPaymentDto) {
    const sale = await this.prisma.client.sale.findUnique({ where: { id: saleId }, include: { payments: true } });
    if (!sale) throw new NotFoundException('Sale not found');

    const netTotal = toNum(sale.salePrice) - toNum(sale.discount);
    const alreadyPaid = sale.payments.reduce((sum, p) => sum + toNum(p.amount), 0);
    const newTotal = alreadyPaid + dto.amount;
    const paymentStatus = newTotal >= netTotal ? 'paid' : newTotal > 0 ? 'partial' : 'pending';

    return this.prisma.client.$transaction(async (tx) => {
      const payment = await tx.salePayment.create({
        data: { saleId, tenantId, amount: dto.amount, method: dto.method, referenceNote: dto.referenceNote, recordedBy: userId },
      });
      await tx.sale.update({ where: { id: saleId }, data: { paymentStatus } });
      return payment;
    });
  }
}
