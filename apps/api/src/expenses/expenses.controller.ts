import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpensesService } from './expenses.service';
import { CreateExpenseCategoryDto } from './dto/create-category.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateRecurringScheduleDto } from './dto/create-recurring-schedule.dto';
import { Permissions } from '../common/decorators/permissions.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { RequestUser } from '../common/tenancy/types';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('expenses')
@UseGuards(TenantScopedGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('categories')
  @Permissions('expenses.view')
  listCategories() {
    return this.expensesService.listCategories();
  }

  @Post('categories')
  @Permissions('expenses.create')
  createCategory(@CurrentUser() user: RequestUser, @Body() dto: CreateExpenseCategoryDto) {
    return this.expensesService.createCategory(user.tenantId as string, dto);
  }

  @Get('recurring')
  @Permissions('expenses.view')
  listRecurring() {
    return this.expensesService.listRecurringSchedules();
  }

  @Post('recurring')
  @Permissions('expenses.create')
  createRecurring(@CurrentUser() user: RequestUser, @Body() dto: CreateRecurringScheduleDto) {
    return this.expensesService.createRecurringSchedule(user.tenantId as string, dto);
  }

  @Patch('recurring/:id/deactivate')
  @Permissions('expenses.create')
  deactivateRecurring(@Param('id') id: string) {
    return this.expensesService.deactivateRecurringSchedule(id);
  }

  @Get()
  @Permissions('expenses.view')
  findAll(@Query('status') status?: string) {
    return this.expensesService.findAll(status);
  }

  @Post()
  @Permissions('expenses.create')
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(user.tenantId as string, user.id, dto);
  }

  @Patch(':id/approve')
  @Permissions('expenses.approve')
  approve(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.expensesService.approve(id, user.id);
  }

  @Patch(':id/reject')
  @Permissions('expenses.approve')
  reject(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.expensesService.reject(id, user.id);
  }

  @Post(':id/receipt')
  @Permissions('expenses.create')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadReceipt(@CurrentUser() user: RequestUser, @Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return this.expensesService.uploadReceipt(user.tenantId as string, id, file);
  }

  @Get(':id/receipt/signed-url')
  @Permissions('expenses.view')
  getReceiptUrl(@Param('id') id: string) {
    return this.expensesService.getReceiptSignedUrl(id).then((url) => ({ url }));
  }
}
