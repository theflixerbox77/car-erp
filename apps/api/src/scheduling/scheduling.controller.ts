import { Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { PlatformAdminGuard } from '../common/guards/platform-admin.guard';

/** Manual trigger for the same jobs the cron schedule runs -- useful for ops and for testing without waiting for 1am/2am. */
@Controller('platform/scheduling')
@UseGuards(PlatformAdminGuard)
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post('recurring-expenses/run')
  runRecurringExpenses() {
    return this.schedulingService.generateRecurringExpenses();
  }

  @Post('reminders/run')
  runReminders() {
    return this.schedulingService.generateReminders();
  }
}
