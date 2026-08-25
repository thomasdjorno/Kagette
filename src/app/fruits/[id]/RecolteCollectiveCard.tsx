"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/format";

interface Participant {
  id: string;
  prenom: string;
}

export function RecolteCollectiveCard({
  recolteId,
  dateEvenement,
  placesMax,
  notes,
  participants,
  estProprietaire,
  jeParticipe,
}: {
  recolteId: string;
  dateEvenement: string;
  placesMax: number | null;
  notes: string | null;
  participants: Participant[];
  estProprietaire: boolean;
  jeParticipe: boolean;
}) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const complet = placesMax !== null && participants.length >= placesMax;

  async function participer() {
    setChargement(true);
    setErreur(null);
    const res = await fetch(`/api/recoltes-collectives/${recolteId}/participer`, { method: "POST" });
    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.refresh();
  }

  async function seDesister() {
    setChargement(true);
    await fetch(`/api/recoltes-collectives/${recolteId}/participer`, { method: "DELETE" });
    setChargement(false);
    router.refresh();
  }

  async function annuler() {
    if (!confirm("Annuler cette cueillette collective ?")) return;
    setChargement(true);
    await fetch(`/api/recoltes-collectives/${recolteId}`, { method: "DELETE" });
    setChargement(false);
    router.refresh();
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-kagette-feuille-300 bg-kagette-feuille-50 p-4">
      <p className="font-semibold text-kagette-prune-700">🎉 Cueillette collective</p>
      <p className="mt-1 text-sm text-kagette-prune-700/80">{formatDate(dateEvenement)}</p>
      {notes && <p className="mt-1 text-sm text-kagette-prune-700/70">{notes}</p>}
      <p className="mt-2 text-sm text-kagette-prune-700/60">
        {participants.length} participant{participants.length > 1 ? "s" : ""}
        {placesMax ? ` sur ${placesMax} places` : ""}
        {participants.length > 0 && ` : ${participants.map((p) => p.prenom).join(", ")}`}
      </p>

      {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {estProprietaire ? (
          <Button variant="ghost" disabled={chargement} onClick={annuler}>
            Annuler la cueillette
          </Button>
        ) : jeParticipe ? (
          <Button variant="ghost" disabled={chargement} onClick={seDesister}>
            Je ne viens plus
          </Button>
        ) : (
          <Button variant="secondary" disabled={chargement || complet} onClick={participer}>
            {complet ? "Complet" : "Je viens !"}
          </Button>
        )}
      </div>
    </div>
  );
}
