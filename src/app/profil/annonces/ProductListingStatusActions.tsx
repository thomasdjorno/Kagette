"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const libelleStatut: Record<string, string> = {
  EN_VENTE: "En vente",
  RUPTURE: "Rupture de stock",
  ARCHIVE: "Archivée",
  SIGNALE: "En cours de modération",
};

export function ProductListingStatusActions({ id, statut }: { id: string; statut: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function changerStatut(nouveauStatut: string) {
    setChargement(true);
    setErreur(null);
    const res = await fetch(`/api/product-listings/${id}/statut`, {
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
      {statut !== "SIGNALE" && (
        <div className="mt-1 flex flex-wrap gap-2">
          {statut !== "EN_VENTE" && (
            <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("EN_VENTE")}>
              Remettre en vente
            </Button>
          )}
          {statut === "EN_VENTE" && (
            <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("RUPTURE")}>
              Marquer en rupture
            </Button>
          )}
          {statut !== "ARCHIVE" && (
            <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("ARCHIVE")}>
              Archiver
            </Button>
          )}
        </div>
      )}
      {erreur && <p className="mt-1 text-xs text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
