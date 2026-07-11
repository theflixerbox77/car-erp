import { Metadata } from "next";
import { api } from "@/lib/api";
import Badge from "@/components/ui/badge/Badge";
import type { Employee } from "@/lib/types/ops";
import AttendanceControls from "@/components/employees/AttendanceControls";
import LeaveRequestForm from "@/components/employees/LeaveRequestForm";

export const metadata: Metadata = { title: "Employee Detail" };

const LEAVE_BADGE: Record<string, "success" | "warning" | "error"> = { approved: "success", pending: "warning", rejected: "error" };

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await api.get<Employee>(`/employees/${id}`);
  const todayStr = new Date().toDateString();
  const todayRecord = employee.attendance?.find((a) => new Date(a.date).toDateString() === todayStr);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">{employee.fullName}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {employee.role?.name ?? "No role"} {employee.phone ? `· ${employee.phone}` : ""}
          </p>
        </div>
        <AttendanceControls employeeId={employee.id} todayRecord={todayRecord} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Attendance (last 30)</h3>
            {!employee.attendance || employee.attendance.length === 0 ? (
              <p className="text-sm text-gray-400">No attendance recorded yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {employee.attendance.map((a) => (
                  <li key={a.id} className="flex justify-between border-b border-gray-100 py-1.5 last:border-0 dark:border-white/[0.05]">
                    <span className="text-gray-700 dark:text-gray-300">{new Date(a.date).toLocaleDateString()}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString() : "—"} → {a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString() : "—"}
                    </span>
                    <Badge size="sm" color={a.status === "present" ? "success" : "light"}>
                      {a.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Request Leave</h3>
            <LeaveRequestForm employeeId={employee.id} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Leave Requests</h3>
            {!employee.leaveRequests || employee.leaveRequests.length === 0 ? (
              <p className="text-sm text-gray-400">No leave requests yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {employee.leaveRequests.map((l) => (
                  <li key={l.id} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {l.type} · {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                    </span>
                    <Badge size="sm" color={LEAVE_BADGE[l.status]}>
                      {l.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="text-gray-800 dark:text-white/90">{employee.employmentStatus}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Hire Date</dt>
                <dd className="text-gray-800 dark:text-white/90">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Salary Type</dt>
                <dd className="text-gray-800 dark:text-white/90">{employee.salaryType ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Salary</dt>
                <dd className="text-gray-800 dark:text-white/90">{employee.salaryAmount ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Commission</dt>
                <dd className="text-gray-800 dark:text-white/90">{employee.commissionRate ? `${employee.commissionRate}%` : "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
