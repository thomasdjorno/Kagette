import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FruitListingCard } from "@/components/listings/FruitListingCard";
import { ProductListingCard } from "@/components/listings/ProductListingCard";
import { HomeMapSection } from "@/components/map/HomeMapSection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { productCategories } from "@/lib/validation";
import { libellesCategorie } from "@/lib/format";
import { distanceKm } from "@/lib/geo";
import { AlerteDisponibiliteForm } from "@/components/home/AlerteDisponibiliteForm";

const TAILLE_APERCU = 6;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const categorie = typeof searchParams.categorie === "string" ? searchParams.categorie : "";
  const aDesFiltres = q.length > 0 || categorie.length > 0;

  const fruitsWhere = {
    statut: "DISPONIBLE" as const,
    region: { isActive: true },
    ...(q && { variete: { contains: q, mode: "insensitive" as const } }),
  };
  const produitsWhere = {
    statut: "EN_VENTE" as const,
    region: { isActive: true },
    ...(q && { titre: { contains: q, mode: "insensitive" as const } }),
    ...(categorie && { categorie: categorie as (typeof productCategories)[number] }),
  };

  const [
    region,
    fruitListingsApercu,
    nbFruits,
    productListingsApercu,
    nbProduits,
    suivis,
    fruitsPourCarte,
    produitsPourCarte,
  ] = await Promise.all([
    prisma.region.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.fruitListing.findMany({
      where: fruitsWhere,
      include: { donneur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
      take: TAILLE_APERCU,
    }),
    prisma.fruitListing.count({ where: fruitsWhere }),
    prisma.productListing.findMany({
      where: produitsWhere,
      include: {
        cuisinier: { select: { prenom: true } },
        fruitListingOrigine: { include: { donneur: { select: { prenom: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: TAILLE_APERCU,
    }),
    prisma.productListing.count({ where: produitsWhere }),
    session?.user
      ? prisma.follow.findMany({ where: { suiveurId: session.user.id }, select: { suiviId: true } })
      : Promise.resolve([]),
    prisma.fruitListing.findMany({
      where: fruitsWhere,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        variete: true,
        zoneRetrait: true,
        mode: true,
        donneur: { select: { prenom: true } },
      },
    }),
    prisma.productListing.findMany({
      where: produitsWhere,
      select: {
        id: true,
        latitude: true,
        longitude: true,
        titre: true,
        zoneRetrait: true,
        prix: true,
        cuisinier: { select: { prenom: true } },
      },
    }),
  ]);

  const moi = session?.user
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { latitude: true, longitude: true },
      })
    : null;

  function distancePourAnnonce(lat: number, lng: number): number | null {
    if (!moi?.latitude || !moi?.longitude) return null;
    return distanceKm(moi.latitude, moi.longitude, lat, lng);
  }

  const idsSuivis = new Set(suivis.map((s) => s.suiviId));
  const favoris = [
    ...fruitListingsApercu
      .filter((f) => idsSuivis.has(f.donneurId))
      .map((f) => ({ type: "fruit" as const, data: f, date: f.createdAt })),
    ...productListingsApercu
      .filter((p) => idsSuivis.has(p.cuisinierId))
      .map((p) => ({ type: "produit" as const, data: p, date: p.createdAt })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  const lienFruits = q ? `/fruits?q=${encodeURIComponent(q)}` : "/fruits";
  const lienProduits = `/produits${
    q || categorie
      ? `?${new URLSearchParams({ ...(q && { q }), ...(categorie && { categorie }) }).toString()}`
      : ""
  }`;

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
          fruits={fruitsPourCarte.map((fruit) => ({
            id: fruit.id,
            latitude: fruit.latitude,
            longitude: fruit.longitude,
            variete: fruit.variete,
            zoneRetrait: fruit.zoneRetrait,
            donneurPrenom: fruit.donneur.prenom,
            mode: fruit.mode,
          }))}
          produits={produitsPourCarte.map((produit) => ({
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

      <form method="GET" className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher une variété, un produit..."
          className="min-w-0 flex-1 rounded-xl border border-kagette-prune-700/15 px-4 py-2 text-sm focus:border-kagette-framboise-500 focus:outline-none focus:ring-2 focus:ring-kagette-framboise-100"
        />
        <select
          name="categorie"
          defaultValue={categorie}
          className="rounded-xl border border-kagette-prune-700/15 px-3 py-2 text-sm"
        >
          <option value="">Toutes catégories</option>
          {productCategories.map((cat) => (
            <option key={cat} value={cat}>
              {libellesCategorie[cat]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-kagette-framboise-500 px-5 py-2 text-sm font-bold text-white hover:bg-kagette-framboise-600"
        >
          Rechercher
        </button>
        {aDesFiltres && (
          <a href="/" className="text-sm text-kagette-prune-700/60 underline">
            Réinitialiser
          </a>
        )}
      </form>

      {favoris.length > 0 && (
        <div className="rounded-2xl bg-kagette-mangue-50 p-5">
          <h2 className="mb-3 font-serif text-xl font-bold text-kagette-prune-700">
            🔔 Nouveautés de tes favoris
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {favoris.map((item) =>
              item.type === "fruit" ? (
                <FruitListingCard
                  key={item.data.id}
                  id={item.data.id}
                  variete={item.data.variete}
                  mode={item.data.mode}
                  montantParticipation={item.data.montantParticipation?.toString() ?? null}
                  zoneRetrait={item.data.zoneRetrait}
                  donneurPrenom={item.data.donneur.prenom}
                  photoUrl={item.data.photoUrls[0]}
                  disponibleDu={item.data.disponibleDu}
                  disponibleAu={item.data.disponibleAu}
                  distanceKm={distancePourAnnonce(item.data.latitude, item.data.longitude)}
                />
              ) : (
                <ProductListingCard
                  key={item.data.id}
                  id={item.data.id}
                  titre={item.data.titre}
                  categorie={item.data.categorie}
                  prix={item.data.prix.toString()}
                  zoneRetrait={item.data.zoneRetrait}
                  cuisinierPrenom={item.data.cuisinier.prenom}
                  donneurOriginePrenom={item.data.fruitListingOrigine?.donneur.prenom ?? null}
                  photoUrl={item.data.photoUrls[0]}
                  distanceKm={distancePourAnnonce(item.data.latitude, item.data.longitude)}
                />
              )
            )}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-kagette-prune-700">Fruits à récolter</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-kagette-prune-700/50">
              {nbFruits} annonce{nbFruits > 1 ? "s" : ""}
            </span>
            {nbFruits > 0 && (
              <Link
                href={lienFruits}
                className="text-sm font-medium text-kagette-framboise-600 hover:underline"
              >
                Voir tout →
              </Link>
            )}
          </div>
        </div>
        {fruitListingsApercu.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">Aucune annonce de fruits pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {fruitListingsApercu.map((fruit) => (
              <FruitListingCard
                key={fruit.id}
                id={fruit.id}
                variete={fruit.variete}
                mode={fruit.mode}
                montantParticipation={fruit.montantParticipation?.toString() ?? null}
                zoneRetrait={fruit.zoneRetrait}
                donneurPrenom={fruit.donneur.prenom}
                photoUrl={fruit.photoUrls[0]}
                disponibleDu={fruit.disponibleDu}
                disponibleAu={fruit.disponibleAu}
                distanceKm={distancePourAnnonce(fruit.latitude, fruit.longitude)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-kagette-prune-700">Produits transformés</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-kagette-prune-700/50">
              {nbProduits} annonce{nbProduits > 1 ? "s" : ""}
            </span>
            {nbProduits > 0 && (
              <Link
                href={lienProduits}
                className="text-sm font-medium text-kagette-framboise-600 hover:underline"
              >
                Voir tout →
              </Link>
            )}
          </div>
        </div>
        {productListingsApercu.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-kagette-prune-700/60">
              {aDesFiltres
                ? "Aucun produit ne correspond à ta recherche pour l'instant."
                : "Aucun produit en vente pour l'instant."}
            </p>
            {aDesFiltres && (
              <AlerteDisponibiliteForm
                critere={q}
                categorie={categorie}
                isAuthenticated={!!session?.user}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {productListingsApercu.map((produit) => (
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
                distanceKm={distancePourAnnonce(produit.latitude, produit.longitude)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
