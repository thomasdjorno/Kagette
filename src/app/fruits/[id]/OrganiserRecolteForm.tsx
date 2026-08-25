"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function OrganiserRecolteForm({ fruitListingId }: { fruitListingId: string }) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/recoltes-collectives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fruitListingId,
        dateEvenement: formData.get("dateEvenement"),
        placesMax: formData.get("placesMax") || undefined,
        notes: formData.get("notes"),
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
        🎉 Organiser une cueillette collective
      </Button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-kagette-feuille-50 p-4">
      <div>
        <Label htmlFor="dateEvenement">Date et heure</Label>
        <Input id="dateEvenement" name="dateEvenement" type="datetime-local" required />
      </div>
      <div>
        <Label htmlFor="placesMax">Nombre de places (facultatif)</Label>
        <Input id="placesMax" name="placesMax" type="number" min="1" />
      </div>
      <div>
        <Label htmlFor="notes">Précisions (facultatif)</Label>
        <Textarea id="notes" name="notes" rows={2} placeholder="Ex : prévoir des cageots, rdv devant le portail" />
      </div>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <div className="flex gap-2">
        <Button type="submit" variant="secondary" disabled={chargement}>
          {chargement ? "Publication..." : "Lancer la cueillette"}
        </Button>
        <button type="button" onClick={() => setOuvert(false)} className="text-sm text-kagette-prune-700/50">
          Annuler
        </button>
      </div>
    </form>
  );
}
