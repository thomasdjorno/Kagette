import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SplitConfigForm } from "./SplitConfigForm";

export default async function AdminRepartitionPage() {
  const splitConfig = await prisma.splitConfig.findFirst({ where: { actif: true } });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-1 font-semibold text-kagette-prune-700">Répartition des paiements</h2>
        <p className="mb-3 text-sm text-kagette-prune-700/60">
          Définit comment chaque vente de produit transformé est répartie entre le donneur de
          fruits, le cuisinier et la plateforme. S&apos;applique à toutes les commandes à partir de
          maintenant (les commandes déjà payées ne changent pas).
        </p>
        {splitConfig ? (
          <SplitConfigForm
            donneurPercent={Number(splitConfig.donneurPercent)}
            cuisinierPercent={Number(splitConfig.cuisinierPercent)}
            commissionPercent={Number(splitConfig.commissionPercent)}
          />
        ) : (
          <p className="text-sm text-kagette-framboise-600">
            Aucune configuration active, les paiements sont bloqués jusqu&apos;à ce qu&apos;une
            configuration soit créée en base.
          </p>
        )}
      </Card>
    </div>
  );
}
