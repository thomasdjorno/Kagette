"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Avatar } from "@/components/ui/Avatar";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
}

export function NavMenu({
  isAdmin,
  prenom,
  nom,
  photoUrl,
}: {
  isAdmin: boolean;
  prenom: string;
  nom?: string | null;
  photoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);

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
    { href: "/ventes", icon: "🏷️", label: "Mes ventes" },
    { href: "/profil/gains", icon: "💰", label: "Mes gains" },
    ...(isAdmin ? [{ href: "/admin", icon: "⚙️", label: "Backoffice" }] : []),
  ];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Menu de ${prenom}`}
        onClick={() => setOpen((o) => !o)}
        className="block rounded-full ring-offset-2 hover:ring-2 hover:ring-kagette-framboise-200"
      >
        <Avatar photoUrl={photoUrl} prenom={prenom} nom={nom ?? undefined} size="sm" />
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
