import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller()
@UseGuards(TenantScopedGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('employees')
  @Permissions('employees.view')
  findAll() {
    return this.employeesService.findAll();
  }

  @Get('employees/:id')
  @Permissions('employees.view')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Post('employees')
  @Permissions('employees.manage')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateEmployeeDto) {
    return this.employeesService.create(user.tenantId as string, dto);
  }

  @Post('employees/:id/check-in')
  @Permissions('employees.view')
  checkIn(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.employeesService.checkIn(user.tenantId as string, id);
  }

  @Post('employees/:id/check-out')
  @Permissions('employees.view')
  checkOut(@Param('id') id: string) {
    return this.employeesService.checkOut(id);
  }

  @Get('attendance')
  @Permissions('employees.view')
  listAttendance(@Query('employeeId') employeeId?: string) {
    return this.employeesService.listAttendance(employeeId);
  }

  @Post('employees/:id/leave-requests')
  @Permissions('employees.view')
  createLeaveRequest(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: CreateLeaveRequestDto) {
    return this.employeesService.createLeaveRequest(user.tenantId as string, id, dto);
  }

  @Get('leave-requests')
  @Permissions('employees.view')
  listLeaveRequests(@Query('status') status?: string) {
    return this.employeesService.listLeaveRequests(status);
  }

  @Patch('leave-requests/:id/approve')
  @Permissions('employees.manage')
  approveLeave(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.employeesService.reviewLeaveRequest(id, user.id, 'approved');
  }

  @Patch('leave-requests/:id/reject')
  @Permissions('employees.manage')
  rejectLeave(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.employeesService.reviewLeaveRequest(id, user.id, 'rejected');
  }
}
