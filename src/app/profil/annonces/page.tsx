import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import { formatPrix, emojiCategorie } from "@/lib/format";
import { FruitListingStatusActions } from "./FruitListingStatusActions";
import { ProductListingStatusActions } from "./ProductListingStatusActions";

export default async function MesAnnoncesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/annonces");

  const [fruitListings, productListings] = await Promise.all([
    prisma.fruitListing.findMany({
      where: { donneurId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productListing.findMany({
      where: { cuisinierId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mes annonces</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Gère toi-même le statut de tes annonces fruits et produits.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-kagette-prune-700">Fruits</h2>
        {fruitListings.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">Aucune annonce de fruits.</p>
        ) : (
          <div className="space-y-3">
            {fruitListings.map((listing) => (
              <Card key={listing.id} className="flex items-center gap-4">
                <ListingPhoto
                  photoUrl={listing.photoUrls[0]}
                  emoji="🍃"
                  alt={listing.variete}
                  className="h-16 w-16 shrink-0 rounded-xl"
                />
                <div className="flex-1">
                  <Link
                    href={`/fruits/${listing.id}`}
                    className="font-semibold text-kagette-prune-700 hover:underline"
                  >
                    {listing.variete}
                  </Link>
                  <p className="text-xs text-kagette-prune-700/50">
                    {listing.quantiteKg} kg, {listing.zoneRetrait}
                  </p>
                </div>
                <FruitListingStatusActions id={listing.id} statut={listing.statut} />
              </Card>
            ))}
          </div>
        )}
      </div>

      {session.user.estCuisinier && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">Produits transformés</h2>
          {productListings.length === 0 ? (
            <p className="text-sm text-kagette-prune-700/60">Aucun produit transformé.</p>
          ) : (
            <div className="space-y-3">
              {productListings.map((listing) => (
                <Card key={listing.id} className="flex items-center gap-4">
                  <ListingPhoto
                    photoUrl={listing.photoUrls[0]}
                    emoji={emojiCategorie[listing.categorie] ?? "🍯"}
                    alt={listing.titre}
                    className="h-16 w-16 shrink-0 rounded-xl"
                  />
                  <div className="flex-1">
                    <Link
                      href={`/produits/${listing.id}`}
                      className="font-semibold text-kagette-prune-700 hover:underline"
                    >
                      {listing.titre}
                    </Link>
                    <p className="text-xs text-kagette-prune-700/50">
                      {formatPrix(listing.prix.toString())}, {listing.quantiteDisponible} en stock
                    </p>
                  </div>
                  <ProductListingStatusActions id={listing.id} statut={listing.statut} />
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
