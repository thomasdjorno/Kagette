import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { kgFruitsVersCo2, co2VersKmVoiture, formatKg, ordersAboutis } from "@/lib/impact";

export const metadata = {
  title: "Impact de Kagette - Mensignac et alentours",
};

export default async function ImpactPage() {
  const fruitListings = await prisma.fruitListing.findMany({
    include: {
      donneur: { select: { id: true, prenom: true } },
      demandes: { where: { statut: "ACCEPTEE" } },
      productListings: {
        include: {
          cuisinier: { select: { id: true, prenom: true } },
          orders: { where: ordersAboutis, select: { acheteurId: true } },
        },
      },
    },
  });

  const listingsValorisees = fruitListings.filter(
    (f) => f.demandes.length > 0 || f.productListings.length > 0
  );

  const kgFruitsSauves = listingsValorisees.reduce((somme, f) => somme + f.quantiteKg, 0);
  const co2Evite = kgFruitsVersCo2(kgFruitsSauves);
  const kmVoitureEquivalent = co2VersKmVoiture(co2Evite);

  const donneursActifs = new Set(listingsValorisees.map((f) => f.donneurId));
  const cuisiniersActifs = new Set(
    fruitListings.flatMap((f) => f.productListings.map((p) => p.cuisinierId))
  );
  const acheteursActifs = new Set(
    fruitListings.flatMap((f) => f.productListings.flatMap((p) => p.orders.map((o) => o.acheteurId)))
  );

  const [nbProduits, nbCommandes] = await Promise.all([
    prisma.productListing.count(),
    prisma.order.count({ where: ordersAboutis }),
  ]);

  const chaine = listingsValorisees
    .flatMap((f) =>
      f.productListings.map((p) => ({
        fruit: f.variete,
        donneurId: f.donneur.id,
        donneurPrenom: f.donneur.prenom,
        produitId: p.id,
        produitTitre: p.titre,
        cuisinierId: p.cuisinier.id,
        cuisinierPrenom: p.cuisinier.prenom,
        nbAcheteurs: new Set(p.orders.map((o) => o.acheteurId)).size,
      }))
    )
    .sort((a, b) => b.nbAcheteurs - a.nbAcheteurs)
    .slice(0, 6);

  const stats = [
    { label: "Fruits sauvés du gaspillage", valeur: formatKg(kgFruitsSauves) },
    { label: "Donneurs qui ont fait un don utile", valeur: donneursActifs.size.toString() },
    { label: "Cuisiniers locaux actifs", valeur: cuisiniersActifs.size.toString() },
    { label: "Gourmands qui ont acheté local", valeur: acheteursActifs.size.toString() },
    { label: "Produits transformés créés", valeur: nbProduits.toString() },
    { label: "Échanges locaux réalisés", valeur: nbCommandes.toString() },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          L&apos;impact de Kagette
        </h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Ce que la communauté de Mensignac et alentours a accompli ensemble, fruit par fruit.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-xl font-bold text-kagette-framboise-600 sm:text-2xl">{s.valeur}</p>
            <p className="mt-1 text-xs text-kagette-prune-700/60">{s.label}</p>
          </Card>
        ))}
      </div>

      {kgFruitsSauves > 0 && (
        <Card className="bg-kagette-feuille-50">
          <p className="text-sm font-semibold text-kagette-prune-700">
            🌍 Environ {formatKg(co2Evite)} de CO2 évités
          </p>
          <p className="mt-1 text-sm text-kagette-prune-700/70">
            Soit à peu près {Math.round(kmVoitureEquivalent)} km non parcourus en voiture — en
            évitant que ces fruits pourrissent au pied de l&apos;arbre plutôt que d&apos;être
            donnés ou transformés.
          </p>
          <p className="mt-2 text-xs text-kagette-prune-700/40">
            Estimation pédagogique basée sur des moyennes académiques (empreinte carbone d&apos;un
            kg de fruits, émissions moyennes d&apos;une voiture) — pas une mesure certifiée.
          </p>
        </Card>
      )}

      {chaine.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">La chaîne locale en action</h2>
          <div className="space-y-2">
            {chaine.map((c) => (
              <Card key={c.produitId} className="flex flex-wrap items-center gap-2 p-4 text-sm">
                <span>🌳</span>
                <Link href={`/profil/${c.donneurId}`} className="font-medium text-kagette-prune-700 hover:underline">
                  {c.donneurPrenom}
                </Link>
                <span className="text-kagette-prune-700/40">a donné des {c.fruit.toLowerCase()}, transformées par</span>
                <Link href={`/profil/${c.cuisinierId}`} className="font-medium text-kagette-prune-700 hover:underline">
                  {c.cuisinierPrenom}
                </Link>
                <span className="text-kagette-prune-700/40">en</span>
                <Link href={`/produits/${c.produitId}`} className="font-medium text-kagette-framboise-600 hover:underline">
                  {c.produitTitre}
                </Link>
                {c.nbAcheteurs > 0 && (
                  <span className="ml-auto rounded-full bg-kagette-mangue-50 px-2.5 py-1 text-xs font-semibold text-kagette-mangue-600">
                    acheté par {c.nbAcheteurs} personne{c.nbAcheteurs > 1 ? "s" : ""}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-sm text-kagette-prune-700/50">
        Un compte ? Découvre{" "}
        <Link href="/profil/impact" className="font-medium text-kagette-framboise-600 hover:underline">
          ton impact personnel →
        </Link>
      </p>
    </div>
  );
}
