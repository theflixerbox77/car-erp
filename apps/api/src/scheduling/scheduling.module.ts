import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
