"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function NouvelleRechercheForm({ regionId }: { regionId: string }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/fruit-search-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        variete: formData.get("variete"),
        quantiteSouhaiteeKg: formData.get("quantiteSouhaiteeKg") || undefined,
        message: formData.get("message"),
        regionId,
      }),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    setOuvert(false);
    router.refresh();
  }

  if (!ouvert) {
    return (
      <Button variant="secondary" onClick={() => setOuvert(true)} className="w-full sm:w-auto">
        📣 Publier une recherche
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-kagette-mangue-50 p-4">
      <div>
        <Label htmlFor="variete">Quel fruit recherches-tu ?</Label>
        <Input id="variete" name="variete" placeholder="Ex : prunes" required />
      </div>
      <div>
        <Label htmlFor="quantiteSouhaiteeKg">Quantité souhaitée en kg (facultatif)</Label>
        <Input id="quantiteSouhaiteeKg" name="quantiteSouhaiteeKg" type="number" min="0.5" step="0.5" />
      </div>
      <div>
        <Label htmlFor="message">Message (facultatif)</Label>
        <Textarea id="message" name="message" rows={2} placeholder="Ex : pour faire un chutney, dispo le week-end" />
      </div>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="secondary" disabled={chargement}>
          {chargement ? "Publication..." : "Publier la recherche"}
        </Button>
        <button type="button" onClick={() => setOuvert(false)} className="text-sm text-kagette-prune-700/50">
          Annuler
        </button>
      </div>
    </form>
  );
}
