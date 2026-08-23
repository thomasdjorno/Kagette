"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { libellesRaisonDemande } from "@/lib/format";

interface Demande {
  id: string;
  quantiteDemandeeKg: number;
  raison: string;
  message: string | null;
  statut: string;
  demandeur: { prenom: string; nom: string };
}

const libelleStatut: Record<string, string> = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
};

export function FruitRequestsManager({ demandes }: { demandes: Demande[] }) {
  const router = useRouter();
  const [chargementId, setChargementId] = useState<string | null>(null);

  async function decider(id: string, decision: "ACCEPTEE" | "REFUSEE") {
    setChargementId(id);
    await fetch(`/api/fruit-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setChargementId(null);
    router.refresh();
  }

  if (demandes.length === 0) {
    return <p className="text-sm text-kagette-prune-700/60">Aucune demande pour l&apos;instant.</p>;
  }

  return (
    <ul className="space-y-3">
      {demandes.map((demande) => (
        <li key={demande.id} className="border-t border-kagette-prune-700/10 pt-3 first:border-0 first:pt-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-kagette-prune-700">
                {demande.demandeur.prenom} {demande.demandeur.nom.charAt(0)}., {demande.quantiteDemandeeKg} kg
              </p>
              <p className="text-xs text-kagette-prune-700/60">
                {libellesRaisonDemande[demande.raison] ?? demande.raison}
              </p>
              {demande.message && (
                <p className="mt-1 text-sm text-kagette-prune-700/80">« {demande.message} »</p>
              )}
            </div>
            {demande.statut === "EN_ATTENTE" ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={chargementId === demande.id}
                  onClick={() => decider(demande.id, "ACCEPTEE")}
                >
                  Accepter
                </Button>
                <Button
                  variant="ghost"
                  disabled={chargementId === demande.id}
                  onClick={() => decider(demande.id, "REFUSEE")}
                >
                  Refuser
                </Button>
              </div>
            ) : (
              <span className="text-xs font-semibold text-kagette-prune-700/50">
                {libelleStatut[demande.statut]}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
