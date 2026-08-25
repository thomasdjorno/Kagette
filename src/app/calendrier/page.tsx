import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { fruitsSaisonDordogne, fruitsDeSaison, libellesMois } from "@/lib/saisonnalite";

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
        <h2 className="mb-3 font-semibold text-kagette-prune-700">Toute l&apos;année</h2>
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-2 text-left font-medium text-kagette-prune-700">
                  Fruit
                </th>
                {libellesMois.map((m, i) => (
                  <th
                    key={m}
                    className={`p-2 font-medium ${
                      i + 1 === moisActuel ? "text-kagette-framboise-600" : "text-kagette-prune-700/50"
                    }`}
                  >
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fruitsSaisonDordogne.map((fruit) => (
                <tr key={fruit.nom} className="border-t border-kagette-prune-700/5">
                  <td className="sticky left-0 whitespace-nowrap bg-white p-2 font-medium text-kagette-prune-700">
                    {fruit.emoji} {fruit.nom}
                  </td>
                  {libellesMois.map((_, i) => {
                    const actif = fruit.mois.includes(i + 1);
                    const estMoisActuel = i + 1 === moisActuel;
                    return (
                      <td key={i} className="p-1 text-center">
                        <div
                          className={`mx-auto h-4 w-4 rounded-sm ${
                            actif
                              ? estMoisActuel
                                ? "bg-kagette-framboise-500"
                                : "bg-kagette-feuille-400"
                              : "bg-kagette-prune-700/5"
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
