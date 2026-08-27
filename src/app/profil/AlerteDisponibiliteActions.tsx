"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AlerteDisponibiliteActions({ id }: { id: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function annuler() {
    setChargement(true);
    const res = await fetch(`/api/alertes-disponibilite/${id}`, { method: "DELETE" });
    setChargement(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={annuler}
      disabled={chargement}
      className="text-xs font-medium text-kagette-framboise-600 hover:underline disabled:opacity-50"
    >
      Annuler
    </button>
  );
}
