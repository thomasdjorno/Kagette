"use client";

import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/Label";

export function PhotoUploader({
  photoUrls,
  onChange,
  max = 6,
}: {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [enCours, setEnCours] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).slice(0, max - photoUrls.length);
    if (files.length === 0) return;

    setEnCours(true);
    setMessage(null);
    const urlsAjoutees: string[] = [];

    for (const file of files) {
      try {
        const extension = file.name.split(".").pop() ?? "jpg";
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type, extension }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setMessage(data?.error ?? "Upload indisponible pour le moment — tu peux publier sans photo.");
          continue;
        }

        const { uploadUrl, publicUrl } = await res.json();
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        urlsAjoutees.push(publicUrl);
      } catch {
        setMessage("Échec de l'upload — tu peux publier sans photo pour l'instant.");
      }
    }

    if (urlsAjoutees.length > 0) {
      onChange([...photoUrls, ...urlsAjoutees]);
    }
    setEnCours(false);
    event.target.value = "";
  }

  return (
    <div>
      <Label>{max === 1 ? "Photo (facultatif)" : `Photos (facultatif, jusqu'à ${max})`}</Label>
      <div className="flex flex-wrap gap-2">
        {photoUrls.map((url) => (
          <div key={url} className="relative h-20 w-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => onChange(photoUrls.filter((u) => u !== url))}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-kagette-prune-700 text-xs text-white"
              aria-label="Retirer la photo"
            >
              ×
            </button>
          </div>
        ))}
        {photoUrls.length < max && (
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-kagette-prune-700/20 text-2xl text-kagette-prune-700/40 hover:border-kagette-framboise-300">
            {enCours ? "…" : "+"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              disabled={enCours}
              onChange={onFilesSelected}
            />
          </label>
        )}
      </div>
      {message && <p className="mt-2 text-xs text-kagette-prune-700/60">{message}</p>}
    </div>
  );
}
