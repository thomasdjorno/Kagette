import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import { ProvenanceTimeline } from "@/components/provenance/ProvenanceTimeline";
import { Avatar } from "@/components/ui/Avatar";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ContactButton } from "@/components/messaging/ContactButton";
import { ReportButton } from "@/components/moderation/ReportButton";
import { formatDate, formatPrix, libellesCategorie, emojiCategorie } from "@/lib/format";
import { BadgeConfiance } from "@/components/ui/BadgeConfiance";
import { calculerReputation } from "@/lib/reputation";
import { BuyButton } from "./BuyButton";

export default async function ProductListingPage({ params }: { params: { id: string } }) {
  const [listing, session] = await Promise.all([
    prisma.productListing.findUnique({
      where: { id: params.id },
      include: {
        cuisinier: true,
        fruitListingOrigine: { include: { donneur: true, arbre: true } },
      },
    }),
    auth(),
  ]);

  if (!listing) notFound();

  const [reviews, reputation] = await Promise.all([
    prisma.review.findMany({
      where: { cibleId: listing.cuisinierId },
      include: { auteur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    calculerReputation(listing.cuisinierId),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ListingPhoto
        photoUrl={listing.photoUrls[0]}
        emoji={emojiCategorie[listing.categorie] ?? "🍯"}
        alt={listing.titre}
        className="h-64 w-full rounded-2xl"
      />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-kagette-framboise-600">
            {libellesCategorie[listing.categorie] ?? listing.categorie}
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-kagette-prune-700">{listing.titre}</h1>
        </div>
        <p className="text-2xl font-medium text-kagette-framboise-600">
          {formatPrix(listing.prix.toString())}
        </p>
      </div>

      <Card>
        {listing.statut !== "EN_VENTE" || listing.quantiteDisponible <= 0 ? (
          <p className="text-sm text-kagette-prune-700/60">Ce produit n&apos;est plus disponible.</p>
        ) : !session?.user ? (
          <>
            <p className="mb-3 text-sm text-kagette-prune-700/70">
              Connecte-toi pour acheter ce produit.
            </p>
            <Link href={`/connexion?callbackUrl=/produits/${listing.id}`}>
              <Button variant="secondary">Se connecter</Button>
            </Link>
          </>
        ) : session.user.id === listing.cuisinierId ? (
          <p className="text-sm text-kagette-prune-700/60">C&apos;est ton propre produit.</p>
        ) : (
          <BuyButton productListingId={listing.id} />
        )}
      </Card>

      {listing.fruitListingOrigine && (
        <ProvenanceTimeline
          etapes={[
            {
              emoji: "🌳",
              contenu: (
                <>
                  <p className="font-semibold text-kagette-prune-700">
                    {listing.fruitListingOrigine.variete} chez{" "}
                    <Link
                      href={`/profil/${listing.fruitListingOrigine.donneur.id}`}
                      className="underline decoration-dotted"
                    >
                      {listing.fruitListingOrigine.donneur.prenom}
                    </Link>
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <ListingPhoto
                      photoUrl={listing.fruitListingOrigine.arbre?.photoUrl || listing.fruitListingOrigine.photoUrls[0]}
                      emoji="🌳"
                      alt={listing.fruitListingOrigine.variete}
                      className="h-14 w-14 rounded-lg"
                    />
                    <Avatar
                      photoUrl={listing.fruitListingOrigine.donneur.photoUrl}
                      prenom={listing.fruitListingOrigine.donneur.prenom}
                      nom={listing.fruitListingOrigine.donneur.nom}
                      size="sm"
                    />
                  </div>
                  <p className="mt-1 text-xs text-kagette-prune-700/50">
                    Récoltés à {listing.fruitListingOrigine.zoneRetrait}
                  </p>
                </>
              ),
            },
            {
              emoji: "🧺",
              contenu: (
                <>
                  <p className="font-semibold text-kagette-prune-700">
                    {listing.fruitListingOrigine.modeRecolte === "DEJA_RECOLTE"
                      ? "Fruits déjà récoltés"
                      : "À récolter par celui qui les transforme"}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">
                    Disponibles depuis le {formatDate(listing.fruitListingOrigine.disponibleDu)}
                  </p>
                  <Link
                    href={`/fruits/${listing.fruitListingOrigine.id}`}
                    className="mt-1 inline-block text-sm font-medium text-kagette-feuille-600 hover:underline"
                  >
                    Voir l&apos;annonce de fruits d&apos;origine →
                  </Link>
                </>
              ),
            },
            {
              emoji: "🍯",
              contenu: (
                <>
                  <p className="font-semibold text-kagette-prune-700">
                    Transformé par{" "}
                    <Link
                      href={`/profil/${listing.cuisinier.id}`}
                      className="underline decoration-dotted"
                    >
                      {listing.cuisinier.prenom}
                    </Link>
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">
                    Publié le {formatDate(listing.createdAt)}
                  </p>
                </>
              ),
            },
          ]}
        />
      )}

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-kagette-framboise-600">
          Description
        </p>
        <p className="mt-1 text-sm text-kagette-prune-700/80">{listing.description}</p>
      </Card>

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-kagette-framboise-600">
          Ingrédients
        </p>
        <p className="mt-1 text-sm text-kagette-prune-700">
          {listing.ingredients.length > 0 ? listing.ingredients.join(", ") : "Non renseignés"}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-kagette-framboise-600">
            Allergènes
          </p>
          <p className="mt-1 text-sm text-kagette-prune-700">
            {listing.allergenes.length > 0 ? listing.allergenes.join(", ") : "Aucun signalé"}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-kagette-mangue-600">
            DLUO
          </p>
          <p className="mt-1 text-sm text-kagette-prune-700">{formatDate(listing.dluo)}</p>
        </Card>
      </div>

      <Card className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-kagette-prune-700">Lieu de retrait</p>
          <p className="text-kagette-prune-700/70">{listing.zoneRetrait}</p>
        </div>
        <div>
          <p className="font-semibold text-kagette-prune-700">Quantité disponible</p>
          <p className="text-kagette-prune-700/70">{listing.quantiteDisponible}</p>
        </div>
      </Card>

      <Card>
        <p className="text-sm font-semibold text-kagette-prune-700">Cuisiné par</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Link
            href={`/profil/${listing.cuisinier.id}`}
            className="text-kagette-framboise-600 hover:underline"
          >
            {listing.cuisinier.prenom} {listing.cuisinier.nom.charAt(0)}.
          </Link>
          <BadgeConfiance {...reputation} />
        </div>
        {session?.user && session.user.id !== listing.cuisinierId && (
          <div className="mt-3">
            <ContactButton
              label={`Discuter avec ${listing.cuisinier.prenom}`}
              productListingId={listing.id}
            />
          </div>
        )}
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-kagette-prune-700">
          Avis sur {listing.cuisinier.prenom}
        </p>
        <ReviewList reviews={reviews} />
      </Card>

      {session?.user && (
        <div className="text-center">
          <ReportButton productListingId={listing.id} />
        </div>
      )}
    </div>
  );
}
