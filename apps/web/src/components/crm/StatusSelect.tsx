"use client";

import React, { useTransition } from "react";

export default function StatusSelect({
  id,
  status,
  options,
  onChange,
}: {
  id: string;
  status: string;
  options: readonly string[];
  onChange: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => onChange(id, e.target.value))}
      className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium capitalize text-gray-700 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      {options.map((opt) => (
        <option key={opt} value={opt} className="capitalize">
          {opt}
        </option>
      ))}
    </select>
  );
}
