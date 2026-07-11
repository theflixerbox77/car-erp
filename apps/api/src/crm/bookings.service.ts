import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.booking.findMany({
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

  async updateStatus(id: string, dto: UpdateBookingStatusDto) {
    const existing = await this.prisma.client.booking.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Booking not found');
    return this.prisma.client.booking.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
