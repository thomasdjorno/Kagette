import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-kagette-prune-700/10 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-kagette-prune-700/50">
        <span>© {new Date().getFullYear()} Kagette</span>
        <nav className="flex flex-wrap gap-4">
          <Link href="/guide" className="hover:text-kagette-prune-700">
            Guide du Kagetteur
          </Link>
          <Link href="/mentions-legales" className="hover:text-kagette-prune-700">
            Mentions légales
          </Link>
          <Link href="/cgu" className="hover:text-kagette-prune-700">
            CGU
          </Link>
          <Link href="/confidentialite" className="hover:text-kagette-prune-700">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
