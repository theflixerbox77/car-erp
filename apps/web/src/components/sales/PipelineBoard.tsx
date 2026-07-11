"use client";

import React, { useOptimistic, useTransition } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import StageColumn from "./StageColumn";
import { changeLeadStageAction } from "@/app/actions/sales";
import type { LeadBoard, LeadStage } from "@/lib/types/sales";
import { PIPELINE_STAGES } from "@/lib/types/sales";

export default function PipelineBoard({ board }: { board: LeadBoard }) {
  const [, startTransition] = useTransition();
  const [optimisticBoard, applyMove] = useOptimistic(board, (state, move: { leadId: string; toStage: LeadStage }) => {
    const next: LeadBoard = { ...state };
    for (const stage of Object.keys(next) as LeadStage[]) {
      next[stage] = next[stage].filter((l) => l.id !== move.leadId);
    }
    const lead = Object.values(state)
      .flat()
      .find((l) => l.id === move.leadId);
    if (lead) {
      next[move.toStage] = [{ ...lead, stage: move.toStage }, ...next[move.toStage]];
    }
    return next;
  });

  function handleDrop(leadId: string, toStage: LeadStage) {
    startTransition(async () => {
      applyMove({ leadId, toStage });
      await changeLeadStageAction(leadId, toStage);
    });
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => (
          <StageColumn key={stage} stage={stage} leads={optimisticBoard[stage] ?? []} onDropLead={handleDrop} />
        ))}
      </div>
    </DndProvider>
  );
}
