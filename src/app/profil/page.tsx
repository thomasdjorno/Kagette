import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { DonneurToggle } from "./DonneurToggle";
import { CuisinierPanel } from "./CuisinierPanel";
import { StripeConnectPanel } from "./StripeConnectPanel";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Session valide mais compte introuvable (ex. base réinitialisée pendant
  // le développement) — on force une reconnexion propre plutôt que de planter.
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">
          {user.prenom} {user.nom}
        </h1>
        <p className="text-sm text-kagette-prune-700/60">{user.email}</p>
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Casquette donneur</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Proposez vos surplus de fruits de jardin, en don ou avec une participation libre.
        </p>
        <DonneurToggle estDonneur={user.estDonneur} />
        {user.estDonneur && (
          <Link
            href="/profil/jardin"
            className="mt-3 inline-block text-sm font-medium text-kagette-framboise-600 hover:underline"
          >
            Gérer mon jardin →
          </Link>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Casquette cuisinier</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Transformez les fruits récupérés en confitures, sirops, chutneys ou fruits secs
          et vendez-les sur Kagette.
        </p>
        <CuisinierPanel
          estCuisinier={user.estCuisinier}
          hygieneBadgeStatus={user.hygieneBadgeStatus}
        />
      </Card>

      {(user.estDonneur || user.estCuisinier) && (
        <Card>
          <h2 className="font-semibold text-kagette-prune-700">Paiements</h2>
          <p className="mt-1 text-sm text-kagette-prune-700/60">
            Nécessaire pour recevoir ta part des ventes (donneur et/ou cuisinier).
          </p>
          <StripeConnectPanel stripeOnboardingComplete={user.stripeOnboardingComplete} />
        </Card>
      )}

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Achats & ventes</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/commandes" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes achats →
          </Link>
          {user.estCuisinier && (
            <Link href="/ventes" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
              Mes ventes →
            </Link>
          )}
          {(user.estDonneur || user.estCuisinier) && (
            <Link href="/profil/annonces" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
              Mes annonces →
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
