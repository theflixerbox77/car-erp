import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { StorefrontAuthService } from './storefront-auth.service';
import { RegisterCustomerDto, LoginCustomerDto } from './dto/customer-auth.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('storefront/:slug/auth')
export class StorefrontAuthController {
  constructor(private readonly storefrontAuthService: StorefrontAuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('register')
  register(@Param('slug') slug: string, @Body() dto: RegisterCustomerDto) {
    return this.storefrontAuthService.register(slug, dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Param('slug') slug: string, @Body() dto: LoginCustomerDto) {
    return this.storefrontAuthService.login(slug, dto);
  }
}
