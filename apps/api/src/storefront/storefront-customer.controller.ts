import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { StorefrontCustomerService } from './storefront-customer.service';
import { StorefrontAuthGuard } from './storefront-auth.guard';
import { Public } from '../common/decorators/public.decorator';

interface CustomerRequest extends Request {
  customerAccount: { id: string; tenantId: string };
}

@Public()
@Controller('storefront/account')
@UseGuards(StorefrontAuthGuard)
export class StorefrontCustomerController {
  constructor(private readonly customerService: StorefrontCustomerService) {}

  @Get('wishlist')
  listWishlist(@Req() req: CustomerRequest) {
    return this.customerService.listWishlist(req.customerAccount.tenantId, req.customerAccount.id);
  }

  @Post('wishlist/:vehicleId')
  addToWishlist(@Req() req: CustomerRequest, @Param('vehicleId') vehicleId: string) {
    return this.customerService.addToWishlist(req.customerAccount.tenantId, req.customerAccount.id, vehicleId);
  }

  @Delete('wishlist/:vehicleId')
  removeFromWishlist(@Req() req: CustomerRequest, @Param('vehicleId') vehicleId: string) {
    return this.customerService.removeFromWishlist(req.customerAccount.id, vehicleId);
  }

  @Get('bookings')
  listBookings(@Req() req: CustomerRequest) {
    return this.customerService.listBookings(req.customerAccount.tenantId, req.customerAccount.id);
  }
}
