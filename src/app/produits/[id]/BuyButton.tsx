"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function BuyButton({ productListingId }: { productListingId: string }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function acheter() {
    setErreur(null);
    setChargement(true);

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productListingId, quantite: 1 }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      setChargement(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div>
      <Button onClick={acheter} disabled={chargement} className="w-full sm:w-auto">
        {chargement ? "Redirection vers le paiement..." : "Acheter"}
      </Button>
      {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
