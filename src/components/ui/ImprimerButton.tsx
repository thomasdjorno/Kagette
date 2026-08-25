"use client";

import { Button } from "@/components/ui/Button";

export function ImprimerButton({ label = "🖨️ Imprimer" }: { label?: string }) {
  return (
    <Button onClick={() => window.print()} className="no-print">
      {label}
    </Button>
  );
}
