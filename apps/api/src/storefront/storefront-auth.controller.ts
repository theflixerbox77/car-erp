import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { StorefrontAuthService } from './storefront-auth.service';
import { RegisterCustomerDto, LoginCustomerDto } from './dto/customer-auth.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@Controller('storefront/:slug/auth')
export class StorefrontAuthController {
  constructor(private readonly storefrontAuthService: StorefrontAuthService) {}

  @Post('register')
  register(@Param('slug') slug: string, @Body() dto: RegisterCustomerDto) {
    return this.storefrontAuthService.register(slug, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Param('slug') slug: string, @Body() dto: LoginCustomerDto) {
    return this.storefrontAuthService.login(slug, dto);
  }
}
