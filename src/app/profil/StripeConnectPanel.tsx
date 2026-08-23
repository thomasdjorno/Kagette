"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function StripeConnectPanel({
  stripeOnboardingComplete,
}: {
  stripeOnboardingComplete: boolean;
}) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function connecter() {
    setErreur(null);
    setChargement(true);
    const res = await fetch("/api/stripe/connect", { method: "POST" });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      setChargement(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="mt-4">
      {stripeOnboardingComplete ? (
        <p className="text-sm font-medium text-kagette-feuille-600">
          ✅ Compte Stripe connecté — tu peux recevoir des paiements
        </p>
      ) : (
        <>
          <p className="text-sm text-kagette-prune-700/70">
            Connecte un compte Stripe (mode test) pour recevoir ta part des ventes.
          </p>
          <Button variant="secondary" className="mt-3" disabled={chargement} onClick={connecter}>
            {chargement ? "Redirection..." : "Connecter mon compte Stripe"}
          </Button>
          {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}
        </>
      )}
    </div>
  );
}
