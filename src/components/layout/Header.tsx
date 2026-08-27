import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { HeaderAuthActions } from "./HeaderAuthActions";
import { NavMenu } from "./NavMenu";
import { NotificationBell } from "./NotificationBell";
import { CartIcon } from "./CartIcon";

export async function Header() {
  const session = await auth();
  const nomComplet = session?.user?.name?.trim() ?? "";
  const [prenom, ...resteNom] = nomComplet.split(" ");

  return (
    <header className="sticky top-0 z-50">
      <div className="h-2 bg-kagette-framboise-500" />
      <div className="border-b border-kagette-prune-700/10 bg-kagette-creme/95 backdrop-blur">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Mobile : mascotte à gauche, logo (sans mascotte) centré en grand */}
          <Image
            src="/mascotte/mascotte.png"
            alt=""
            width={220}
            height={294}
            className="h-12 w-auto shrink-0 sm:hidden"
          />
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:hidden"
          >
            <Image
              src="/logo/logo-sans-mascotte.png"
              alt="Kagette"
              width={264}
              height={39}
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop : logo complet (mascotte + texte) à gauche */}
          <Link href="/" className="hidden shrink-0 items-center sm:flex">
            <Image
              src="/logo/logo.png"
              alt="Kagette"
              width={190}
              height={50}
              priority
              className="h-14 w-auto"
            />
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/calendrier"
              className="hidden text-sm font-medium text-kagette-prune-700 hover:text-kagette-framboise-500 sm:block"
            >
              Calendrier
            </Link>
            {session?.user && <NotificationBell />}
            <CartIcon />
            {session?.user ? (
              <NavMenu
                isAdmin={!!session.user.estAdmin}
                prenom={prenom || "Kagetteur"}
                nom={resteNom.join(" ")}
                photoUrl={session.user.image}
              />
            ) : (
              <HeaderAuthActions />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
