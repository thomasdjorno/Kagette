import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatPrix, formatDate } from "@/lib/format";
import { VenteActions } from "./VenteActions";

const statutLibelle: Record<string, string> = {
  EN_ATTENTE_PAIEMENT: "En attente de paiement",
  PAYEE: "Payée, à préparer",
  PRETE_RETRAIT: "Prête pour le retrait",
  RECUPEREE: "Récupérée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

export default async function MesVentesPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/ventes");

  const orders = await prisma.order.findMany({
    where: { productListing: { cuisinierId: session.user.id }, statut: { not: "EN_ATTENTE_PAIEMENT" } },
    include: { productListing: true, acheteur: { select: { prenom: true, nom: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">Mes ventes</h1>

      {orders.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">Aucune vente pour le moment.</p>
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
                    Acheté par {order.acheteur.prenom} {order.acheteur.nom.charAt(0)}.,{" "}
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-kagette-framboise-600">
                    {formatPrix(order.montantCuisinier.toString())}
                  </p>
                  <p className="text-xs text-kagette-prune-700/50">
                    {statutLibelle[order.statut] ?? order.statut}
                  </p>
                </div>
              </div>
              <VenteActions orderId={order.id} statut={order.statut} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
