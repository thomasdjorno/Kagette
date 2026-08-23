import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ContactButton } from "@/components/messaging/ContactButton";
import { ReportButton } from "@/components/moderation/ReportButton";
import { formatDate, libellesModeRecolte, libellesRaisonDemande, libellesStatutDemande, couleurStatutDemande } from "@/lib/format";
import { FruitRequestForm } from "./FruitRequestForm";
import { FruitRequestsManager } from "./FruitRequestsManager";

const statutLibelle: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVE: "Réservée",
  TERMINE: "Terminée",
  ANNULE: "Annulée",
};

export default async function FruitListingPage({ params }: { params: { id: string } }) {
  const [listing, session] = await Promise.all([
    prisma.fruitListing.findUnique({
      where: { id: params.id },
      include: {
        donneur: true,
        productListings: { where: { statut: "EN_VENTE" } },
        demandes: {
          include: { demandeur: { select: { prenom: true, nom: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const reviews = await prisma.review.findMany({
    where: { cibleId: listing.donneurId },
    include: { auteur: { select: { prenom: true } } },
    orderBy: { createdAt: "desc" },
  });

  const dejaAccepte = listing.demandes
    .filter((d) => d.statut === "ACCEPTEE")
    .reduce((total, d) => total + d.quantiteDemandeeKg, 0);
  const restantKg = Math.max(0, listing.quantiteKg - dejaAccepte);
  const estProprietaire = session?.user?.id === listing.donneurId;
  const mesDemandes = session?.user
    ? listing.demandes.filter((d) => d.demandeurId === session.user.id)
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ListingPhoto
        photoUrl={listing.photoUrls[0]}
        emoji="🍃"
        alt={listing.variete}
        className="h-64 w-full rounded-2xl"
      />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-kagette-feuille-600">
            Fruits à récolter, {statutLibelle[listing.statut]}
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-kagette-prune-700">{listing.variete}</h1>
          <p className="text-sm text-kagette-prune-700/60">
            {restantKg} kg sur {listing.quantiteKg} kg disponibles
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium text-kagette-feuille-600">
            {listing.mode === "DON" ? "Don" : `Dès ${listing.montantParticipation}€`}
          </p>
        </div>
      </div>

      <span className="inline-block rounded-full bg-kagette-mangue-50 px-3 py-1 text-xs font-bold text-kagette-mangue-600">
        {libellesModeRecolte[listing.modeRecolte] ?? listing.modeRecolte}
      </span>

      {listing.description && (
        <Card>
          <p className="text-sm text-kagette-prune-700/80">{listing.description}</p>
        </Card>
      )}

      <Card className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-kagette-prune-700">Lieu de retrait</p>
          <p className="text-kagette-prune-700/70">{listing.zoneRetrait}</p>
        </div>
        <div>
          <p className="font-semibold text-kagette-prune-700">Disponibilité</p>
          <p className="text-kagette-prune-700/70">
            Du {formatDate(listing.disponibleDu)} au {formatDate(listing.disponibleAu)}
          </p>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-kagette-prune-700">Proposé par</p>
        <Link
          href={`/profil/${listing.donneur.id}`}
          className="mt-1 inline-block text-kagette-framboise-600 hover:underline"
        >
          {listing.donneur.prenom} {listing.donneur.nom.charAt(0)}.
        </Link>
        {session?.user && !estProprietaire && (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <ContactButton
              label={`Discuter avec ${listing.donneur.prenom}`}
              fruitListingId={listing.id}
            />
          </div>
        )}
      </Card>

      {mesDemandes.length > 0 && (
        <Card>
          <p className="mb-3 text-sm font-semibold text-kagette-prune-700">Tes demandes sur cette annonce</p>
          <div className="space-y-3">
            {mesDemandes.map((demande) => (
              <div
                key={demande.id}
                className="flex items-center justify-between rounded-xl bg-kagette-prune-700/5 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-kagette-prune-700">
                    {demande.quantiteDemandeeKg} kg, {libellesRaisonDemande[demande.raison]}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">{formatDate(demande.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${couleurStatutDemande[demande.statut]}`}
                >
                  {libellesStatutDemande[demande.statut]}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {session?.user && !estProprietaire && listing.statut === "DISPONIBLE" && (
        <Card>
          <p className="mb-3 text-sm font-semibold text-kagette-prune-700">
            Réserver une partie de la récolte
          </p>
          <FruitRequestForm fruitListingId={listing.id} restantKg={restantKg} />
        </Card>
      )}

      {estProprietaire && (
        <Card>
          <p className="mb-3 text-sm font-semibold text-kagette-prune-700">Demandes reçues</p>
          <FruitRequestsManager demandes={listing.demandes} />
        </Card>
      )}

      <Card>
        <p className="mb-3 text-sm font-semibold text-kagette-prune-700">Avis sur {listing.donneur.prenom}</p>
        <ReviewList reviews={reviews} />
      </Card>

      {session?.user && (
        <div className="text-center">
          <ReportButton fruitListingId={listing.id} />
        </div>
      )}

      {listing.productListings.length > 0 && (
        <Card>
          <p className="text-sm font-semibold text-kagette-prune-700">
            Déjà transformés à partir de ces fruits
          </p>
          <ul className="mt-2 space-y-1">
            {listing.productListings.map((produit) => (
              <li key={produit.id}>
                <Link
                  href={`/produits/${produit.id}`}
                  className="text-sm text-kagette-framboise-600 hover:underline"
                >
                  {produit.titre} →
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
