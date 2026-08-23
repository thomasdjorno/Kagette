"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function NouvelleRegionForm() {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/regions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: formData.get("nom"),
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
        rayonKm: formData.get("rayonKm"),
      }),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    (event.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
      <div>
        <Label htmlFor="nom">Nom de la région</Label>
        <Input id="nom" name="nom" placeholder="Ex : Périgueux et alentours" required />
      </div>
      <div>
        <Label htmlFor="latitude">Latitude du centre</Label>
        <Input id="latitude" name="latitude" type="number" step="0.0001" required />
      </div>
      <div>
        <Label htmlFor="longitude">Longitude du centre</Label>
        <Input id="longitude" name="longitude" type="number" step="0.0001" required />
      </div>
      <div>
        <Label htmlFor="rayonKm">Rayon (km)</Label>
        <Input id="rayonKm" name="rayonKm" type="number" step="0.5" required />
      </div>
      <div className="sm:col-span-4">
        {erreur && <p className="mb-2 text-sm text-kagette-framboise-600">{erreur}</p>}
        <Button type="submit" disabled={chargement}>
          {chargement ? "Création..." : "Créer la région (inactive par défaut)"}
        </Button>
      </div>
    </form>
  );
}
