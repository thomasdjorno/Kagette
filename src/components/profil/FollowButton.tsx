"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function FollowButton({ userId, suiviAuDepart }: { userId: string; suiviAuDepart: boolean }) {
  const router = useRouter();
  const [suivi, setSuivi] = useState(suiviAuDepart);
  const [chargement, setChargement] = useState(false);

  async function basculer() {
    setChargement(true);
    if (suivi) {
      await fetch(`/api/follows/${userId}`, { method: "DELETE" });
      setSuivi(false);
    } else {
      await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setSuivi(true);
    }
    setChargement(false);
    router.refresh();
  }

  return (
    <Button variant={suivi ? "ghost" : "primary"} disabled={chargement} onClick={basculer}>
      {suivi ? "✓ Suivi" : "+ Suivre"}
    </Button>
  );
}
