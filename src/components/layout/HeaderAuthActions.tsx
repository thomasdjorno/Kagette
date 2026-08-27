import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeaderAuthActions() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {/* Mobile : un seul lien compact, l'inscription reste accessible
          depuis la page de connexion. Desktop : les deux boutons, la
          largeur n'est pas contrainte. */}
      <Link
        href="/connexion"
        className="rounded-full bg-kagette-prune-700/5 px-3 py-1.5 text-xs font-bold text-kagette-prune-700 hover:bg-kagette-prune-700/10 sm:hidden"
      >
        Connexion
      </Link>
      <Link href="/connexion" className="hidden sm:block">
        <Button variant="ghost">Connexion</Button>
      </Link>
      <Link href="/inscription" className="hidden sm:block">
        <Button variant="primary">S&apos;inscrire</Button>
      </Link>
    </div>
  );
}
