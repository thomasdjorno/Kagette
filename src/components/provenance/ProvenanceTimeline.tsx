import type { ReactNode } from "react";

export function ProvenanceTimeline({
  titre = "Du jardin à ton bocal",
  etapes,
}: {
  titre?: string;
  etapes: { emoji: string; contenu: ReactNode }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-kagette-mangue-300/60 bg-kagette-mangue-50 p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-kagette-mangue-600">{titre}</p>
      {etapes.map((etape, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
              {etape.emoji}
            </div>
            {i < etapes.length - 1 && <div className="my-1 w-px flex-1 bg-kagette-mangue-300/60" />}
          </div>
          <div className={i < etapes.length - 1 ? "pb-5" : ""}>{etape.contenu}</div>
        </div>
      ))}
    </div>
  );
}
