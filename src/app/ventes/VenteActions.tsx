"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function VenteActions({ orderId, statut }: { orderId: string; statut: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function marquerPrete() {
    setChargement(true);
    setErreur(null);
    const res = await fetch(`/api/orders/${orderId}/statut`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "PRETE_RETRAIT" }),
    });
    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.refresh();
  }

  async function contacter() {
    setChargement(true);
    setErreur(null);
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json().catch(() => null);
    setChargement(false);
    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.push(`/messagerie/${data.conversationId}`);
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={contacter} disabled={chargement}>
          Contacter l&apos;acheteur
        </Button>
        {statut === "PAYEE" && (
          <Button variant="secondary" onClick={marquerPrete} disabled={chargement}>
            Marquer prête pour le retrait
          </Button>
        )}
      </div>
      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
