import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('customers')
@UseGuards(TenantScopedGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Permissions('crm.view')
  findAll(@Query('search') search?: string) {
    return this.customersService.findAll(search);
  }

  @Get(':id')
  @Permissions('crm.view')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  @Permissions('crm.manage')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(user.tenantId as string, dto);
  }

  @Patch(':id')
  @Permissions('crm.manage')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Post(':id/interactions')
  @Permissions('crm.manage')
  addInteraction(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: CreateInteractionDto,
  ) {
    return this.customersService.addInteraction(
      user.tenantId as string,
      id,
      user.id,
      dto,
    );
  }

  @Post(':id/interested-vehicles/:vehicleId')
  @Permissions('crm.manage')
  addInterestedVehicle(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.customersService.addInterestedVehicle(
      user.tenantId as string,
      id,
      vehicleId,
    );
  }
}
