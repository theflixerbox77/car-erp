"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { BRAND_BLUE } from "@/lib/chart-colors";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function RankedBarChart({ categories, series, name, horizontal = true }: { categories: string[]; series: number[]; name: string; horizontal?: boolean }) {
  const options: ApexOptions = {
    legend: { show: false },
    colors: [BRAND_BLUE],
    chart: { fontFamily: "Outfit, sans-serif", type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal, borderRadius: 4, distributed: false } },
    dataLabels: { enabled: false },
    grid: { xaxis: { lines: { show: false } } },
    xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false } },
    tooltip: { enabled: true },
  };

  if (series.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-400">No data yet.</p>;
  }

  return <Chart options={options} series={[{ name, data: series }]} type="bar" height={Math.max(220, categories.length * 40)} />;
}
