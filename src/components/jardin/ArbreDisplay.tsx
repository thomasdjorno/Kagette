"use client";

import { useState } from "react";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import {
  libellesSaison,
  emojiSaison,
  libellesUnite,
  libellesModeRecolte,
  libellesUrgence,
  couleurUrgence,
} from "@/lib/format";
import { clsx } from "@/lib/clsx";

interface Arbre {
  id: string;
  variete: string;
  saison: string;
  quantite: number;
  unite: string;
  modeRecolte: string;
  urgenceRecolte: string;
  notes?: string | null;
  photoUrl: string | null;
}

export function ArbreDisplay({ arbre }: { arbre: Arbre }) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOuvert((v) => !v)}
      className="group w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <ListingPhoto
          photoUrl={arbre.photoUrl}
          emoji={emojiSaison[arbre.saison]}
          alt={arbre.variete}
          className="h-36 w-full transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={clsx(
            "absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold",
            couleurUrgence[arbre.urgenceRecolte]
          )}
        >
          {libellesUrgence[arbre.urgenceRecolte]}
        </span>
      </div>
      <div className="p-4">
        <p className="font-serif text-base font-bold text-kagette-prune-700">{arbre.variete}</p>
        <p className="text-sm text-kagette-prune-700/60">
          {libellesSaison[arbre.saison]} — {arbre.quantite} {libellesUnite[arbre.unite]}
        </p>
        <span className="mt-2 inline-block rounded-full bg-kagette-prune-700/5 px-2.5 py-0.5 text-xs font-medium text-kagette-prune-700/70">
          {libellesModeRecolte[arbre.modeRecolte]}
        </span>
        {arbre.notes && (
          <p
            className={clsx(
              "mt-2 text-sm text-kagette-prune-700/70 transition-all",
              ouvert ? "line-clamp-none" : "line-clamp-1"
            )}
          >
            {arbre.notes}
          </p>
        )}
      </div>
    </button>
  );
}
