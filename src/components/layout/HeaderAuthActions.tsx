"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export function HeaderAuthActions({
  isAuthenticated,
  prenom,
  photoUrl,
}: {
  isAuthenticated: boolean;
  prenom?: string;
  photoUrl?: string | null;
}) {
  if (isAuthenticated) {
    return (
      <div className="hidden items-center gap-3 sm:flex">
        {prenom && (
          <Link href="/profil" className="hidden items-center gap-2 md:flex">
            <Avatar photoUrl={photoUrl} prenom={prenom} size="sm" />
            <span className="text-sm text-kagette-prune-700/70">Bonjour {prenom}</span>
          </Link>
        )}
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
