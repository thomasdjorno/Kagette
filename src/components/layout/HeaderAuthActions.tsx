"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function HeaderAuthActions({
  isAuthenticated,
  prenom,
}: {
  isAuthenticated: boolean;
  prenom?: string;
}) {
  if (isAuthenticated) {
    return (
      <div className="hidden items-center gap-3 sm:flex">
        {prenom && <span className="hidden text-sm text-kagette-prune-700/70 md:block">Bonjour {prenom}</span>}
        <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
          Déconnexion
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/connexion">
        <Button variant="ghost">Connexion</Button>
      </Link>
      <Link href="/inscription">
        <Button variant="primary">S&apos;inscrire</Button>
      </Link>
    </div>
  );
}
