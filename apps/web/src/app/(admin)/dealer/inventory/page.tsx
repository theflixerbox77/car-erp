import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { api } from "@/lib/api";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import type { Vehicle, VehicleListResponse } from "@/lib/types/vehicle";
import { STATUS_BADGE_COLOR, STATUS_LABELS } from "@/lib/types/vehicle";

export const metadata: Metadata = { title: "Inventory" };

function formatMoney(value: string | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  query.set("limit", "50");

  const data = await api.get<VehicleListResponse>(`/vehicles?${query.toString()}`);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Inventory</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data.total} vehicle{data.total === 1 ? "" : "s"} in stock
          </p>
        </div>
        <Link href="/dealer/inventory/new">
          <Button size="sm">Add Vehicle</Button>
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap gap-3" method="get">
        <div className="w-full max-w-xs">
          <Input name="search" type="text" placeholder="Search stock #, VIN, brand, model" defaultValue={params.search} />
        </div>
        <Button size="sm" variant="outline">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Vehicle
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Stock #
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Mileage
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Selling Price
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data.items.length === 0 && (
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No vehicles yet. Add your first one to get started.
                    </TableCell>
                  </TableRow>
                )}
                {data.items.map((vehicle: Vehicle) => {
                  const thumb = vehicle.media?.[0]?.url;
                  return (
                    <TableRow key={vehicle.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Link href={`/dealer/inventory/${vehicle.id}`} className="flex items-center gap-3">
                          <div className="h-10 w-14 overflow-hidden rounded-md bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                            {thumb ? (
                              <Image src={thumb} alt={`${vehicle.brand} ${vehicle.model}`} width={56} height={40} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-400">No photo</span>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {vehicle.brand} {vehicle.model} {vehicle.trim ?? ""}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{vehicle.year}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{vehicle.stockNumber}</TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {vehicle.mileage != null ? `${new Intl.NumberFormat("en-US").format(vehicle.mileage)} km` : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{formatMoney(vehicle.sellingPrice)}</TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge size="sm" color={STATUS_BADGE_COLOR[vehicle.status]}>
                          {STATUS_LABELS[vehicle.status]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
