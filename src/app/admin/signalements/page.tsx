import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { ReportActions } from "./ReportActions";

export default async function AdminSignalementsPage() {
  const signalements = await prisma.report.findMany({
    where: { statut: "EN_ATTENTE" },
    include: {
      reporter: { select: { prenom: true, nom: true } },
      fruitListing: { select: { id: true, variete: true } },
      productListing: { select: { id: true, titre: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-3">
      {signalements.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucun signalement en attente.</p>
      ) : (
        signalements.map((signalement) => (
          <Card key={signalement.id} className="space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                {signalement.fruitListing && (
                  <Link
                    href={`/fruits/${signalement.fruitListing.id}`}
                    className="font-semibold text-kagette-framboise-600 hover:underline"
                  >
                    {signalement.fruitListing.variete} (annonce fruits)
                  </Link>
                )}
                {signalement.productListing && (
                  <Link
                    href={`/produits/${signalement.productListing.id}`}
                    className="font-semibold text-kagette-framboise-600 hover:underline"
                  >
                    {signalement.productListing.titre} (produit)
                  </Link>
                )}
                <p className="mt-1 text-sm text-kagette-prune-700/80">« {signalement.motif} »</p>
                <p className="text-xs text-kagette-prune-700/50">
                  Signalé par {signalement.reporter.prenom} {signalement.reporter.nom.charAt(0)}. le{" "}
                  {formatDate(signalement.createdAt)}
                </p>
              </div>
              <ReportActions reportId={signalement.id} />
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
