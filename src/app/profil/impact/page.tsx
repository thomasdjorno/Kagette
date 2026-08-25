import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatPrix } from "@/lib/format";
import { kgFruitsVersCo2, formatKg, ordersAboutis } from "@/lib/impact";

export default async function MonImpactPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/impact");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  const [mesFruitListings, mesProduits, mesAchats] = await Promise.all([
    prisma.fruitListing.findMany({
      where: { donneurId: user.id },
      include: {
        demandes: {
          where: { statut: "ACCEPTEE" },
          include: { demandeur: { select: { id: true, prenom: true } } },
        },
        productListings: {
          include: {
            cuisinier: { select: { id: true, prenom: true } },
            orders: { where: ordersAboutis, select: { acheteurId: true } },
          },
        },
      },
    }),
    prisma.productListing.findMany({
      where: { cuisinierId: user.id },
      include: {
        fruitListingOrigine: { include: { donneur: { select: { id: true, prenom: true } } } },
        orders: {
          where: ordersAboutis,
          include: { acheteur: { select: { id: true, prenom: true } } },
        },
      },
    }),
    prisma.order.findMany({
      where: { acheteurId: user.id, ...ordersAboutis },
      include: {
        productListing: {
          include: {
            cuisinier: { select: { id: true, prenom: true } },
            fruitListingOrigine: { include: { donneur: { select: { id: true, prenom: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // --- Donneur ---
  const listingsValorisees = mesFruitListings.filter(
    (f) => f.demandes.length > 0 || f.productListings.length > 0
  );
  const kgDonnesDonneur = listingsValorisees.reduce((s, f) => s + f.quantiteKg, 0);
  const cuisiniersServis = new Set(
    mesFruitListings.flatMap((f) => f.productListings.map((p) => p.cuisinierId))
  );
  const personnesServiesDonneur = new Set([
    ...mesFruitListings.flatMap((f) => f.demandes.map((d) => d.demandeurId)),
    ...mesFruitListings.flatMap((f) => f.productListings.flatMap((p) => p.orders.map((o) => o.acheteurId))),
  ]);
  const chaineDonneur = mesFruitListings.flatMap((f) =>
    f.productListings.map((p) => ({
      key: p.id,
      fruit: f.variete,
      produitId: p.id,
      produitTitre: p.titre,
      cuisinierId: p.cuisinier.id,
      cuisinierPrenom: p.cuisinier.prenom,
      nbAcheteurs: new Set(p.orders.map((o) => o.acheteurId)).size,
    }))
  );

  // --- Cuisinier ---
  const kgTransformesParListing = new Map<string, number>();
  mesProduits.forEach((p) => {
    if (p.fruitListingOrigine) {
      kgTransformesParListing.set(p.fruitListingOrigine.id, p.fruitListingOrigine.quantiteKg);
    }
  });
  const kgTransformes = [...kgTransformesParListing.values()].reduce((s, kg) => s + kg, 0);
  const donneursCollabores = new Set(
    mesProduits.map((p) => p.fruitListingOrigine?.donneurId).filter((id): id is string => !!id)
  );
  const acheteursServisCuisinier = new Set(mesProduits.flatMap((p) => p.orders.map((o) => o.acheteurId)));
  const nbVentesCuisinier = mesProduits.reduce((s, p) => s + p.orders.length, 0);
  const montantGagneCuisinier = mesProduits.reduce(
    (s, p) => s + p.orders.reduce((s2, o) => s2 + Number(o.montantCuisinier), 0),
    0
  );

  // --- Acheteur ---
  const montantDepenseAcheteur = mesAchats.reduce((s, o) => s + Number(o.montantTotal), 0);
  const cuisiniersSoutenus = new Set(mesAchats.map((o) => o.productListing.cuisinierId));
  const donneursSoutenusIndirectement = new Set(
    mesAchats.map((o) => o.productListing.fruitListingOrigine?.donneurId).filter((id): id is string => !!id)
  );

  const aucunImpact =
    listingsValorisees.length === 0 && mesProduits.length === 0 && mesAchats.length === 0;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mon impact</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Ce que tu as concrètement changé, fruit par fruit, sur Kagette.
        </p>
      </div>

      {aucunImpact && (
        <Card>
          <p className="text-sm text-kagette-prune-700/60">
            Rien pour l&apos;instant — ton impact apparaîtra dès qu&apos;un fruit sera donné,
            transformé ou acheté grâce à toi.
          </p>
        </Card>
      )}

      {listingsValorisees.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">🌱 En tant que donneur</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-feuille-600">{formatKg(kgDonnesDonneur)}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">sauvés du gaspillage</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-feuille-600">{cuisiniersServis.size}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">cuisinier(s) qui t&apos;ont fait confiance</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-feuille-600">{personnesServiesDonneur.size}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">personnes touchées</p>
            </Card>
          </div>
          <p className="mt-2 text-xs text-kagette-prune-700/40">
            Environ {formatKg(kgFruitsVersCo2(kgDonnesDonneur))} de CO2 évités (estimation).
          </p>
          {chaineDonneur.length > 0 && (
            <div className="mt-3 space-y-2">
              {chaineDonneur.map((c) => (
                <Card key={c.key} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                  <span>🌳→🍯</span>
                  <span className="text-kagette-prune-700/60">Tes {c.fruit.toLowerCase()} sont devenues</span>
                  <Link href={`/produits/${c.produitId}`} className="font-medium text-kagette-framboise-600 hover:underline">
                    {c.produitTitre}
                  </Link>
                  <span className="text-kagette-prune-700/60">grâce à</span>
                  <Link href={`/profil/${c.cuisinierId}`} className="font-medium text-kagette-prune-700 hover:underline">
                    {c.cuisinierPrenom}
                  </Link>
                  {c.nbAcheteurs > 0 && (
                    <span className="ml-auto rounded-full bg-kagette-mangue-50 px-2.5 py-1 text-xs font-semibold text-kagette-mangue-600">
                      goûtée par {c.nbAcheteurs} personne{c.nbAcheteurs > 1 ? "s" : ""}
                    </span>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {mesProduits.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">👩‍🍳 En tant que cuisinier</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-framboise-600">{mesProduits.length}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">créations publiées</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-framboise-600">{nbVentesCuisinier}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">ventes réalisées</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-framboise-600">{formatPrix(montantGagneCuisinier)}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">générés en circuit court</p>
            </Card>
          </div>
          {donneursCollabores.size > 0 && (
            <p className="mt-2 text-xs text-kagette-prune-700/40">
              {formatKg(kgTransformes)} de fruits transformés, venus de {donneursCollabores.size}{" "}
              donneur{donneursCollabores.size > 1 ? "s" : ""} différent{donneursCollabores.size > 1 ? "s" : ""},
              servi à {acheteursServisCuisinier.size} gourmand{acheteursServisCuisinier.size > 1 ? "s" : ""}.
            </p>
          )}
          {mesProduits.some((p) => p.fruitListingOrigine) && (
            <div className="mt-3 space-y-2">
              {mesProduits
                .filter((p) => p.fruitListingOrigine)
                .map((p) => (
                  <Card key={p.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                    <span>🌳→🍯</span>
                    <span className="text-kagette-prune-700/60">Fruits de</span>
                    <Link
                      href={`/profil/${p.fruitListingOrigine!.donneur.id}`}
                      className="font-medium text-kagette-prune-700 hover:underline"
                    >
                      {p.fruitListingOrigine!.donneur.prenom}
                    </Link>
                    <span className="text-kagette-prune-700/60">→ ta création</span>
                    <Link href={`/produits/${p.id}`} className="font-medium text-kagette-framboise-600 hover:underline">
                      {p.titre}
                    </Link>
                    {p.orders.length > 0 && (
                      <span className="ml-auto rounded-full bg-kagette-mangue-50 px-2.5 py-1 text-xs font-semibold text-kagette-mangue-600">
                        {new Set(p.orders.map((o) => o.acheteurId)).size} acheteur(s)
                      </span>
                    )}
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {mesAchats.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">🛒 En tant qu&apos;acheteur</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-prune-700">{mesAchats.length}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">produits locaux achetés</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-prune-700">{cuisiniersSoutenus.size}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">cuisinier(s) soutenu(s)</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xl font-bold text-kagette-prune-700">{formatPrix(montantDepenseAcheteur)}</p>
              <p className="mt-1 text-xs text-kagette-prune-700/60">investis en circuit court</p>
            </Card>
          </div>
          {donneursSoutenusIndirectement.size > 0 && (
            <p className="mt-2 text-xs text-kagette-prune-700/40">
              Dont {donneursSoutenusIndirectement.size} donneur{donneursSoutenusIndirectement.size > 1 ? "s" : ""} de fruits
              soutenu{donneursSoutenusIndirectement.size > 1 ? "s" : ""} indirectement.
            </p>
          )}
          <div className="mt-3 space-y-2">
            {mesAchats.map((o) => (
              <Card key={o.id} className="flex flex-wrap items-center gap-2 p-3 text-sm">
                <span>🛒</span>
                <span className="text-kagette-prune-700/60">Tu as acheté</span>
                <Link
                  href={`/produits/${o.productListingId}`}
                  className="font-medium text-kagette-framboise-600 hover:underline"
                >
                  {o.productListing.titre}
                </Link>
                <span className="text-kagette-prune-700/60">de</span>
                <Link
                  href={`/profil/${o.productListing.cuisinier.id}`}
                  className="font-medium text-kagette-prune-700 hover:underline"
                >
                  {o.productListing.cuisinier.prenom}
                </Link>
                {o.productListing.fruitListingOrigine && (
                  <>
                    <span className="text-kagette-prune-700/60">avec les fruits de</span>
                    <Link
                      href={`/profil/${o.productListing.fruitListingOrigine.donneur.id}`}
                      className="font-medium text-kagette-prune-700 hover:underline"
                    >
                      {o.productListing.fruitListingOrigine.donneur.prenom}
                    </Link>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-sm text-kagette-prune-700/50">
        Voir aussi{" "}
        <Link href="/impact" className="font-medium text-kagette-framboise-600 hover:underline">
          l&apos;impact de toute la communauté →
        </Link>
      </p>
    </div>
  );
}
