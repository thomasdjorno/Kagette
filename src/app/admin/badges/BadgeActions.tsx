"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function BadgeActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function decider(decision: "VALIDE" | "REFUSE") {
    setChargement(true);
    await fetch(`/api/admin/badges/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });
    setChargement(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" disabled={chargement} onClick={() => decider("VALIDE")}>
        Valider
      </Button>
      <Button variant="ghost" disabled={chargement} onClick={() => decider("REFUSE")}>
        Refuser
      </Button>
    </div>
  );
}
