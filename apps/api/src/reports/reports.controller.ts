import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Permissions } from '../common/decorators/permissions.decorator';
import { TenantScopedGuard } from '../common/guards/tenant-scoped.guard';

@Controller('reports')
@UseGuards(TenantScopedGuard)
@Permissions('reports.view')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  sales() {
    return this.reportsService.salesReport();
  }

  @Get('expenses')
  expenses() {
    return this.reportsService.expensesReport();
  }

  @Get('profit')
  profit() {
    return this.reportsService.profitReport();
  }

  @Get('inventory')
  inventory() {
    return this.reportsService.inventoryReport();
  }

  @Get('customers')
  customers() {
    return this.reportsService.customersReport();
  }

  @Get('leads')
  leads() {
    return this.reportsService.leadsReport();
  }

  @Get('stock-aging')
  stockAging() {
    return this.reportsService.stockAgingReport();
  }

  @Get('model-performance')
  modelPerformance() {
    return this.reportsService.modelPerformanceReport();
  }
}
