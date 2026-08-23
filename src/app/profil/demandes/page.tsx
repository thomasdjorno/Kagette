import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatDate, libellesRaisonDemande, libellesStatutDemande, couleurStatutDemande } from "@/lib/format";

const statuts = ["EN_ATTENTE", "ACCEPTEE", "REFUSEE"] as const;

export default async function MesDemandesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/demandes");

  const statutFiltre = typeof searchParams.statut === "string" ? searchParams.statut : "";

  const demandes = await prisma.fruitRequest.findMany({
    where: {
      demandeurId: session.user.id,
      ...(statuts.includes(statutFiltre as (typeof statuts)[number]) && { statut: statutFiltre as (typeof statuts)[number] }),
    },
    include: { fruitListing: { include: { donneur: { select: { prenom: true, nom: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mes demandes</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          L&apos;historique de tes demandes de fruits, avec leur statut.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href="/profil/demandes"
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            !statutFiltre
              ? "bg-kagette-prune-700 text-white"
              : "bg-kagette-prune-700/5 text-kagette-prune-700 hover:bg-kagette-prune-700/10"
          }`}
        >
          Toutes
        </a>
        {statuts.map((statut) => (
          <a
            key={statut}
            href={`/profil/demandes?statut=${statut}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              statutFiltre === statut
                ? "bg-kagette-prune-700 text-white"
                : "bg-kagette-prune-700/5 text-kagette-prune-700 hover:bg-kagette-prune-700/10"
            }`}
          >
            {libellesStatutDemande[statut]}
          </a>
        ))}
      </div>

      {demandes.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune demande pour l&apos;instant.</p>
      ) : (
        <div className="space-y-3">
          {demandes.map((demande) => (
            <Card key={demande.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/fruits/${demande.fruitListingId}`}
                    className="font-semibold text-kagette-prune-700 hover:underline"
                  >
                    {demande.fruitListing.variete}
                  </Link>
                  <p className="mt-1 text-sm text-kagette-prune-700/70">
                    {demande.quantiteDemandeeKg} kg, {libellesRaisonDemande[demande.raison]}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">
                    Chez {demande.fruitListing.donneur.prenom}, {formatDate(demande.createdAt)}
                  </p>
                  {demande.message && (
                    <p className="mt-2 text-sm italic text-kagette-prune-700/60">
                      &laquo; {demande.message} &raquo;
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${couleurStatutDemande[demande.statut]}`}
                >
                  {libellesStatutDemande[demande.statut]}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
