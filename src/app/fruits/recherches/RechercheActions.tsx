"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function RechercheActions({ id }: { id: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function changerStatut(statut: string) {
    setChargement(true);
    const res = await fetch(`/api/fruit-search-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    setChargement(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-2 flex gap-2">
      <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("COMBLEE")}>
        Marquer comme comblée
      </Button>
      <Button variant="ghost" disabled={chargement} onClick={() => changerStatut("ANNULEE")}>
        Annuler
      </Button>
    </div>
  );
}
