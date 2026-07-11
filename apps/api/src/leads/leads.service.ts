import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ChangeStageDto, LEAD_STAGES } from './dto/change-stage.dto';

const LEAD_INCLUDE = {
  customer: { select: { id: true, fullName: true, phone: true, email: true } },
  vehicle: {
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      stockNumber: true,
    },
  },
};

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateLeadDto) {
    return this.prisma.client.lead.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        vehicleId: dto.vehicleId,
        source: dto.source,
        expectedCloseDate: dto.expectedCloseDate
          ? new Date(dto.expectedCloseDate)
          : undefined,
        assignedTo: dto.assignedTo,
      },
      include: LEAD_INCLUDE,
    });
  }

  /** Pipeline board: every active (non-terminal) lead, grouped by stage. */
  async board() {
    const leads = await this.prisma.client.lead.findMany({
      where: { stage: { notIn: ['completed', 'lost'] } },
      include: LEAD_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });

    const columns: Record<string, typeof leads> = {};
    for (const stage of LEAD_STAGES) columns[stage] = [];
    for (const lead of leads) columns[lead.stage]?.push(lead);
    return columns;
  }

  findAll() {
    return this.prisma.client.lead.findMany({
      include: LEAD_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.client.lead.findUnique({
      where: { id },
      include: {
        ...LEAD_INCLUDE,
        stageHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async changeStage(
    tenantId: string,
    id: string,
    userId: string,
    dto: ChangeStageDto,
  ) {
    const lead = await this.prisma.client.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.stage === dto.stage) return lead;

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.lead.update({
        where: { id },
        data: {
          stage: dto.stage,
          lostReason: dto.stage === 'lost' ? dto.lostReason : lead.lostReason,
        },
        include: LEAD_INCLUDE,
      });
      await tx.leadStageHistory.create({
        data: {
          leadId: id,
          tenantId,
          fromStage: lead.stage,
          toStage: dto.stage,
          changedBy: userId,
          note: dto.note,
        },
      });
      return updated;
    });
  }
}
