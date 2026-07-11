"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { deleteVehicleMediaAction, setPrimaryMediaAction, uploadVehicleMediaAction } from "@/app/actions/vehicles";
import type { VehicleMedia } from "@/lib/types/vehicle";

export default function MediaUploader({ vehicleId, media }: { vehicleId: string; media: VehicleMedia[] }) {
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError(null);
      startTransition(async () => {
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.set("file", file);
          formData.set("type", file.type.startsWith("video") ? "video" : "image");
          try {
            await uploadVehicleMediaAction(vehicleId, formData);
          } catch {
            setUploadError(`Failed to upload ${file.name}`);
          }
        }
      });
    },
    [vehicleId],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  const images = media.filter((m) => m.type === "image" || m.type === "video");

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">Photos &amp; Videos</h3>

      <div
        {...getRootProps()}
        className={`mb-4 cursor-pointer rounded-lg border border-dashed p-6 text-center transition ${
          isDragActive ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isPending ? "Uploading..." : isDragActive ? "Drop files here" : "Drag & drop photos/videos, or click to select"}
        </p>
      </div>
      {uploadError && <p className="mb-4 text-sm text-error-500">{uploadError}</p>}

      {images.length === 0 ? (
        <p className="text-sm text-gray-400">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-white/[0.05]">
              {item.type === "video" ? (
                <video src={item.url} className="h-28 w-full object-cover" muted />
              ) : (
                <Image src={item.url} alt="Vehicle media" width={200} height={112} className="h-28 w-full object-cover" />
              )}
              {item.isPrimary && (
                <span className="absolute left-1 top-1 rounded bg-brand-500 px-1.5 py-0.5 text-[10px] font-medium text-white">Primary</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/50 p-1 opacity-0 transition group-hover:opacity-100">
                {!item.isPrimary && (
                  <button
                    type="button"
                    className="text-[10px] text-white hover:underline"
                    onClick={() => startTransition(() => setPrimaryMediaAction(vehicleId, item.id))}
                  >
                    Set primary
                  </button>
                )}
                <button
                  type="button"
                  className="ml-auto text-[10px] text-white hover:underline"
                  onClick={() => startTransition(() => deleteVehicleMediaAction(vehicleId, item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
