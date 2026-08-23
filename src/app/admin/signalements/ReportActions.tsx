"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function ReportActions({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);

  async function agir(action: "traiter" | "rejeter") {
    setChargement(true);
    await fetch(`/api/admin/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setChargement(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" disabled={chargement} onClick={() => agir("traiter")}>
        Retirer l&apos;annonce
      </Button>
      <Button variant="ghost" disabled={chargement} onClick={() => agir("rejeter")}>
        Rejeter le signalement
      </Button>
    </div>
  );
}
