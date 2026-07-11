import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

/** Staff-facing view of reservations/test-drive bookings captured through the public storefront. */
@Controller('bookings')
@UseGuards(TenantScopedGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @Permissions('crm.view')
  findAll() {
    return this.bookingsService.findAll();
  }

  @Patch(':id/status')
  @Permissions('crm.manage')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto);
  }
}
