import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FruitListingCard } from "@/components/listings/FruitListingCard";
import { ProductListingCard } from "@/components/listings/ProductListingCard";
import { HomeMapSection } from "@/components/map/HomeMapSection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Pagination } from "@/components/ui/Pagination";
import { productCategories } from "@/lib/validation";
import { libellesCategorie } from "@/lib/format";

const TAILLE_PAGE = 6;

function pageDepuis(valeur: string | string[] | undefined) {
  const n = parseInt(Array.isArray(valeur) ? valeur[0] : valeur ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const fruitsPage = pageDepuis(searchParams.fruitsPage);
  const produitsPage = pageDepuis(searchParams.produitsPage);
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const categorie = typeof searchParams.categorie === "string" ? searchParams.categorie : "";
  const aDesFiltres = q.length > 0 || categorie.length > 0;

  const [region, fruitListings, productListings, suivis] = await Promise.all([
    prisma.region.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" } }),
    prisma.fruitListing.findMany({
      where: {
        statut: "DISPONIBLE",
        region: { isActive: true },
        ...(q && { variete: { contains: q, mode: "insensitive" } }),
      },
      include: { donneur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productListing.findMany({
      where: {
        statut: "EN_VENTE",
        region: { isActive: true },
        ...(q && { titre: { contains: q, mode: "insensitive" } }),
        ...(categorie && { categorie: categorie as (typeof productCategories)[number] }),
      },
      include: {
        cuisinier: { select: { prenom: true } },
        fruitListingOrigine: { include: { donneur: { select: { prenom: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    session?.user
      ? prisma.follow.findMany({ where: { suiveurId: session.user.id }, select: { suiviId: true } })
      : Promise.resolve([]),
  ]);

  const idsSuivis = new Set(suivis.map((s) => s.suiviId));
  const favoris = [
    ...fruitListings
      .filter((f) => idsSuivis.has(f.donneurId))
      .map((f) => ({ type: "fruit" as const, data: f, date: f.createdAt })),
    ...productListings
      .filter((p) => idsSuivis.has(p.cuisinierId))
      .map((p) => ({ type: "produit" as const, data: p, date: p.createdAt })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  const fruitsTotalPages = Math.max(1, Math.ceil(fruitListings.length / TAILLE_PAGE));
  const fruitsPageAffichee = Math.min(fruitsPage, fruitsTotalPages);
  const fruitListingsPage = fruitListings.slice(
    (fruitsPageAffichee - 1) * TAILLE_PAGE,
    fruitsPageAffichee * TAILLE_PAGE
  );

  const produitsTotalPages = Math.max(1, Math.ceil(productListings.length / TAILLE_PAGE));
  const produitsPageAffichee = Math.min(produitsPage, produitsTotalPages);
  const productListingsPage = productListings.slice(
    (produitsPageAffichee - 1) * TAILLE_PAGE,
    produitsPageAffichee * TAILLE_PAGE
  );

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
                />
              )
            )}
          </div>
        </div>
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
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {fruitListingsPage.map((fruit) => (
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
            <Pagination
              page={fruitsPageAffichee}
              totalPages={fruitsTotalPages}
              paramName="fruitsPage"
              otherParams={{ produitsPage: String(produitsPageAffichee), q, categorie }}
            />
          </>
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
          <>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {productListingsPage.map((produit) => (
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
            <Pagination
              page={produitsPageAffichee}
              totalPages={produitsTotalPages}
              paramName="produitsPage"
              otherParams={{ fruitsPage: String(fruitsPageAffichee), q, categorie }}
            />
          </>
        )}
      </div>
    </div>
  );
}
