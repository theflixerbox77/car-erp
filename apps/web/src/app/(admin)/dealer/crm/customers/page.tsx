import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import type { Customer } from "@/lib/types/sales";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const { search } = await searchParams;
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const customers = await api.get<Customer[]>(`/customers${query}`);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Customers</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{customers.length} customer{customers.length === 1 ? "" : "s"}</p>
        </div>
        <Link href="/dealer/crm/customers/new">
          <Button size="sm">Add Customer</Button>
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <div className="w-full max-w-xs">
          <Input name="search" type="text" placeholder="Search name, phone, email" defaultValue={search} />
        </div>
        <Button size="sm" variant="outline">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Name
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Phone
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Source
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {customers.length === 0 && (
                <TableRow>
                  <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No customers yet.</TableCell>
                </TableRow>
              )}
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="px-5 py-4 text-start">
                    <Link href={`/dealer/crm/customers/${c.id}`} className="font-medium text-gray-800 hover:text-brand-500 text-theme-sm dark:text-white/90">
                      {c.fullName}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.phone ?? "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.email ?? "—"}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{c.source ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
