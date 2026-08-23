import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrix } from "@/lib/format";

const statutLibelle: Record<string, string> = {
  EN_ATTENTE_PAIEMENT: "En attente de confirmation du paiement",
  PAYEE: "Payée",
  PRETE_RETRAIT: "Prête pour le retrait",
  RECUPEREE: "Récupérée",
  ANNULEE: "Annulée",
  REMBOURSEE: "Remboursée",
};

export default async function ConfirmationCommandePage({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { productListing: true },
  });

  if (!order || order.acheteurId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        {order.statut === "PAYEE" ? (
          <>
            <p className="text-3xl">🎉</p>
            <h1 className="mt-2 text-xl font-serif font-bold text-kagette-prune-700">Merci pour ta commande !</h1>
          </>
        ) : (
          <h1 className="text-xl font-serif font-bold text-kagette-prune-700">Commande en cours</h1>
        )}

        <p className="mt-2 text-sm font-medium text-kagette-feuille-600">
          {statutLibelle[order.statut] ?? order.statut}
        </p>

        <div className="mt-4 space-y-2 rounded-xl bg-kagette-framboise-50 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-kagette-prune-700/70">Produit</span>
            <span className="font-medium text-kagette-prune-700">{order.productListing.titre}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kagette-prune-700/70">Quantité</span>
            <span className="font-medium text-kagette-prune-700">{order.quantite}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-kagette-prune-700/70">Total payé</span>
            <span className="font-semibold text-kagette-framboise-600">
              {formatPrix(order.montantTotal.toString())}
            </span>
          </div>
        </div>

        {order.statut === "EN_ATTENTE_PAIEMENT" && (
          <p className="mt-3 text-xs text-kagette-prune-700/50">
            Le paiement est en cours de confirmation par Stripe, cette page se mettra à jour une
            fois le webhook reçu (rafraîchis si besoin).
          </p>
        )}

        <Link href={`/produits/${order.productListingId}`} className="mt-5 inline-block">
          <Button variant="ghost">Retour au produit</Button>
        </Link>
      </Card>
    </div>
  );
}
