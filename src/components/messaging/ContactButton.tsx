"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ContactButtonProps {
  label: string;
  fruitListingId?: string;
  productListingId?: string;
  fruitSearchRequestId?: string;
}

export function ContactButton({
  label,
  fruitListingId,
  productListingId,
  fruitSearchRequestId,
}: ContactButtonProps) {
  const router = useRouter();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function contacter() {
    setErreur(null);
    setChargement(true);

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fruitListingId, productListingId, fruitSearchRequestId }),
    });

    const data = await res.json().catch(() => null);
    setChargement(false);

    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    router.push(`/messagerie/${data.conversationId}`);
  }

  return (
    <div>
      <Button
        onClick={contacter}
        disabled={chargement}
        className="w-full py-4 text-base sm:w-auto sm:px-8"
      >
        {chargement ? "..." : `💬 ${label}`}
      </Button>
      {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
