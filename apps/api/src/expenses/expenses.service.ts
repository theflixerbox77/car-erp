import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_PROVIDER } from '../storage/storage-provider.interface';
import type { StorageProvider } from '../storage/storage-provider.interface';
import { CreateExpenseCategoryDto } from './dto/create-category.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateRecurringScheduleDto } from './dto/create-recurring-schedule.dto';

const EXPENSE_INCLUDE = { category: true, vehicle: { select: { id: true, brand: true, model: true, stockNumber: true } } };

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
  ) {}

  // --- Categories ---
  createCategory(tenantId: string, dto: CreateExpenseCategoryDto) {
    return this.prisma.client.expenseCategory.create({ data: { ...dto, tenantId } });
  }

  listCategories() {
    return this.prisma.client.expenseCategory.findMany({ orderBy: { name: 'asc' } });
  }

  // --- Expenses ---
  create(tenantId: string, userId: string, dto: CreateExpenseDto) {
    return this.prisma.client.expense.create({
      data: {
        tenantId,
        categoryId: dto.categoryId,
        vehicleId: dto.vehicleId,
        amount: dto.amount,
        description: dto.description,
        expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : undefined,
        isRecurring: dto.isRecurring ?? false,
        submittedBy: userId,
      },
      include: EXPENSE_INCLUDE,
    });
  }

  findAll(status?: string) {
    return this.prisma.client.expense.findMany({
      where: status ? { status } : undefined,
      include: EXPENSE_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  private async requireExpense(id: string) {
    const expense = await this.prisma.client.expense.findUnique({ where: { id } });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async approve(id: string, userId: string) {
    const expense = await this.requireExpense(id);
    if (expense.status !== 'pending') throw new BadRequestException('Only pending expenses can be approved');
    return this.prisma.client.expense.update({
      where: { id },
      data: { status: 'approved', approvedBy: userId, approvedAt: new Date() },
      include: EXPENSE_INCLUDE,
    });
  }

  async reject(id: string, userId: string) {
    const expense = await this.requireExpense(id);
    if (expense.status !== 'pending') throw new BadRequestException('Only pending expenses can be rejected');
    return this.prisma.client.expense.update({
      where: { id },
      data: { status: 'rejected', approvedBy: userId, approvedAt: new Date() },
      include: EXPENSE_INCLUDE,
    });
  }

  async uploadReceipt(tenantId: string, id: string, file: { buffer: Buffer; originalname: string; mimetype: string }) {
    await this.requireExpense(id);
    const path = `${tenantId}/${id}/${randomUUID()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    await this.storage.upload('private', path, file.buffer, file.mimetype);
    return this.prisma.client.expense.update({ where: { id }, data: { receiptStoragePath: path }, include: EXPENSE_INCLUDE });
  }

  async getReceiptSignedUrl(id: string) {
    const expense = await this.requireExpense(id);
    if (!expense.receiptStoragePath) throw new NotFoundException('No receipt uploaded for this expense');
    return this.storage.getSignedUrl(expense.receiptStoragePath);
  }

  // --- Recurring schedules ---
  createRecurringSchedule(tenantId: string, dto: CreateRecurringScheduleDto) {
    return this.prisma.client.recurringExpenseSchedule.create({
      data: { ...dto, tenantId, nextRunDate: new Date(dto.nextRunDate) },
    });
  }

  listRecurringSchedules() {
    return this.prisma.client.recurringExpenseSchedule.findMany({ include: { category: true }, orderBy: { nextRunDate: 'asc' } });
  }

  async deactivateRecurringSchedule(id: string) {
    const schedule = await this.prisma.client.recurringExpenseSchedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Schedule not found');
    return this.prisma.client.recurringExpenseSchedule.update({ where: { id }, data: { isActive: false } });
  }
}
