import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ProductListingCard } from "@/components/listings/ProductListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { productCategories } from "@/lib/validation";
import { libellesCategorie } from "@/lib/format";
import { distanceKm } from "@/lib/geo";

const TAILLE_PAGE = 12;

function pageDepuis(valeur: string | string[] | undefined) {
  const n = parseInt(Array.isArray(valeur) ? valeur[0] : valeur ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const page = pageDepuis(searchParams.page);
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const categorie = typeof searchParams.categorie === "string" ? searchParams.categorie : "";

  const [productListings, moi] = await Promise.all([
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
      ? prisma.user.findUnique({ where: { id: session.user.id }, select: { latitude: true, longitude: true } })
      : Promise.resolve(null),
  ]);

  function distancePourAnnonce(lat: number, lng: number): number | null {
    if (!moi?.latitude || !moi?.longitude) return null;
    return distanceKm(moi.latitude, moi.longitude, lat, lng);
  }

  const totalPages = Math.max(1, Math.ceil(productListings.length / TAILLE_PAGE));
  const pageAffichee = Math.min(page, totalPages);
  const productListingsPage = productListings.slice(
    (pageAffichee - 1) * TAILLE_PAGE,
    pageAffichee * TAILLE_PAGE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Produits transformés</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Toutes les annonces de produits en vente, {productListings.length} au total.
        </p>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un produit..."
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
        {(q || categorie) && (
          <Link href="/produits" className="text-sm text-kagette-prune-700/60 underline">
            Réinitialiser
          </Link>
        )}
      </form>

      {productListingsPage.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune annonce ne correspond.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
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
                distanceKm={distancePourAnnonce(produit.latitude, produit.longitude)}
              />
            ))}
          </div>
          <Pagination page={pageAffichee} totalPages={totalPages} paramName="page" otherParams={{ q, categorie }} />
        </>
      )}
    </div>
  );
}
