"use client";

import React from "react";
import { useDrop } from "react-dnd";
import LeadCard, { LEAD_DND_TYPE } from "./LeadCard";
import type { Lead, LeadStage } from "@/lib/types/sales";
import { LEAD_STAGE_LABELS } from "@/lib/types/sales";

export default function StageColumn({
  stage,
  leads,
  onDropLead,
}: {
  stage: LeadStage;
  leads: Lead[];
  onDropLead: (leadId: string, stage: LeadStage) => void;
}) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: LEAD_DND_TYPE,
    drop: (item: { id: string }) => onDropLead(item.id, stage),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className={`flex min-h-[300px] w-64 shrink-0 flex-col gap-2 rounded-xl border border-gray-200 p-3 dark:border-white/[0.05] ${
        isOver ? "bg-brand-50 dark:bg-brand-500/10" : "bg-gray-50 dark:bg-white/[0.02]"
      }`}
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{LEAD_STAGE_LABELS[stage]}</h3>
        <span className="text-xs text-gray-400">{leads.length}</span>
      </div>
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
