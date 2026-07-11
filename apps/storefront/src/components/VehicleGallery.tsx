"use client";

import Image from "next/image";
import { useState } from "react";
import type { PublicVehicleMedia } from "@/lib/types";

export default function VehicleGallery({ media, title }: { media: PublicVehicleMedia[]; title: string }) {
  const images = media.filter((m) => m.type !== "video");
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">No photos yet</div>;
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Image src={images[active].url} alt={title} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" priority />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? "border-brand-500" : "border-transparent"}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
