"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AlerteDisponibiliteForm({
  critere,
  categorie,
  isAuthenticated,
}: {
  critere: string;
  categorie: string;
  isAuthenticated: boolean;
}) {
  const [statut, setStatut] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");

  if (!isAuthenticated) {
    return (
      <Link
        href="/connexion?callbackUrl=/"
        className="text-sm font-medium text-kagette-framboise-600 hover:underline"
      >
        Connecte-toi pour être prévenu dès qu&apos;un produit correspondant sera publié →
      </Link>
    );
  }

  if (statut === "ok") {
    return (
      <p className="text-sm font-medium text-kagette-feuille-600">
        ✓ Tu seras prévenu dès qu&apos;un produit correspondant sera publié.
      </p>
    );
  }

  async function creerAlerte() {
    setStatut("envoi");
    const res = await fetch("/api/alertes-disponibilite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ critere, categorie }),
    });
    setStatut(res.ok ? "ok" : "erreur");
  }

  return (
    <div>
      <Button variant="secondary" onClick={creerAlerte} disabled={statut === "envoi"}>
        🔔 Préviens-moi quand disponible
      </Button>
      {statut === "erreur" && (
        <p className="mt-2 text-sm text-kagette-framboise-600">
          Une erreur est survenue, réessaie plus tard.
        </p>
      )}
    </div>
  );
}
