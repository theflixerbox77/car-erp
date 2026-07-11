export interface ExpenseCategory {
  id: string;
  name: string;
  isRecurringDefault: boolean;
}

export interface Expense {
  id: string;
  amount: string;
  description: string | null;
  expenseDate: string;
  isRecurring: boolean;
  status: "pending" | "approved" | "rejected";
  receiptStoragePath: string | null;
  createdAt: string;
  category: ExpenseCategory;
  vehicle: { id: string; brand: string; model: string; stockNumber: string } | null;
}

export interface RecurringSchedule {
  id: string;
  amount: string;
  description: string | null;
  frequency: "weekly" | "monthly" | "yearly";
  nextRunDate: string;
  isActive: boolean;
  category: ExpenseCategory;
}

export interface Employee {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  employmentStatus: string;
  hireDate: string | null;
  salaryAmount: string | null;
  salaryType: string | null;
  commissionRate: string | null;
  role: { id: string; name: string } | null;
  attendance?: AttendanceRecord[];
  leaveRequests?: LeaveRequest[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  employee?: { id: string; fullName: string };
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  reason: string | null;
  employee?: { id: string; fullName: string };
}

export interface AppNotification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  isRead: boolean;
  createdAt: string;
}
