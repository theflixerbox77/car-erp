import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';
import { StorefrontAuthController } from './storefront-auth.controller';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontCustomerController } from './storefront-customer.controller';
import { StorefrontCustomerService } from './storefront-customer.service';
import { StorefrontAuthGuard } from './storefront-auth.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    StorefrontController,
    StorefrontAuthController,
    StorefrontCustomerController,
  ],
  providers: [
    StorefrontService,
    StorefrontAuthService,
    StorefrontCustomerService,
    StorefrontAuthGuard,
  ],
})
export class StorefrontModule {}
