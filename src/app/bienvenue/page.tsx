import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DonneurToggle } from "@/app/profil/DonneurToggle";

export default async function BienvenuePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <p className="text-3xl">👋</p>
        <h1 className="mt-2 font-serif text-2xl font-bold text-kagette-prune-700">
          Bienvenue sur Kagette, {user.prenom} !
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Kagette relie trois façons de participer, autour des fruits du jardin. Tu peux cumuler
          plusieurs rôles, ou juste explorer les annonces pour commencer.
        </p>
      </div>

      <Card className="border-kagette-feuille-300 bg-kagette-feuille-50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-kagette-prune-700">🌱 Donneur</h2>
            <p className="mt-1 text-sm text-kagette-prune-700/70">
              Tu as un jardin qui déborde de fruits ? Propose-les en don ou avec une petite
              participation.
            </p>
          </div>
        </div>
        <DonneurToggle estDonneur={user.estDonneur} />
      </Card>

      <Card className="border-kagette-framboise-300 bg-kagette-framboise-50">
        <h2 className="font-semibold text-kagette-prune-700">👩‍🍳 Cuisinier</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/70">
          Tu transformes des fruits en confitures, sirops, chutneys ou fruits secs ? Demande le
          badge cuisinier pour pouvoir les vendre.
        </p>
        <Link href="/profil/badge-cuisinier">
          <Button variant="secondary" className="mt-3">
            Découvrir le badge cuisinier →
          </Button>
        </Link>
      </Card>

      <Card className="border-kagette-mangue-300 bg-kagette-mangue-50">
        <h2 className="font-semibold text-kagette-prune-700">🛒 Acheteur</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/70">
          Aucune démarche nécessaire, tu peux dès maintenant parcourir les annonces et acheter des
          produits transformés.
        </p>
      </Card>

      <div className="flex justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="primary">Découvrir les annonces →</Button>
        </Link>
        <Link href="/profil">
          <Button variant="ghost">Aller à mon profil</Button>
        </Link>
      </div>
    </div>
  );
}
