"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const libelleStatut: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVE: "Réservée",
  TERMINE: "Terminée",
  ANNULE: "Annulée",
};

export function FruitListingStatusActions({ id, statut }: { id: string; statut: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function changerStatut(nouveauStatut: string) {
    setChargement(true);
    setErreur(null);
    const res = await fetch(`/api/fruit-listings/${id}/statut`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: nouveauStatut }),
    });
    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <p className="text-xs text-kagette-prune-700/50">{libelleStatut[statut] ?? statut}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {statut !== "DISPONIBLE" && statut !== "ANNULE" && (
          <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("DISPONIBLE")}>
            Remettre disponible
          </Button>
        )}
        {statut === "DISPONIBLE" && (
          <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("TERMINE")}>
            Marquer terminée
          </Button>
        )}
        {statut !== "ANNULE" && (
          <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("ANNULE")}>
            Annuler l&apos;annonce
          </Button>
        )}
      </div>
      {erreur && <p className="mt-1 text-xs text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
