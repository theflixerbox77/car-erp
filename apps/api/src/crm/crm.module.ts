import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  controllers: [CustomersController, InquiriesController, BookingsController],
  providers: [CustomersService, InquiriesService, BookingsService],
  exports: [CustomersService],
})
export class CrmModule {}
