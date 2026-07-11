import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('notifications')
@UseGuards(TenantScopedGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.notificationsService.findForUser(user.id);
  }

  @Patch(':id/read')
  markRead(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.notificationsService.markRead(user.id, id);
  }
}
