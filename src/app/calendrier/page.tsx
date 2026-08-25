import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { fruitsSaisonDordogne, fruitsDeSaison, libellesMois, periodeTexte } from "@/lib/saisonnalite";

export const metadata = {
  title: "Calendrier des fruits en Dordogne - Kagette",
};

export default async function CalendrierPage() {
  const moisActuel = new Date().getMonth() + 1;

  const listingsDisponibles = await prisma.fruitListing.findMany({
    where: { statut: "DISPONIBLE", region: { isActive: true } },
    select: { variete: true },
  });

  function nombreAnnonces(nomFruit: string) {
    return listingsDisponibles.filter((l) =>
      l.variete.toLowerCase().includes(nomFruit.toLowerCase())
    ).length;
  }

  const deSaison = fruitsDeSaison(moisActuel);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          Calendrier des fruits en Dordogne
        </h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Pour savoir quand donner, chercher ou transformer chaque fruit — repères indicatifs,
          la météo de l&apos;année fait toujours varier un peu les dates.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold text-kagette-prune-700">
          De saison en ce moment ({libellesMois[moisActuel - 1]})
        </h2>
        {deSaison.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">
            Aucun fruit de la liste n&apos;est en pleine saison ce mois-ci.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {deSaison.map((fruit) => {
              const nb = nombreAnnonces(fruit.nom);
              return (
                <Link key={fruit.nom} href={`/?q=${encodeURIComponent(fruit.nom)}`}>
                  <Card className="p-4 text-center transition-colors hover:border-kagette-feuille-500">
                    <p className="text-2xl">{fruit.emoji}</p>
                    <p className="mt-1 text-sm font-semibold text-kagette-prune-700">{fruit.nom}</p>
                    <p className="mt-1 text-xs text-kagette-feuille-600">
                      {nb > 0 ? `${nb} annonce${nb > 1 ? "s" : ""}` : "Aucune annonce"}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-1 font-semibold text-kagette-prune-700">Toute l&apos;année</h2>
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-kagette-prune-700/60">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-kagette-feuille-500" /> en saison
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-kagette-framboise-500" /> ce mois-ci
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm border border-kagette-prune-700/20 bg-white" /> hors
            saison
          </span>
        </div>

        <div className="mb-1 flex justify-between gap-0.5 px-3">
          {libellesMois.map((m, i) => (
            <span
              key={m}
              className={`flex-1 text-center text-[10px] ${
                i + 1 === moisActuel
                  ? "font-bold text-kagette-framboise-600"
                  : "text-kagette-prune-700/40"
              }`}
            >
              {m[0]}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          {fruitsSaisonDordogne.map((fruit) => {
            const enSaison = fruit.mois.includes(moisActuel);
            return (
              <Card
                key={fruit.nom}
                className={`p-3 ${enSaison ? "border-kagette-feuille-500" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-kagette-prune-700">
                    {fruit.emoji} {fruit.nom}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">{periodeTexte(fruit.mois)}</p>
                </div>
                <div className="mt-2 flex justify-between gap-0.5">
                  {libellesMois.map((m, i) => {
                    const actif = fruit.mois.includes(i + 1);
                    const estMoisActuel = i + 1 === moisActuel;
                    return (
                      <div
                        key={m}
                        title={m}
                        className={`h-4 flex-1 rounded-sm ${
                          actif
                            ? estMoisActuel
                              ? "bg-kagette-framboise-500"
                              : "bg-kagette-feuille-500"
                            : "border border-kagette-prune-700/15 bg-white"
                        }`}
                      />
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
