import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import type { Employee } from "@/lib/types/ops";

export const metadata: Metadata = { title: "Employees" };

export default async function EmployeesPage() {
  const employees = await api.get<Employee[]>("/employees");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Employees</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{employees.length} employee{employees.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dealer/employees/leave-requests" className="self-center text-sm font-medium text-brand-500 hover:text-brand-600">
            Leave Requests
          </Link>
          <Link href="/dealer/employees/new">
            <Button size="sm">Add Employee</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Role
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Phone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {employees.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No employees yet.</TableCell>
                </TableRow>
              )}
              {employees.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/dealer/employees/${e.id}`} className="font-medium text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90">
                      {e.fullName}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{e.role?.name ?? "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{e.phone ?? "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge size="sm" color={e.employmentStatus === "active" ? "success" : "light"}>
                      {e.employmentStatus}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
