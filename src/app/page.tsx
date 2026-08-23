import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FruitListingCard } from "@/components/listings/FruitListingCard";
import { ProductListingCard } from "@/components/listings/ProductListingCard";
import { HomeMapSection } from "@/components/map/HomeMapSection";
import { HeroBanner } from "@/components/home/HeroBanner";

export default async function HomePage() {
  const session = await auth();

  const [region, fruitListings, productListings] = await Promise.all([
    prisma.region.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.fruitListing.findMany({
      where: { statut: "DISPONIBLE", region: { isActive: true } },
      include: { donneur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productListing.findMany({
      where: { statut: "EN_VENTE", region: { isActive: true } },
      include: {
        cuisinier: { select: { prenom: true } },
        fruitListingOrigine: { include: { donneur: { select: { prenom: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <HeroBanner isAuthenticated={!!session?.user} />

      {region && (
        <HomeMapSection
          region={{
            nom: region.nom,
            latitude: region.latitude,
            longitude: region.longitude,
            rayonKm: region.rayonKm,
          }}
          fruits={fruitListings.map((fruit) => ({
            id: fruit.id,
            latitude: fruit.latitude,
            longitude: fruit.longitude,
            variete: fruit.variete,
            zoneRetrait: fruit.zoneRetrait,
            donneurPrenom: fruit.donneur.prenom,
            mode: fruit.mode,
          }))}
          produits={productListings.map((produit) => ({
            id: produit.id,
            latitude: produit.latitude,
            longitude: produit.longitude,
            titre: produit.titre,
            zoneRetrait: produit.zoneRetrait,
            cuisinierPrenom: produit.cuisinier.prenom,
            prix: produit.prix.toString(),
          }))}
        />
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-kagette-prune-700">Fruits à récolter</h2>
          <span className="text-sm text-kagette-prune-700/50">
            {fruitListings.length} annonce{fruitListings.length > 1 ? "s" : ""}
          </span>
        </div>
        {fruitListings.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">Aucune annonce de fruits pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {fruitListings.map((fruit) => (
              <FruitListingCard
                key={fruit.id}
                id={fruit.id}
                variete={fruit.variete}
                mode={fruit.mode}
                montantParticipation={fruit.montantParticipation?.toString() ?? null}
                zoneRetrait={fruit.zoneRetrait}
                donneurPrenom={fruit.donneur.prenom}
                photoUrl={fruit.photoUrls[0]}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-kagette-prune-700">Produits transformés</h2>
          <span className="text-sm text-kagette-prune-700/50">
            {productListings.length} annonce{productListings.length > 1 ? "s" : ""}
          </span>
        </div>
        {productListings.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">Aucun produit en vente pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {productListings.map((produit) => (
              <ProductListingCard
                key={produit.id}
                id={produit.id}
                titre={produit.titre}
                categorie={produit.categorie}
                prix={produit.prix.toString()}
                zoneRetrait={produit.zoneRetrait}
                cuisinierPrenom={produit.cuisinier.prenom}
                donneurOriginePrenom={produit.fruitListingOrigine?.donneur.prenom ?? null}
                photoUrl={produit.photoUrls[0]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
