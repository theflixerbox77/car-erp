import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.storefrontInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            stockNumber: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, dto: UpdateInquiryStatusDto) {
    const existing = await this.prisma.client.storefrontInquiry.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Inquiry not found');
    return this.prisma.client.storefrontInquiry.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
