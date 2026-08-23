import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { MobileNav } from "./MobileNav";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-kagette-prune-700/10 bg-kagette-creme/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo/logo.png"
            alt="Kagette"
            width={190}
            height={50}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </Link>

        <nav className="flex items-center gap-4">
          {session?.user && (
            <>
              <Link
                href="/messagerie"
                className="hidden text-sm font-medium text-kagette-prune-700 hover:text-kagette-framboise-500 sm:block"
              >
                Messagerie
              </Link>
              <Link
                href="/profil"
                className="hidden text-sm font-medium text-kagette-prune-700 hover:text-kagette-framboise-500 sm:block"
              >
                Mon profil
              </Link>
            </>
          )}
          {session?.user?.estAdmin && (
            <Link
              href="/admin"
              className="hidden text-sm font-medium text-kagette-prune-700 hover:text-kagette-framboise-500 sm:block"
            >
              Backoffice
            </Link>
          )}
          <MobileNav isAuthenticated={!!session?.user} isAdmin={!!session?.user?.estAdmin} />
          <HeaderAuthActions
            isAuthenticated={!!session?.user}
            prenom={session?.user?.name?.split(" ")[0]}
            photoUrl={session?.user?.image}
          />
        </nav>
      </div>
    </header>
  );
}
