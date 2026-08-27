import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { CopierLienButton } from "@/components/profil/CopierLienButton";
import { genererQrCodeDataUrl } from "@/lib/qrcode";
import { CuisinierPanel } from "./CuisinierPanel";
import { StripeConnectPanel } from "./StripeConnectPanel";
import { AvatarUploader } from "./AvatarUploader";
import { ModifierProfilForm } from "./ModifierProfilForm";
import { SupprimerCompteForm } from "./SupprimerCompteForm";
import { AlerteDisponibiliteActions } from "./AlerteDisponibiliteActions";
import { libellesCategorie } from "@/lib/format";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Session valide mais compte introuvable (ex. base réinitialisée pendant
  // le développement), on force une reconnexion propre plutôt que de planter.
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const lienProfil = `${baseUrl}/profil/${user.id}`;
  const qrCodeDataUrl = await genererQrCodeDataUrl(lienProfil);

  const alertesActives = await prisma.alerteDisponibilite.findMany({
    where: { userId: user.id, declenchee: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <AvatarUploader photoUrl={user.photoUrl} prenom={user.prenom} nom={user.nom} />
        <div>
          <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">
            {user.prenom} {user.nom}
          </h1>
          <p className="text-sm text-kagette-prune-700/60">{user.email}</p>
          {user.telephone && (
            <p className="text-sm text-kagette-prune-700/60">{user.telephone}</p>
          )}
        </div>
      </div>

      <Card className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element -- QR code en data URL, next/image ne le gère pas bien */}
        <img
          src={qrCodeDataUrl}
          alt="QR code vers mon profil public Kagette"
          width={72}
          height={72}
          className="shrink-0 rounded-lg"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-kagette-prune-700">Partager mon profil</h2>
          <p className="mt-1 text-sm text-kagette-prune-700/60">
            Fais scanner ce QR code ou partage ton lien pour que tes voisins retrouvent tes
            annonces sur Kagette.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopierLienButton lien={lienProfil} />
            <Link
              href="/profil/carte"
              className="inline-flex items-center rounded-full bg-kagette-prune-700/5 px-5 py-2.5 text-sm font-bold text-kagette-prune-700 hover:bg-kagette-prune-700/10"
            >
              🖨️ Carte à imprimer
            </Link>
          </div>
        </div>
      </Card>

      <Link href="/profil/impact">
        <Card className="flex items-center gap-4 transition-colors hover:border-kagette-feuille-500">
          <span className="text-2xl">🌍</span>
          <div className="flex-1">
            <h2 className="font-semibold text-kagette-prune-700">Mon impact</h2>
            <p className="mt-1 text-sm text-kagette-prune-700/60">
              Découvre ce que tu as concrètement changé, fruit par fruit.
            </p>
          </div>
          <span className="text-kagette-prune-700/40">→</span>
        </Card>
      </Link>

      <ModifierProfilForm prenom={user.prenom} nom={user.nom} telephone={user.telephone} />

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Donner des fruits</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Proposez vos surplus de fruits de jardin, en don ou avec une participation libre —
          aucune démarche préalable, publie une annonce quand tu veux.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/fruits/nouveau"
            className="text-sm font-medium text-kagette-framboise-600 hover:underline"
          >
            Proposer des fruits →
          </Link>
          <Link
            href="/profil/jardin"
            className="text-sm font-medium text-kagette-framboise-600 hover:underline"
          >
            Gérer mon jardin →
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Vendre des produits transformés</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Transformez les fruits récupérés en confitures, sirops, chutneys ou fruits secs et
          vendez-les sur Kagette — seule condition : ton badge hygiène validé.
        </p>
        <CuisinierPanel hygieneBadgeStatus={user.hygieneBadgeStatus} />
        <Link
          href="/guide"
          className="mt-3 inline-block text-sm font-medium text-kagette-framboise-600 hover:underline"
        >
          📖 Guide du Kagetteur (hygiène, étiquetage, cadre légal) →
        </Link>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Paiements</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Nécessaire pour recevoir ta part des ventes (donneur et/ou cuisinier).
        </p>
        <StripeConnectPanel stripeOnboardingComplete={user.stripeOnboardingComplete} />
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Achats & ventes</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/commandes" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes achats →
          </Link>
          <Link href="/ventes" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes ventes →
          </Link>
          <Link href="/profil/gains" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes gains →
          </Link>
          <Link href="/profil/annonces" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes annonces →
          </Link>
          <Link href="/profil/demandes" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes demandes →
          </Link>
          <Link href="/profil/favoris" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
            Mes favoris →
          </Link>
        </div>
      </Card>

      {alertesActives.length > 0 && (
        <Card>
          <h2 className="font-semibold text-kagette-prune-700">🔔 Mes alertes disponibilité</h2>
          <p className="mt-1 text-sm text-kagette-prune-700/60">
            Tu seras prévenu dès qu&apos;un produit correspondant sera publié.
          </p>
          <div className="mt-3 space-y-2">
            {alertesActives.map((alerte) => (
              <div
                key={alerte.id}
                className="flex items-center justify-between rounded-xl bg-kagette-prune-700/5 px-3 py-2 text-sm"
              >
                <span className="text-kagette-prune-700">
                  {[alerte.critere, alerte.categorie ? libellesCategorie[alerte.categorie] : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <AlerteDisponibiliteActions id={alerte.id} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="border-kagette-framboise-200">
        <h2 className="font-semibold text-kagette-prune-700">Zone dangereuse</h2>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Supprimer définitivement ton compte Kagette.
        </p>
        <div className="mt-3">
          <SupprimerCompteForm aUnMotDePasse={!!user.password} />
        </div>
      </Card>
    </div>
  );
}
