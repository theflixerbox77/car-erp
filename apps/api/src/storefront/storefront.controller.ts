import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StorefrontService } from './storefront.service';
import { QueryPublicVehiclesDto } from './dto/query-public-vehicles.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('storefront/:slug')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get()
  getDealer(@Param('slug') slug: string) {
    return this.storefrontService.resolveTenant(slug);
  }

  @Get('vehicles')
  listVehicles(
    @Param('slug') slug: string,
    @Query() query: QueryPublicVehiclesDto,
  ) {
    return this.storefrontService.listVehicles(slug, query);
  }

  @Get('vehicles/:id')
  getVehicle(@Param('slug') slug: string, @Param('id') id: string) {
    return this.storefrontService.getVehicle(slug, id);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('inquiries')
  createInquiry(@Param('slug') slug: string, @Body() dto: CreateInquiryDto) {
    return this.storefrontService.createInquiry(slug, dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('bookings')
  createBooking(@Param('slug') slug: string, @Body() dto: CreateBookingDto) {
    return this.storefrontService.createBooking(slug, dto);
  }
}
