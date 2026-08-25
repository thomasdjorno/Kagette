"use client";

import { Button } from "@/components/ui/Button";

export function ImprimerButton() {
  return (
    <Button onClick={() => window.print()} className="no-print">
      🖨️ Imprimer l&apos;étiquette
    </Button>
  );
}
