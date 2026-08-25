"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
}

export function MobileNav({
  isAuthenticated,
  isAdmin,
  isDonneur,
  isCuisinier,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDonneur: boolean;
  isCuisinier: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  const items: MenuItem[] = [
    { href: "/calendrier", icon: "📅", label: "Calendrier" },
    { href: "/profil/impact", icon: "🌍", label: "Mon impact" },
    { href: "/fruits/recherches", icon: "🔍", label: "Recherches" },
    { href: "/messagerie", icon: "💬", label: "Messagerie" },
    { href: "/profil", icon: "👤", label: "Mon profil" },
    { href: "/profil/annonces", icon: "📋", label: "Mes annonces" },
    { href: "/profil/demandes", icon: "🙋", label: "Mes demandes" },
    { href: "/profil/favoris", icon: "⭐", label: "Mes favoris" },
    { href: "/commandes", icon: "🛍️", label: "Mes achats" },
    ...(isCuisinier ? [{ href: "/ventes", icon: "🏷️", label: "Mes ventes" }] : []),
    ...(isDonneur ? [{ href: "/profil/gains", icon: "💰", label: "Mes gains" }] : []),
    ...(isAdmin ? [{ href: "/admin", icon: "⚙️", label: "Backoffice" }] : []),
  ];

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
          <div className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white p-2 shadow-lg">
            <div className="grid grid-cols-3 gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center hover:bg-kagette-feuille-50"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[10px] font-medium leading-tight text-kagette-prune-700">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border-t border-kagette-prune-700/10 px-4 py-3 text-sm font-medium text-kagette-framboise-600 hover:bg-kagette-feuille-50"
            >
              🚪 Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}
