"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export function MobileNav({
  isAuthenticated,
  isAdmin,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div className="relative sm:hidden">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-kagette-prune-700 hover:bg-kagette-prune-700/10"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="5" x2="18" y2="5" />
          <line x1="2" y1="10" x2="18" y2="10" />
          <line x1="2" y1="15" x2="18" y2="15" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white py-1 shadow-lg">
            <Link
              href="/messagerie"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
            >
              Messagerie
            </Link>
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
            >
              Mon profil
            </Link>
            <Link
              href="/profil/annonces"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
            >
              Mes annonces
            </Link>
            <Link
              href="/profil/demandes"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
            >
              Mes demandes
            </Link>
            <Link
              href="/profil/favoris"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
            >
              Mes favoris
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-feuille-50"
              >
                Backoffice
              </Link>
            )}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block w-full border-t border-kagette-prune-700/10 px-4 py-3 text-left text-sm font-medium text-kagette-framboise-600 hover:bg-kagette-feuille-50"
            >
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}
