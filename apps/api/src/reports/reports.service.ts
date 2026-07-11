import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function toNum(value: unknown): number {
  if (value == null) return 0;
  return typeof value === 'number' ? value : Number(value);
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Last N months (oldest first) as "YYYY-MM" keys, so charts have a stable x-axis even for months with no data. */
function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth() - i, 1);
    months.push(monthKey(d));
  }
  return months;
}

function twelveMonthsAgo(): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - 11);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async salesReport() {
    const since = twelveMonthsAgo();
    const sales = await this.prisma.client.sale.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, salePrice: true, discount: true, status: true },
    });

    const months = lastNMonths(12);
    const byMonth = new Map(months.map((m) => [m, { month: m, count: 0, revenue: 0 }]));
    for (const sale of sales) {
      if (sale.status === 'cancelled') continue;
      const key = monthKey(sale.createdAt);
      const bucket = byMonth.get(key);
      if (!bucket) continue;
      bucket.count += 1;
      bucket.revenue += toNum(sale.salePrice) - toNum(sale.discount);
    }

    return { trend: Array.from(byMonth.values()), totalSales: sales.length, totalRevenue: sales.reduce((s, x) => s + toNum(x.salePrice) - toNum(x.discount), 0) };
  }

  async expensesReport() {
    const since = twelveMonthsAgo();
    const expenses = await this.prisma.client.expense.findMany({
      where: { expenseDate: { gte: since }, status: 'approved' },
      select: { expenseDate: true, amount: true, category: { select: { name: true } } },
    });

    const months = lastNMonths(12);
    const byMonth = new Map(months.map((m) => [m, { month: m, total: 0 }]));
    const byCategory = new Map<string, number>();
    for (const e of expenses) {
      const key = monthKey(e.expenseDate);
      const bucket = byMonth.get(key);
      if (bucket) bucket.total += toNum(e.amount);
      byCategory.set(e.category.name, (byCategory.get(e.category.name) ?? 0) + toNum(e.amount));
    }

    return {
      trend: Array.from(byMonth.values()),
      byCategory: Array.from(byCategory.entries()).map(([name, total]) => ({ name, total })),
      totalExpenses: expenses.reduce((s, x) => s + toNum(x.amount), 0),
    };
  }

  async profitReport() {
    const since = twelveMonthsAgo();
    const sales = await this.prisma.client.sale.findMany({
      where: { createdAt: { gte: since }, status: { not: 'cancelled' } },
      select: { createdAt: true, salePrice: true, discount: true, profit: true, commissionAmount: true },
    });

    const months = lastNMonths(12);
    const byMonth = new Map(months.map((m) => [m, { month: m, revenue: 0, profit: 0 }]));
    for (const s of sales) {
      const key = monthKey(s.createdAt);
      const bucket = byMonth.get(key);
      if (!bucket) continue;
      bucket.revenue += toNum(s.salePrice) - toNum(s.discount);
      bucket.profit += toNum(s.profit);
    }

    return {
      trend: Array.from(byMonth.values()),
      totalRevenue: sales.reduce((sum, s) => sum + toNum(s.salePrice) - toNum(s.discount), 0),
      totalProfit: sales.reduce((sum, s) => sum + toNum(s.profit), 0),
      totalCommission: sales.reduce((sum, s) => sum + toNum(s.commissionAmount), 0),
    };
  }

  async inventoryReport() {
    const [byStatus, vehicles] = await Promise.all([
      this.prisma.client.vehicle.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.client.vehicle.findMany({ select: { brand: true, status: true, totalCost: true } }),
    ]);

    const byBrand = new Map<string, number>();
    let inventoryValue = 0;
    for (const v of vehicles) {
      byBrand.set(v.brand, (byBrand.get(v.brand) ?? 0) + 1);
      if (v.status !== 'sold') inventoryValue += toNum(v.totalCost);
    }

    return {
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
      byBrand: Array.from(byBrand.entries()).map(([brand, count]) => ({ brand, count })),
      totalVehicles: vehicles.length,
      inventoryValue,
    };
  }

  async customersReport() {
    const since = twelveMonthsAgo();
    const [customers, salesByCustomer] = await Promise.all([
      this.prisma.client.customer.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.client.sale.groupBy({ by: ['customerId'], _count: { _all: true }, _sum: { salePrice: true } }),
    ]);

    const months = lastNMonths(12);
    const byMonth = new Map(months.map((m) => [m, { month: m, newCustomers: 0 }]));
    for (const c of customers) {
      const bucket = byMonth.get(monthKey(c.createdAt));
      if (bucket) bucket.newCustomers += 1;
    }

    const topCustomerIds = salesByCustomer
      .sort((a, b) => toNum(b._sum.salePrice) - toNum(a._sum.salePrice))
      .slice(0, 10);
    const topCustomers = await this.prisma.client.customer.findMany({
      where: { id: { in: topCustomerIds.map((c) => c.customerId) } },
      select: { id: true, fullName: true },
    });
    const nameById = new Map(topCustomers.map((c) => [c.id, c.fullName]));

    const totalCustomers = await this.prisma.client.customer.count();

    return {
      trend: Array.from(byMonth.values()),
      totalCustomers,
      topCustomers: topCustomerIds.map((c) => ({
        customerId: c.customerId,
        fullName: nameById.get(c.customerId) ?? 'Unknown',
        salesCount: c._count._all,
        totalSpent: toNum(c._sum.salePrice),
      })),
    };
  }

  async leadsReport() {
    const [byStage, bySource, total] = await Promise.all([
      this.prisma.client.lead.groupBy({ by: ['stage'], _count: { _all: true } }),
      this.prisma.client.lead.groupBy({ by: ['source'], _count: { _all: true } }),
      this.prisma.client.lead.count(),
    ]);

    const completed = byStage.find((s) => s.stage === 'completed')?._count._all ?? 0;
    const lost = byStage.find((s) => s.stage === 'lost')?._count._all ?? 0;

    return {
      byStage: byStage.map((s) => ({ stage: s.stage, count: s._count._all })),
      bySource: bySource.map((s) => ({ source: s.source ?? 'unknown', count: s._count._all })),
      total,
      conversionRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
      lostRate: total > 0 ? Math.round((lost / total) * 1000) / 10 : 0,
    };
  }

  async stockAgingReport() {
    const vehicles = await this.prisma.client.vehicle.findMany({
      where: { status: { notIn: ['sold', 'hidden'] } },
      select: { id: true, stockNumber: true, brand: true, model: true, year: true, status: true, createdAt: true },
    });

    const now = Date.now();
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    const items = vehicles.map((v) => {
      const ageDays = Math.floor((now - v.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      if (ageDays <= 30) buckets['0-30'] += 1;
      else if (ageDays <= 60) buckets['31-60'] += 1;
      else if (ageDays <= 90) buckets['61-90'] += 1;
      else buckets['90+'] += 1;
      return { ...v, ageDays };
    });

    return { buckets: Object.entries(buckets).map(([range, count]) => ({ range, count })), items: items.sort((a, b) => b.ageDays - a.ageDays) };
  }

  async modelPerformanceReport() {
    const sales = await this.prisma.client.sale.findMany({
      where: { status: { not: 'cancelled' } },
      select: { createdAt: true, vehicle: { select: { brand: true, model: true, createdAt: true } } },
    });

    const groups = new Map<string, { brand: string; model: string; totalDays: number; count: number }>();
    for (const s of sales) {
      const key = `${s.vehicle.brand} ${s.vehicle.model}`;
      const days = Math.max(0, Math.floor((s.createdAt.getTime() - s.vehicle.createdAt.getTime()) / (1000 * 60 * 60 * 24)));
      const entry = groups.get(key) ?? { brand: s.vehicle.brand, model: s.vehicle.model, totalDays: 0, count: 0 };
      entry.totalDays += days;
      entry.count += 1;
      groups.set(key, entry);
    }

    const ranked = Array.from(groups.values())
      .map((g) => ({ brand: g.brand, model: g.model, unitsSold: g.count, avgDaysToSell: Math.round(g.totalDays / g.count) }))
      .sort((a, b) => a.avgDaysToSell - b.avgDaysToSell);

    return { fastSelling: ranked.slice(0, 5), slowSelling: ranked.slice(-5).reverse() };
  }
}
