import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { formatPrix, formatDate } from "@/lib/format";

export default async function MesGainsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/gains");

  const orders = await prisma.order.findMany({
    where: {
      productListing: { fruitListingOrigine: { donneurId: session.user.id } },
      statut: { not: "EN_ATTENTE_PAIEMENT" },
    },
    include: { productListing: true },
    orderBy: { createdAt: "desc" },
  });

  const total = orders.reduce((somme, order) => somme + Number(order.montantDonneur), 0);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mes gains</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Ce que tu as gagné quand tes fruits ont servi à un produit vendu.
        </p>
      </div>

      <Card className="bg-kagette-feuille-50">
        <p className="text-xs font-medium uppercase tracking-wide text-kagette-feuille-600">
          Total cumulé
        </p>
        <p className="mt-1 text-2xl font-bold text-kagette-prune-700">{formatPrix(total)}</p>
      </Card>

      {orders.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">
          Aucun gain pour l&apos;instant, ça viendra dès qu&apos;un produit fait avec tes fruits
          sera vendu.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex items-center justify-between">
              <div>
                <Link
                  href={`/produits/${order.productListingId}`}
                  className="font-semibold text-kagette-prune-700 hover:underline"
                >
                  {order.productListing.titre}
                </Link>
                <p className="text-xs text-kagette-prune-700/50">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-kagette-feuille-600">
                  {formatPrix(order.montantDonneur.toString())}
                </p>
                <p className="text-xs text-kagette-prune-700/50">
                  {order.stripeTransferDonneurId ? "Versé ✓" : "En attente de versement"}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
