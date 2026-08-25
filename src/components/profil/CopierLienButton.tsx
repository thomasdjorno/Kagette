"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CopierLienButton({ lien }: { lien: string }) {
  const [copie, setCopie] = useState(false);

  async function copier() {
    try {
      await navigator.clipboard.writeText(lien);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papier indisponible (permissions navigateur) : rien à
      // afficher de plus utile, le lien reste visible dans la carte.
    }
  }

  return (
    <Button variant="ghost" onClick={copier}>
      {copie ? "✓ Lien copié" : "🔗 Copier le lien"}
    </Button>
  );
}
