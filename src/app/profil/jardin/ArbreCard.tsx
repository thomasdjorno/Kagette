"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import {
  libellesSaison,
  emojiSaison,
  libellesUnite,
  libellesModeRecolte,
  libellesUrgence,
  couleurUrgence,
} from "@/lib/format";
import { ArbreForm } from "./ArbreForm";

interface Arbre {
  id: string;
  variete: string;
  saison: string;
  quantite: number;
  unite: string;
  modeRecolte: string;
  urgenceRecolte: string;
  notes: string | null;
  photoUrl: string | null;
}

export function ArbreCard({ arbre }: { arbre: Arbre }) {
  const router = useRouter();
  const [edition, setEdition] = useState(false);
  const [suppression, setSuppression] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function supprimer() {
    setSuppression(true);
    setErreur(null);
    const res = await fetch(`/api/jardin/arbres/${arbre.id}`, { method: "DELETE" });
    setSuppression(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.refresh();
  }

  if (edition) {
    return (
      <Card>
        <ArbreForm
          arbreInitial={{
            id: arbre.id,
            variete: arbre.variete,
            saison: arbre.saison,
            quantite: arbre.quantite,
            unite: arbre.unite,
            modeRecolte: arbre.modeRecolte,
            urgenceRecolte: arbre.urgenceRecolte,
            notes: arbre.notes,
            photoUrl: arbre.photoUrl,
          }}
          onTermine={() => setEdition(false)}
        />
      </Card>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <ListingPhoto
          photoUrl={arbre.photoUrl}
          emoji={emojiSaison[arbre.saison]}
          alt={arbre.variete}
          className="h-36 w-full"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${couleurUrgence[arbre.urgenceRecolte]}`}
        >
          {libellesUrgence[arbre.urgenceRecolte]}
        </span>
      </div>
      <div className="p-4">
        <p className="font-serif text-lg font-bold text-kagette-prune-700">{arbre.variete}</p>
        <p className="text-sm text-kagette-prune-700/60">
          {libellesSaison[arbre.saison]}, {arbre.quantite} {libellesUnite[arbre.unite]}
        </p>
        <span className="mt-2 inline-block rounded-full bg-kagette-prune-700/5 px-2.5 py-0.5 text-xs font-medium text-kagette-prune-700/70">
          {libellesModeRecolte[arbre.modeRecolte]}
        </span>
        {arbre.notes && <p className="mt-2 text-sm text-kagette-prune-700/70">{arbre.notes}</p>}
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" onClick={() => setEdition(true)}>
            Modifier
          </Button>
          <Button variant="ghost" disabled={suppression} onClick={supprimer}>
            Supprimer
          </Button>
        </div>
        {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}
      </div>
    </div>
  );
}
