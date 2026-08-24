import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ContactButton } from "@/components/messaging/ContactButton";
import { formatDate } from "@/lib/format";
import { NouvelleRechercheForm } from "./NouvelleRechercheForm";
import { RechercheActions } from "./RechercheActions";

export default async function RecherchesFruitsPage() {
  const session = await auth();

  const regionsActives = await prisma.region.findMany({ where: { isActive: true } });
  const regionParDefaut = regionsActives[0];

  const [recherchesOuvertes, mesRecherches] = await Promise.all([
    prisma.fruitSearchRequest.findMany({
      where: { statut: "OUVERTE", region: { isActive: true } },
      include: { cuisinier: { select: { id: true, prenom: true, nom: true, photoUrl: true } } },
      orderBy: { createdAt: "desc" },
    }),
    session?.user
      ? prisma.fruitSearchRequest.findMany({
          where: { cuisinierId: session.user.id },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const recherchesDesAutres = recherchesOuvertes.filter((r) => r.cuisinierId !== session?.user?.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          Recherches de fruits
        </h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Des cuisiniers cherchent des fruits pour leurs prochaines préparations. Si tu en as chez
          toi, propose-les-leur.
        </p>
      </div>

      {session?.user?.estCuisinier && regionParDefaut && (
        <NouvelleRechercheForm regionId={regionParDefaut.id} />
      )}

      {recherchesDesAutres.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune recherche active pour l&apos;instant.</p>
      ) : (
        <div className="space-y-3">
          {recherchesDesAutres.map((recherche) => (
            <Card key={recherche.id} className="flex items-start gap-3">
              <Avatar
                photoUrl={recherche.cuisinier.photoUrl}
                prenom={recherche.cuisinier.prenom}
                nom={recherche.cuisinier.nom}
              />
              <div className="flex-1">
                <p className="font-semibold text-kagette-prune-700">
                  {recherche.cuisinier.prenom} recherche des {recherche.variete}
                  {recherche.quantiteSouhaiteeKg ? ` (environ ${recherche.quantiteSouhaiteeKg} kg)` : ""}
                </p>
                {recherche.message && (
                  <p className="mt-1 text-sm text-kagette-prune-700/70">{recherche.message}</p>
                )}
                <p className="mt-1 text-xs text-kagette-prune-700/50">
                  Publié le {formatDate(recherche.createdAt)}
                </p>
                {session?.user && (
                  <div className="mt-3">
                    <ContactButton
                      label={`Proposer mes fruits à ${recherche.cuisinier.prenom}`}
                      fruitSearchRequestId={recherche.id}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {mesRecherches.length > 0 && (
        <div>
          <h2 className="mb-3 font-semibold text-kagette-prune-700">Mes recherches</h2>
          <div className="space-y-3">
            {mesRecherches.map((recherche) => (
              <Card key={recherche.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-kagette-prune-700">
                      {recherche.variete}
                      {recherche.quantiteSouhaiteeKg ? ` (environ ${recherche.quantiteSouhaiteeKg} kg)` : ""}
                    </p>
                    <p className="text-xs text-kagette-prune-700/50">
                      Publié le {formatDate(recherche.createdAt)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-kagette-prune-700/5 px-3 py-1 text-xs font-bold text-kagette-prune-700">
                    {recherche.statut === "OUVERTE"
                      ? "Ouverte"
                      : recherche.statut === "COMBLEE"
                        ? "Comblée"
                        : "Annulée"}
                  </span>
                </div>
                {recherche.statut === "OUVERTE" && <RechercheActions id={recherche.id} />}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
