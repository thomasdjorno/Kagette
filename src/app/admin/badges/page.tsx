import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { BadgeActions } from "./BadgeActions";

export default async function AdminBadgesPage() {
  const demandes = await prisma.user.findMany({
    where: { hygieneBadgeStatus: "EN_ATTENTE" },
    orderBy: { charteHygieneAccepteeLe: "asc" },
  });

  return (
    <div className="space-y-3">
      {demandes.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune demande de badge en attente.</p>
      ) : (
        demandes.map((user) => (
          <Card key={user.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-kagette-prune-700">
                {user.prenom} {user.nom} — {user.email}
              </h3>
              <p className="text-sm text-kagette-prune-700/60">
                SIRET : {user.siret ?? "non renseigné"}
              </p>
              {user.charteHygieneAccepteeLe && (
                <p className="text-xs text-kagette-prune-700/50">
                  Charte acceptée le {formatDate(user.charteHygieneAccepteeLe)}
                </p>
              )}
            </div>
            <BadgeActions userId={user.id} />
          </Card>
        ))
      )}
    </div>
  );
}
