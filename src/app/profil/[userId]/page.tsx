import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { FruitListingCard } from "@/components/listings/FruitListingCard";
import { ProductListingCard } from "@/components/listings/ProductListingCard";
import { ReviewList } from "@/components/reviews/ReviewList";
import { ArbreDisplay } from "@/components/jardin/ArbreDisplay";
import { FollowButton } from "@/components/profil/FollowButton";
import { Avatar } from "@/components/ui/Avatar";
import { BadgeConfiance } from "@/components/ui/BadgeConfiance";
import { calculerReputation } from "@/lib/reputation";

export default async function ProfilPublicPage({ params }: { params: { userId: string } }) {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      fruitListings: {
        where: { statut: "DISPONIBLE" },
        orderBy: { createdAt: "desc" },
      },
      productListings: {
        where: { statut: "EN_VENTE" },
        include: { fruitListingOrigine: { include: { donneur: true } } },
        orderBy: { createdAt: "desc" },
      },
      jardin: { include: { arbres: { orderBy: { createdAt: "desc" } } } },
    },
  });

  if (!user) notFound();

  const [reviews, dejaSuivi, reputation] = await Promise.all([
    prisma.review.findMany({
      where: { cibleId: user.id },
      include: { auteur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    session?.user && session.user.id !== user.id
      ? prisma.follow.findUnique({
          where: { suiveurId_suiviId: { suiveurId: session.user.id, suiviId: user.id } },
        })
      : null,
    calculerReputation(user.id),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar photoUrl={user.photoUrl} prenom={user.prenom} nom={user.nom} size="lg" />
            <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">
              {user.prenom} {user.nom.charAt(0)}.
            </h1>
          </div>
          {session?.user && session.user.id !== user.id && (
            <FollowButton userId={user.id} suiviAuDepart={!!dejaSuivi} />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <BadgeConfiance {...reputation} />
          {user.estDonneur && (
            <span className="rounded-full bg-kagette-feuille-50 px-3 py-1 text-xs font-semibold text-kagette-feuille-600">
              🌱 Donneur
            </span>
          )}
          {user.estCuisinier && (
            <span className="rounded-full bg-kagette-framboise-50 px-3 py-1 text-xs font-semibold text-kagette-framboise-600">
              👩‍🍳 Cuisinier
            </span>
          )}
          {user.estCuisinier && user.hygieneBadgeStatus === "VALIDE" && (
            <span className="rounded-full bg-kagette-mangue-50 px-3 py-1 text-xs font-semibold text-kagette-mangue-600">
              ✅ Badge hygiène validé
            </span>
          )}
        </div>
      </Card>

      {user.fruitListings.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">Fruits proposés</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user.fruitListings.map((fruit) => (
              <FruitListingCard
                key={fruit.id}
                id={fruit.id}
                variete={fruit.variete}
                mode={fruit.mode}
                montantParticipation={fruit.montantParticipation?.toString() ?? null}
                zoneRetrait={fruit.zoneRetrait}
                donneurPrenom={user.prenom}
                photoUrl={fruit.photoUrls[0]}
                disponibleDu={fruit.disponibleDu}
                disponibleAu={fruit.disponibleAu}
              />
            ))}
          </div>
        </div>
      )}

      {user.productListings.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">Produits en vente</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user.productListings.map((produit) => (
              <ProductListingCard
                key={produit.id}
                id={produit.id}
                titre={produit.titre}
                categorie={produit.categorie}
                prix={produit.prix.toString()}
                zoneRetrait={produit.zoneRetrait}
                cuisinierPrenom={user.prenom}
                donneurOriginePrenom={produit.fruitListingOrigine?.donneur.prenom ?? null}
                photoUrl={produit.photoUrls[0]}
              />
            ))}
          </div>
        </div>
      )}

      {user.fruitListings.length === 0 && user.productListings.length === 0 && (
        <p className="text-sm text-kagette-prune-700/60">Aucune annonce active pour le moment.</p>
      )}

      {user.jardin && user.jardin.arbres.length > 0 && (
        <div className="rounded-2xl bg-kagette-feuille-50 p-5">
          <h2 className="mb-3 font-serif text-lg font-bold text-kagette-prune-700">
            🌳 Le jardin de {user.prenom}
          </h2>
          <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
            {user.jardin.arbres.map((arbre) => (
              <ArbreDisplay key={arbre.id} arbre={arbre} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-semibold text-kagette-prune-700">Avis reçus</h2>
        <Card>
          <ReviewList reviews={reviews} />
        </Card>
      </div>
    </div>
  );
}
