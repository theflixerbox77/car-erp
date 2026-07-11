import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { PlatformAdminGuard } from '../common/guards/platform-admin.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantsService } from './tenants.service';

@Controller('platform/dealers')
@UseGuards(PlatformAdminGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  list() {
    return this.tenantsService.list();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tenantsService.approve(id, user.id);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tenantsService.suspend(id, user.id);
  }

  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.tenantsService.reactivate(id, user.id);
  }
}
