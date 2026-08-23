"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { raisonsDemande } from "@/lib/validation";
import { libellesRaisonDemande } from "@/lib/format";

export function FruitRequestForm({
  fruitListingId,
  restantKg,
}: {
  fruitListingId: string;
  restantKg: number;
}) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/fruit-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fruitListingId,
        quantiteDemandeeKg: formData.get("quantiteDemandeeKg"),
        raison: formData.get("raison"),
        message: formData.get("message"),
      }),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    setSucces(true);
    router.refresh();
  }

  if (succes) {
    return (
      <div className="rounded-xl bg-kagette-feuille-50 p-4">
        <p className="text-sm font-semibold text-kagette-feuille-600">✓ Ta demande a bien été envoyée</p>
        <p className="mt-1 text-sm text-kagette-prune-700/70">
          Le donneur va l&apos;examiner, retrouve son statut ci-dessus ou depuis{" "}
          <Link href="/profil/demandes" className="underline">
            Mes demandes
          </Link>
          .
        </p>
      </div>
    );
  }

  if (restantKg <= 0) {
    return <p className="text-sm text-kagette-prune-700/60">Plus rien de disponible pour le moment.</p>;
  }

  if (!ouvert) {
    return (
      <Button variant="secondary" onClick={() => setOuvert(true)} className="w-full sm:w-auto">
        Faire une demande
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-kagette-feuille-50 p-4">
      <div>
        <Label htmlFor="quantiteDemandeeKg">Quantité souhaitée (kg)</Label>
        <Input
          id="quantiteDemandeeKg"
          name="quantiteDemandeeKg"
          type="number"
          min="0.5"
          step="0.5"
          max={restantKg}
          required
        />
        <p className="mt-1 text-xs text-kagette-prune-700/50">{restantKg} kg disponibles</p>
      </div>
      <div>
        <Label htmlFor="raison">Ce que tu comptes en faire</Label>
        <select
          id="raison"
          name="raison"
          required
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {raisonsDemande.map((raison) => (
            <option key={raison} value={raison}>
              {libellesRaisonDemande[raison]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="message">Message (facultatif)</Label>
        <Textarea id="message" name="message" rows={2} />
      </div>
      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="secondary" disabled={chargement}>
          Envoyer la demande
        </Button>
        <button
          type="button"
          onClick={() => setOuvert(false)}
          className="text-sm text-kagette-prune-700/50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
