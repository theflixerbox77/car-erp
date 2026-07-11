"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { BRAND_BLUE } from "@/lib/chart-colors";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TrendAreaChart({ categories, series, name }: { categories: string[]; series: number[]; name: string }) {
  const options: ApexOptions = {
    legend: { show: false },
    colors: [BRAND_BLUE],
    chart: { fontFamily: "Outfit, sans-serif", height: 280, type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.45, opacityTo: 0 } },
    markers: { size: 0, hover: { size: 5 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: { type: "category", categories, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] } } },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[600px]">
        <Chart options={options} series={[{ name, data: series }]} type="area" height={280} />
      </div>
    </div>
  );
}
