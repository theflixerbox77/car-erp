import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { Permissions } from '../common/decorators/permissions.decorator';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('settings')
@UseGuards(TenantScopedGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('business')
  getBusiness(@CurrentUser() user: RequestUser) {
    return this.settingsService.getBusiness(user.tenantId as string);
  }

  @Patch('business')
  @Permissions('settings.manage')
  updateBusiness(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateBusinessSettingsDto,
  ) {
    return this.settingsService.updateBusiness(user.tenantId as string, dto);
  }
}
