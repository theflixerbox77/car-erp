"use client";

import Link from "next/link";
import React from "react";
import { useDrag } from "react-dnd";
import type { Lead } from "@/lib/types/sales";

export const LEAD_DND_TYPE = "LEAD_CARD";

export default function LeadCard({ lead }: { lead: Lead }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: LEAD_DND_TYPE,
    item: { id: lead.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      className={`cursor-grab rounded-lg border border-gray-200 bg-white p-3 text-sm shadow-theme-xs transition dark:border-white/[0.05] dark:bg-white/[0.03] ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <p className="font-medium text-gray-800 dark:text-white/90">{lead.customer.fullName}</p>
      {lead.vehicle && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {lead.vehicle.brand} {lead.vehicle.model} ({lead.vehicle.year})
        </p>
      )}
      {lead.customer.phone && <p className="mt-1 text-xs text-gray-400">{lead.customer.phone}</p>}
      {(lead.stage === "booked" || lead.stage === "payment_pending" || lead.stage === "delivered") && (
        <Link
          href={`/dealer/sales/records/new?leadId=${lead.id}&customerId=${lead.customer.id}${lead.vehicle ? `&vehicleId=${lead.vehicle.id}` : ""}`}
          className="mt-2 inline-block text-xs font-medium text-brand-500 hover:text-brand-600"
        >
          Convert to sale →
        </Link>
      )}
    </div>
  );
}
