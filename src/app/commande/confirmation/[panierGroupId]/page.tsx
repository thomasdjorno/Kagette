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
  params: { panierGroupId: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion");

  const orders = await prisma.order.findMany({
    where: { panierGroupId: params.panierGroupId },
    include: { productListing: true },
    orderBy: { createdAt: "asc" },
  });

  if (orders.length === 0 || orders[0].acheteurId !== session.user.id) notFound();

  const toutesPayees = orders.every((o) => o.statut === "PAYEE");
  const montantTotal = orders.reduce((somme, o) => somme + Number(o.montantTotal), 0);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        {toutesPayees ? (
          <>
            <p className="text-3xl">🎉</p>
            <h1 className="mt-2 text-xl font-serif font-bold text-kagette-prune-700">Merci pour ta commande !</h1>
          </>
        ) : (
          <h1 className="text-xl font-serif font-bold text-kagette-prune-700">Commande en cours</h1>
        )}

        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-kagette-framboise-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-kagette-prune-700">{order.productListing.titre}</span>
                <span className="text-kagette-prune-700/70">×{order.quantite}</span>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-xs font-medium text-kagette-feuille-600">
                  {statutLibelle[order.statut] ?? order.statut}
                </span>
                <span className="font-semibold text-kagette-framboise-600">
                  {formatPrix(order.montantTotal.toString())}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between border-t border-kagette-prune-700/10 pt-3 text-sm">
          <span className="font-semibold text-kagette-prune-700">Total payé</span>
          <span className="font-semibold text-kagette-framboise-600">{formatPrix(montantTotal)}</span>
        </div>

        {!toutesPayees && (
          <p className="mt-3 text-xs text-kagette-prune-700/50">
            Le paiement est en cours de confirmation par Stripe, cette page se mettra à jour une
            fois le webhook reçu (rafraîchis si besoin).
          </p>
        )}

        <Link href="/commandes" className="mt-5 inline-block">
          <Button variant="ghost">Voir mes commandes</Button>
        </Link>
      </Card>
    </div>
  );
}
