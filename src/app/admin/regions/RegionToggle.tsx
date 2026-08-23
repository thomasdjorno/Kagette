"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function RegionToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function basculer() {
    setChargement(true);
    await fetch(`/api/admin/regions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setChargement(false);
    router.refresh();
  }

  return (
    <Button
      variant={isActive ? "ghost" : "secondary"}
      disabled={chargement}
      onClick={basculer}
    >
      {isActive ? "Désactiver" : "Activer"}
    </Button>
  );
}
