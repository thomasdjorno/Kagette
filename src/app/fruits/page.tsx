import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FruitListingCard } from "@/components/listings/FruitListingCard";
import { Pagination } from "@/components/ui/Pagination";
import { distanceKm } from "@/lib/geo";

const TAILLE_PAGE = 12;

function pageDepuis(valeur: string | string[] | undefined) {
  const n = parseInt(Array.isArray(valeur) ? valeur[0] : valeur ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export default async function FruitsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const page = pageDepuis(searchParams.page);
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const mode = typeof searchParams.mode === "string" ? searchParams.mode : "";

  const [fruitListings, moi] = await Promise.all([
    prisma.fruitListing.findMany({
      where: {
        statut: "DISPONIBLE",
        region: { isActive: true },
        ...(q && { variete: { contains: q, mode: "insensitive" } }),
        ...(mode && { mode: mode as "DON" | "PARTICIPATION_LIBRE" }),
      },
      include: { donneur: { select: { prenom: true } } },
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

  const totalPages = Math.max(1, Math.ceil(fruitListings.length / TAILLE_PAGE));
  const pageAffichee = Math.min(page, totalPages);
  const fruitListingsPage = fruitListings.slice(
    (pageAffichee - 1) * TAILLE_PAGE,
    pageAffichee * TAILLE_PAGE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Fruits à récolter</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Toutes les annonces de fruits disponibles, {fruitListings.length} au total.
        </p>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Rechercher une variété..."
          className="min-w-0 flex-1 rounded-xl border border-kagette-prune-700/15 px-4 py-2 text-sm focus:border-kagette-framboise-500 focus:outline-none focus:ring-2 focus:ring-kagette-framboise-100"
        />
        <select
          name="mode"
          defaultValue={mode}
          className="rounded-xl border border-kagette-prune-700/15 px-3 py-2 text-sm"
        >
          <option value="">Don ou participation</option>
          <option value="DON">Don uniquement</option>
          <option value="PARTICIPATION_LIBRE">Participation libre</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-kagette-framboise-500 px-5 py-2 text-sm font-bold text-white hover:bg-kagette-framboise-600"
        >
          Rechercher
        </button>
        {(q || mode) && (
          <Link href="/fruits" className="text-sm text-kagette-prune-700/60 underline">
            Réinitialiser
          </Link>
        )}
      </form>

      {fruitListingsPage.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune annonce ne correspond.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
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
                disponibleDu={fruit.disponibleDu}
                disponibleAu={fruit.disponibleAu}
                distanceKm={distancePourAnnonce(fruit.latitude, fruit.longitude)}
              />
            ))}
          </div>
          <Pagination page={pageAffichee} totalPages={totalPages} paramName="page" otherParams={{ q, mode }} />
        </>
      )}
    </div>
  );
}
