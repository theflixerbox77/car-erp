import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

const WARRANTY_LOOKAHEAD_DAYS = 14;

function addInterval(date: Date, frequency: string): Date {
  const next = new Date(date);
  if (frequency === 'weekly') next.setDate(next.getDate() + 7);
  else if (frequency === 'monthly') next.setMonth(next.getMonth() + 1);
  else if (frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
  return next;
}

/**
 * Runs platform-wide, across every tenant, so it deliberately uses the raw
 * (unscoped) Prisma client -- there is no single-tenant request context here.
 * Every query/write below must carry an explicit tenantId itself.
 */
@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async generateRecurringExpenses() {
    const db = this.prisma.raw;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueSchedules = await db.recurringExpenseSchedule.findMany({
      where: { isActive: true, nextRunDate: { lte: today } },
    });

    let created = 0;
    for (const schedule of dueSchedules) {
      await db.expense.create({
        data: {
          tenantId: schedule.tenantId,
          categoryId: schedule.categoryId,
          amount: schedule.amount,
          description: schedule.description ?? 'Recurring expense',
          status: 'approved',
          isRecurring: true,
        },
      });
      await db.recurringExpenseSchedule.update({
        where: { id: schedule.id },
        data: {
          nextRunDate: addInterval(schedule.nextRunDate, schedule.frequency),
        },
      });
      created += 1;
    }
    this.logger.log(
      `Generated ${created} recurring expense(s) from ${dueSchedules.length} due schedule(s).`,
    );
    return { generated: created };
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async generateReminders() {
    const db = this.prisma.raw;
    const now = new Date();
    const lookahead = new Date(now);
    lookahead.setDate(lookahead.getDate() + WARRANTY_LOOKAHEAD_DAYS);

    const candidateSales = await db.sale.findMany({
      where: {
        status: 'active',
        deliveryDate: { not: null },
        warrantyMonths: { not: null },
      },
      select: {
        id: true,
        tenantId: true,
        deliveryDate: true,
        warrantyMonths: true,
        salespersonId: true,
        customerId: true,
      },
    });

    let created = 0;
    for (const sale of candidateSales) {
      if (!sale.deliveryDate || !sale.warrantyMonths) continue;
      const expiry = new Date(sale.deliveryDate);
      expiry.setMonth(expiry.getMonth() + sale.warrantyMonths);
      if (expiry < now || expiry > lookahead) continue;

      const existing = await db.reminder.findFirst({
        where: {
          tenantId: sale.tenantId,
          type: 'warranty_expiry',
          relatedSaleId: sale.id,
        },
      });
      if (existing) continue;

      const reminder = await db.reminder.create({
        data: {
          tenantId: sale.tenantId,
          type: 'warranty_expiry',
          relatedSaleId: sale.id,
          relatedCustomerId: sale.customerId,
          dueAt: expiry,
          assignedTo: sale.salespersonId,
          note: `Warranty expires ${expiry.toLocaleDateString()}`,
        },
      });
      await db.notification.create({
        data: {
          tenantId: sale.tenantId,
          userId: sale.salespersonId,
          title: 'Warranty expiring soon',
          body: `A sale's warranty expires on ${expiry.toLocaleDateString()}.`,
          type: 'warranty_expiry',
          relatedEntityType: 'sale',
          relatedEntityId: sale.id,
        },
      });
      await db.reminder.update({
        where: { id: reminder.id },
        data: { status: 'surfaced' },
      });
      created += 1;
    }
    this.logger.log(
      `Generated ${created} warranty reminder(s) from ${candidateSales.length} candidate sale(s).`,
    );
    return { generated: created };
  }
}
