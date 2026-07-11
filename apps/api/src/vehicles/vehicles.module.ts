import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { VehicleMediaService } from './vehicle-media.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, VehicleMediaService],
})
export class VehiclesModule {}
