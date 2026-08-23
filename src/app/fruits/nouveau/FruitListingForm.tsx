"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Region } from "@prisma/client";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PhotoUploader } from "@/components/listings/PhotoUploader";

interface ArbreOption {
  id: string;
  variete: string;
  quantite: number;
  unite: string;
  modeRecolte: string;
}

export function FruitListingForm({
  regions,
  arbres = [],
}: {
  regions: Region[];
  arbres?: ArbreOption[];
}) {
  const router = useRouter();
  const regionParDefaut = regions[0];
  const [mode, setMode] = useState<"DON" | "PARTICIPATION_LIBRE">("DON");
  const [modeRecolte, setModeRecolte] = useState<"DEJA_RECOLTE" | "A_RECOLTER_SOI_MEME">(
    "A_RECOLTER_SOI_MEME"
  );
  const [arbreId, setArbreId] = useState("");
  const [variete, setVariete] = useState("");
  const [quantiteKg, setQuantiteKg] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  function onSelectArbre(id: string) {
    setArbreId(id);
    const arbre = arbres.find((a) => a.id === id);
    if (!arbre) return;
    setVariete(arbre.variete);
    setModeRecolte(arbre.modeRecolte as "DEJA_RECOLTE" | "A_RECOLTER_SOI_MEME");
    if (arbre.unite === "KG") setQuantiteKg(String(arbre.quantite));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      variete,
      quantiteKg,
      mode,
      montantParticipation:
        mode === "PARTICIPATION_LIBRE" ? formData.get("montantParticipation") : undefined,
      modeRecolte,
      description: formData.get("description"),
      zoneRetrait: formData.get("zoneRetrait"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      regionId: formData.get("regionId"),
      disponibleDu: formData.get("disponibleDu"),
      disponibleAu: formData.get("disponibleAu"),
      photoUrls,
      arbreId: arbreId || undefined,
    };

    const res = await fetch("/api/fruit-listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    const { listing } = await res.json();
    router.push(`/fruits/${listing.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {arbres.length > 0 && (
        <div>
          <Label htmlFor="arbreId">Créer depuis un arbre de mon jardin (optionnel)</Label>
          <select
            id="arbreId"
            value={arbreId}
            onChange={(e) => onSelectArbre(e.target.value)}
            className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
          >
            <option value="">Aucun — je remplis à la main</option>
            {arbres.map((arbre) => (
              <option key={arbre.id} value={arbre.id}>
                {arbre.variete} ({arbre.quantite} {arbre.unite === "KG" ? "kg" : arbre.unite.toLowerCase()})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="variete">Variété de fruits</Label>
        <Input
          id="variete"
          name="variete"
          placeholder="Ex : pommes reinette"
          value={variete}
          onChange={(e) => setVariete(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="quantiteKg">Quantité disponible (kg)</Label>
        <Input
          id="quantiteKg"
          name="quantiteKg"
          type="number"
          min="0.5"
          step="0.5"
          value={quantiteKg}
          onChange={(e) => setQuantiteKg(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Les fruits sont-ils déjà cueillis ?</Label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modeRecolteRadio"
              checked={modeRecolte === "A_RECOLTER_SOI_MEME"}
              onChange={() => setModeRecolte("A_RECOLTER_SOI_MEME")}
            />
            À récolter soi-même
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modeRecolteRadio"
              checked={modeRecolte === "DEJA_RECOLTE"}
              onChange={() => setModeRecolte("DEJA_RECOLTE")}
            />
            Déjà récoltés
          </label>
        </div>
      </div>

      <div>
        <Label>Mode</Label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modeRadio"
              checked={mode === "DON"}
              onChange={() => setMode("DON")}
            />
            Don
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="modeRadio"
              checked={mode === "PARTICIPATION_LIBRE"}
              onChange={() => setMode("PARTICIPATION_LIBRE")}
            />
            Participation libre
          </label>
        </div>
      </div>

      {mode === "PARTICIPATION_LIBRE" && (
        <div>
          <Label htmlFor="montantParticipation">Montant suggéré (€)</Label>
          <Input
            id="montantParticipation"
            name="montantParticipation"
            type="number"
            min="0.5"
            step="0.5"
            required
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Description (facultatif)</Label>
        <Textarea id="description" name="description" rows={3} />
      </div>

      <div>
        <Label htmlFor="zoneRetrait">Lieu de retrait</Label>
        <Input
          id="zoneRetrait"
          name="zoneRetrait"
          placeholder="Ex : Mensignac, devant la mairie"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="latitude">Latitude approx.</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="0.0001"
            defaultValue={regionParDefaut?.latitude}
            required
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude approx.</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="0.0001"
            defaultValue={regionParDefaut?.longitude}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="disponibleDu">Disponible du</Label>
          <Input id="disponibleDu" name="disponibleDu" type="date" required />
        </div>
        <div>
          <Label htmlFor="disponibleAu">Disponible au</Label>
          <Input id="disponibleAu" name="disponibleAu" type="date" required />
        </div>
      </div>

      {regions.length > 1 ? (
        <div>
          <Label htmlFor="regionId">Région</Label>
          <select
            id="regionId"
            name="regionId"
            className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nom}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="regionId" value={regionParDefaut?.id} />
      )}

      <PhotoUploader photoUrls={photoUrls} onChange={setPhotoUrls} />

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <Button type="submit" disabled={chargement} className="w-full">
        {chargement ? "Publication..." : "Publier l'annonce"}
      </Button>
    </form>
  );
}
