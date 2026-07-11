import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ChangeStageDto } from './dto/change-stage.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('leads')
@UseGuards(TenantScopedGuard)
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get('board')
  @Permissions('sales.view')
  board() {
    return this.leadsService.board();
  }

  @Get()
  @Permissions('sales.view')
  findAll() {
    return this.leadsService.findAll();
  }

  @Get(':id')
  @Permissions('sales.view')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Post()
  @Permissions('sales.create')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(user.tenantId as string, dto);
  }

  @Patch(':id/stage')
  @Permissions('sales.update')
  changeStage(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: ChangeStageDto) {
    return this.leadsService.changeStage(user.tenantId as string, id, user.id, dto);
  }
}
