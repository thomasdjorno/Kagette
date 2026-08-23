"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-5xl">🫙</p>
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
        Un pépin est survenu
      </h1>
      <p className="text-sm text-kagette-prune-700/70">
        Quelque chose s&apos;est mal passé de notre côté. Réessaie, ou reviens plus tard si ça
        persiste.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => reset()}>
          Réessayer
        </Button>
        <Link href="/">
          <Button variant="ghost">Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
