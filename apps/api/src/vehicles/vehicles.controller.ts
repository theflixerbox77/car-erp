import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { VehicleMediaService } from './vehicle-media.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehiclesDto } from './dto/query-vehicles.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

const MAX_MEDIA_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

@Controller('vehicles')
@UseGuards(TenantScopedGuard)
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly mediaService: VehicleMediaService,
  ) {}

  @Get()
  @Permissions('inventory.view')
  findAll(@CurrentUser() user: RequestUser, @Query() query: QueryVehiclesDto) {
    return this.vehiclesService.findAll(user.tenantId as string, query);
  }

  @Get(':id')
  @Permissions('inventory.view')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.vehiclesService.findOne(user.tenantId as string, id);
  }

  @Post()
  @Permissions('inventory.create')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user.tenantId as string, user.id, dto);
  }

  @Patch(':id')
  @Permissions('inventory.update')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user.tenantId as string, id, dto);
  }

  @Patch(':id/status')
  @Permissions('inventory.update')
  changeStatus(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto,
  ) {
    return this.vehiclesService.changeStatus(
      user.tenantId as string,
      id,
      user.id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('inventory.delete')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.vehiclesService.remove(user.tenantId as string, id);
  }

  @Post(':id/media')
  @Permissions('inventory.update')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_MEDIA_FILE_SIZE_BYTES },
    }),
  )
  uploadMedia(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body('type') type: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    return this.mediaService.upload(
      user.tenantId as string,
      id,
      user.id,
      type,
      file,
    );
  }

  @Delete(':id/media/:mediaId')
  @Permissions('inventory.update')
  removeMedia(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.mediaService.remove(user.tenantId as string, id, mediaId);
  }

  @Patch(':id/media/:mediaId/primary')
  @Permissions('inventory.update')
  setPrimaryMedia(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.mediaService.setPrimary(user.tenantId as string, id, mediaId);
  }

  @Get(':id/media/:mediaId/signed-url')
  @Permissions('inventory.view')
  getSignedDocumentUrl(
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.mediaService
      .getSignedDocumentUrl(id, mediaId)
      .then((url) => ({ url }));
  }
}
