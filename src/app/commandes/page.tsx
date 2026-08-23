import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatPrix, formatDate } from "@/lib/format";
import { OrderActions } from "./OrderActions";

const statutLibelle: Record<string, string> = {
  EN_ATTENTE_PAIEMENT: "En attente de paiement",
  PAYEE: "Payée",
  PRETE_RETRAIT: "Prête pour le retrait",
  RECUPEREE: "Récupérée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

export default async function MesCommandesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/commandes");

  const orders = await prisma.order.findMany({
    where: { acheteurId: session.user.id },
    include: { productListing: { include: { cuisinier: { select: { prenom: true } } } }, review: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">Mes achats</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune commande pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/produits/${order.productListingId}`}
                    className="font-semibold text-kagette-prune-700 hover:underline"
                  >
                    {order.productListing.titre}
                  </Link>
                  <p className="text-xs text-kagette-prune-700/50">
                    Par {order.productListing.cuisinier.prenom} — {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-kagette-framboise-600">
                    {formatPrix(order.montantTotal.toString())}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">
                    {statutLibelle[order.statut] ?? order.statut}
                  </p>
                </div>
              </div>

              <OrderActions
                orderId={order.id}
                statut={order.statut}
                aDejaUnAvis={Boolean(order.review)}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
