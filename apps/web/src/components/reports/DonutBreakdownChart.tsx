"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { CATEGORICAL_PALETTE } from "@/lib/chart-colors";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DonutBreakdownChart({ labels, series }: { labels: string[]; series: number[] }) {
  const options: ApexOptions = {
    labels,
    colors: CATEGORICAL_PALETTE.slice(0, Math.max(labels.length, 1)),
    chart: { fontFamily: "Outfit, sans-serif", type: "donut" },
    legend: { position: "bottom", fontSize: "13px" },
    dataLabels: { enabled: labels.length <= 4 },
    tooltip: { enabled: true },
  };

  if (series.every((v) => v === 0)) {
    return <p className="py-10 text-center text-sm text-gray-400">No data yet.</p>;
  }

  return <Chart options={options} series={series} type="donut" height={280} />;
}
