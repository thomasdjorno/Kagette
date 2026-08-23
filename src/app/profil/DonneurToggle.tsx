"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function DonneurToggle({ estDonneur }: { estDonneur: boolean }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function toggle() {
    setChargement(true);
    await fetch("/api/profil/donneur", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !estDonneur }),
    });
    setChargement(false);
    router.refresh();
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="text-sm text-kagette-prune-700/70">
        Statut actuel : {estDonneur ? "activée" : "désactivée"}
      </span>
      <Button
        variant={estDonneur ? "ghost" : "secondary"}
        disabled={chargement}
        onClick={toggle}
      >
        {estDonneur ? "Désactiver" : "Activer"}
      </Button>
    </div>
  );
}
