export interface SalesReport {
  trend: { month: string; count: number; revenue: number }[];
  totalSales: number;
  totalRevenue: number;
}

export interface ExpensesReport {
  trend: { month: string; total: number }[];
  byCategory: { name: string; total: number }[];
  totalExpenses: number;
}

export interface ProfitReport {
  trend: { month: string; revenue: number; profit: number }[];
  totalRevenue: number;
  totalProfit: number;
  totalCommission: number;
}

export interface InventoryReport {
  byStatus: { status: string; count: number }[];
  byBrand: { brand: string; count: number }[];
  totalVehicles: number;
  inventoryValue: number;
}

export interface CustomersReport {
  trend: { month: string; newCustomers: number }[];
  totalCustomers: number;
  topCustomers: { customerId: string; fullName: string; salesCount: number; totalSpent: number }[];
}

export interface LeadsReport {
  byStage: { stage: string; count: number }[];
  bySource: { source: string; count: number }[];
  total: number;
  conversionRate: number;
  lostRate: number;
}

export interface StockAgingReport {
  buckets: { range: string; count: number }[];
  items: { id: string; stockNumber: string; brand: string; model: string; year: number; status: string; ageDays: number }[];
}

export interface ModelPerformanceReport {
  fastSelling: { brand: string; model: string; unitsSold: number; avgDaysToSell: number }[];
  slowSelling: { brand: string; model: string; unitsSold: number; avgDaysToSell: number }[];
}
