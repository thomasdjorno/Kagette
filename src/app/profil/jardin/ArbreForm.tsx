"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PhotoUploader } from "@/components/listings/PhotoUploader";
import {
  saisons,
  unitesQuantite,
  urgencesRecolte,
  modesRecolte,
} from "@/lib/validation";
import { libellesSaison, libellesUnite, libellesUrgence, libellesModeRecolte } from "@/lib/format";

interface ArbreInitial {
  id: string;
  variete: string;
  saison: string;
  quantite: number;
  unite: string;
  modeRecolte: string;
  urgenceRecolte: string;
  notes: string | null;
  photoUrl?: string | null;
}

export function ArbreForm({
  arbreInitial,
  onTermine,
}: {
  arbreInitial?: ArbreInitial;
  onTermine?: () => void;
}) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(
    arbreInitial?.photoUrl ? [arbreInitial.photoUrl] : []
  );
  const modeEdition = Boolean(arbreInitial);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      variete: formData.get("variete"),
      saison: formData.get("saison"),
      quantite: formData.get("quantite"),
      unite: formData.get("unite"),
      modeRecolte: formData.get("modeRecolte"),
      urgenceRecolte: formData.get("urgenceRecolte"),
      notes: formData.get("notes"),
      photoUrl: photoUrls[0] ?? "",
    };

    const url = modeEdition ? `/api/jardin/arbres/${arbreInitial!.id}` : "/api/jardin/arbres";
    const res = await fetch(url, {
      method: modeEdition ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    if (!modeEdition) {
      (event.target as HTMLFormElement).reset();
      setPhotoUrls([]);
    }
    onTermine?.();
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <Label htmlFor="variete">Variété / arbre</Label>
        <Input
          id="variete"
          name="variete"
          placeholder="Ex : pommier reinette"
          defaultValue={arbreInitial?.variete}
          required
        />
      </div>
      <div>
        <Label htmlFor="saison">Saison de récolte</Label>
        <select
          id="saison"
          name="saison"
          defaultValue={arbreInitial?.saison ?? "ETE"}
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {saisons.map((s) => (
            <option key={s} value={s}>
              {libellesSaison[s]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="quantite">Quantité</Label>
        <Input
          id="quantite"
          name="quantite"
          type="number"
          min="0.5"
          step="0.5"
          defaultValue={arbreInitial?.quantite}
          required
        />
      </div>
      <div>
        <Label htmlFor="unite">Unité</Label>
        <select
          id="unite"
          name="unite"
          defaultValue={arbreInitial?.unite ?? "KG"}
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {unitesQuantite.map((u) => (
            <option key={u} value={u}>
              {libellesUnite[u]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="modeRecolte">Récolte</Label>
        <select
          id="modeRecolte"
          name="modeRecolte"
          defaultValue={arbreInitial?.modeRecolte ?? "A_RECOLTER_SOI_MEME"}
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {modesRecolte.map((m) => (
            <option key={m} value={m}>
              {libellesModeRecolte[m]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="urgenceRecolte">Urgence de récolte</Label>
        <select
          id="urgenceRecolte"
          name="urgenceRecolte"
          defaultValue={arbreInitial?.urgenceRecolte ?? "PAS_PRESSE"}
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {urgencesRecolte.map((u) => (
            <option key={u} value={u}>
              {libellesUrgence[u]}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="notes">Notes (facultatif)</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={arbreInitial?.notes ?? ""} />
      </div>
      <div className="sm:col-span-2">
        <PhotoUploader photoUrls={photoUrls} onChange={setPhotoUrls} max={1} />
      </div>
      <div className="sm:col-span-2">
        {erreur && <p className="mb-2 text-sm text-kagette-framboise-600">{erreur}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={chargement}>
            {chargement ? "..." : modeEdition ? "Enregistrer" : "Ajouter l'arbre"}
          </Button>
          {modeEdition && onTermine && (
            <button type="button" onClick={onTermine} className="text-sm text-kagette-prune-700/50">
              Annuler
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
