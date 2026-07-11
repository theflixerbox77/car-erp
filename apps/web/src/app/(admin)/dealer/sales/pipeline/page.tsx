import Link from "next/link";
import { Metadata } from "next";
import { api } from "@/lib/api";
import Button from "@/components/ui/button/Button";
import PipelineBoard from "@/components/sales/PipelineBoard";
import type { LeadBoard } from "@/lib/types/sales";

export const metadata: Metadata = { title: "Sales Pipeline" };

export default async function PipelinePage() {
  const board = await api.get<LeadBoard>("/leads/board");
  const totalLeads = Object.values(board).reduce((sum, leads) => sum + leads.length, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-title-sm font-semibold text-gray-800 dark:text-white/90">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag leads between stages as deals progress.</p>
        </div>
        <Link href="/dealer/sales/leads/new">
          <Button size="sm">New Lead</Button>
        </Link>
      </div>

      {totalLeads === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No leads yet. Add your first lead to start tracking deals through the pipeline.
          </p>
        </div>
      ) : (
        <PipelineBoard board={board} />
      )}
    </div>
  );
}
