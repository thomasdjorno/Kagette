"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ModifierProfilForm({
  prenom,
  nom,
  telephone,
}: {
  prenom: string;
  nom: string;
  telephone: string | null;
}) {
  const router = useRouter();
  const [ouvert, setOuvert] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChargement(true);
    setErreur(null);
    setSucces(false);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prenom: formData.get("prenom"),
        nom: formData.get("nom"),
        telephone: formData.get("telephone") || "",
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

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-sm font-medium text-kagette-framboise-600 hover:underline"
      >
        Modifier mes informations
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-kagette-prune-700/5 p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" name="prenom" defaultValue={prenom} required />
        </div>
        <div>
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" name="nom" defaultValue={nom} required />
        </div>
      </div>
      <div>
        <Label htmlFor="telephone">Téléphone (facultatif)</Label>
        <Input id="telephone" name="telephone" type="tel" defaultValue={telephone ?? ""} />
      </div>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
      {succes && <p className="text-sm text-kagette-feuille-600">Informations mises à jour ✓</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={chargement}>
          {chargement ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOuvert(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
