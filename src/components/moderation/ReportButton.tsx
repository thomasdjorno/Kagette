"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export function ReportButton({
  fruitListingId,
  productListingId,
}: {
  fruitListingId?: string;
  productListingId?: string;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fruitListingId,
        productListingId,
        motif: formData.get("motif"),
      }),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    setEnvoye(true);
    setOuvert(false);
  }

  if (envoye) {
    return <p className="text-xs text-kagette-prune-700/50">Signalement envoyé, merci.</p>;
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="text-xs text-kagette-prune-700/40 hover:text-kagette-prune-700/70 hover:underline"
      >
        Signaler cette annonce
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded-xl bg-kagette-prune-700/5 p-3">
      <Textarea
        name="motif"
        required
        rows={2}
        placeholder="Pourquoi signales-tu cette annonce ?"
        className="text-xs"
      />
      {erreur && <p className="text-xs text-kagette-framboise-600">{erreur}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="ghost" disabled={chargement} className="text-xs">
          Envoyer
        </Button>
        <button
          type="button"
          onClick={() => setOuvert(false)}
          className="text-xs text-kagette-prune-700/50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
