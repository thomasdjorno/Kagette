"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";

export function SplitConfigForm({
  donneurPercent,
  cuisinierPercent,
  commissionPercent,
}: {
  donneurPercent: number;
  cuisinierPercent: number;
  commissionPercent: number;
}) {
  const router = useRouter();
  const [valeurs, setValeurs] = useState({ donneurPercent, cuisinierPercent, commissionPercent });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const total = valeurs.donneurPercent + valeurs.cuisinierPercent + valeurs.commissionPercent;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    setSucces(false);

    const res = await fetch("/api/admin/split-config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valeurs),
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

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <Label>Part donneur (%)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={valeurs.donneurPercent}
          onChange={(e) => setValeurs({ ...valeurs, donneurPercent: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Part cuisinier (%)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={valeurs.cuisinierPercent}
          onChange={(e) => setValeurs({ ...valeurs, cuisinierPercent: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Commission plateforme (%)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={valeurs.commissionPercent}
          onChange={(e) => setValeurs({ ...valeurs, commissionPercent: Number(e.target.value) })}
        />
      </div>

      <p className={`text-sm ${Math.abs(total - 100) < 0.01 ? "text-kagette-feuille-600" : "text-kagette-framboise-600"}`}>
        Total : {total.toFixed(2)}% {Math.abs(total - 100) < 0.01 ? "✓" : "(doit faire 100%)"}
      </p>

      <Button type="submit" disabled={chargement || Math.abs(total - 100) >= 0.01}>
        Enregistrer
      </Button>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
      {succes && <p className="text-sm text-kagette-feuille-600">Répartition mise à jour ✓</p>}
    </form>
  );
}
