"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function SupprimerCompteForm({ aUnMotDePasse }: { aUnMotDePasse: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChargement(true);
    setErreur(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/profil/supprimer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: formData.get("password") }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      setChargement(false);
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="text-sm font-medium text-kagette-framboise-600 hover:underline"
      >
        Supprimer mon compte
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-sm text-kagette-prune-700/80">
        Cette action est <strong>irréversible</strong>. Tes informations personnelles (nom, email,
        photo, téléphone) seront effacées. Tes annonces actives seront retirées. Les commandes,
        avis et messages déjà échangés restent visibles pour les autres utilisateurs, mais ton nom
        sera remplacé par « Utilisateur supprimé ».
      </p>

      {aUnMotDePasse && (
        <div>
          <Label htmlFor="password">Confirme avec ton mot de passe</Label>
          <Input id="password" name="password" type="password" required />
        </div>
      )}

      <div className="flex items-start gap-2">
        <input
          id="confirme"
          type="checkbox"
          checked={confirme}
          onChange={(e) => setConfirme(e.target.checked)}
          className="mt-1"
        />
        <Label htmlFor="confirme" className="mb-0 font-normal">
          Je comprends que cette action est définitive.
        </Label>
      </div>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="primary"
          disabled={chargement || !confirme}
          className="bg-kagette-framboise-600 hover:bg-kagette-framboise-700"
        >
          {chargement ? "Suppression..." : "Supprimer définitivement mon compte"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOuvert(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
