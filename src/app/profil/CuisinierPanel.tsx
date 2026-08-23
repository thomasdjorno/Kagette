"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { HygieneBadgeStatus } from "@prisma/client";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { libellesBadgeHygiene } from "@/lib/format";

export function CuisinierPanel({
  estCuisinier,
  hygieneBadgeStatus,
}: {
  estCuisinier: boolean;
  hygieneBadgeStatus: HygieneBadgeStatus;
}) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const peutSoumettre = hygieneBadgeStatus === "NON_DEMANDE" || hygieneBadgeStatus === "REFUSE";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/profil/cuisinier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siret: formData.get("siret") || undefined,
        charteAcceptee: formData.get("charteAcceptee") === "on",
      }),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    router.refresh();
  }

  return (
    <div className="mt-4 space-y-3">
      <p className="text-sm font-medium text-kagette-prune-700">
        {estCuisinier ? "Casquette active ✅" : "Casquette non active"} —{" "}
        {libellesBadgeHygiene[hygieneBadgeStatus]}
      </p>
      <Link
        href="/profil/badge-cuisinier"
        className="inline-block text-sm font-medium text-kagette-framboise-600 hover:underline"
      >
        En savoir plus sur le badge cuisinier →
      </Link>

      {peutSoumettre && (
        <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-kagette-mangue-50 p-4">
          <div>
            <Label htmlFor="siret">Numéro SIRET (optionnel en V1)</Label>
            <Input id="siret" name="siret" placeholder="14 chiffres" maxLength={14} />
          </div>
          <div className="flex items-start gap-2">
            <input
              id="charteAcceptee"
              name="charteAcceptee"
              type="checkbox"
              required
              className="mt-1"
            />
            <Label htmlFor="charteAcceptee" className="mb-0 font-normal">
              J&apos;ai lu et j&apos;accepte la{" "}
              <Link href="/guide/hygiene" target="_blank" className="underline">
                charte d&apos;hygiène Kagette
              </Link>{" "}
              pour la préparation de produits de conservation.
            </Label>
          </div>

          {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

          <Button type="submit" variant="secondary" disabled={chargement}>
            {chargement ? "Envoi..." : "Demander le badge cuisinier"}
          </Button>
        </form>
      )}
    </div>
  );
}
