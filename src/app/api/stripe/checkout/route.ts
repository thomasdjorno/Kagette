import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { calculerRepartition } from "@/lib/payment-split";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Le paiement n'est pas encore configuré (STRIPE_SECRET_KEY manquant)." },
      { status: 501 }
    );
  }

  const { productListingId, quantite = 1 } = await request.json();
  if (typeof productListingId !== "string" || !Number.isInteger(quantite) || quantite < 1) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const listing = await prisma.productListing.findUnique({
    where: { id: productListingId },
    include: { fruitListingOrigine: true },
  });

  if (!listing || listing.statut !== "EN_VENTE") {
    return NextResponse.json({ error: "Ce produit n'est plus en vente" }, { status: 400 });
  }
  if (listing.quantiteDisponible < quantite) {
    return NextResponse.json({ error: "Quantité indisponible" }, { status: 400 });
  }
  if (listing.cuisinierId === session.user.id) {
    return NextResponse.json({ error: "Tu ne peux pas acheter ton propre produit" }, { status: 400 });
  }

  const splitConfig = await prisma.splitConfig.findFirst({ where: { actif: true } });
  if (!splitConfig) {
    return NextResponse.json({ error: "Aucune configuration de répartition active" }, { status: 500 });
  }

  const montantTotal = Number(listing.prix) * quantite;
  const aUnDonneur = Boolean(listing.fruitListingOrigineId);
  const repartition = calculerRepartition(
    montantTotal,
    {
      donneurPercent: Number(splitConfig.donneurPercent),
      cuisinierPercent: Number(splitConfig.cuisinierPercent),
      commissionPercent: Number(splitConfig.commissionPercent),
    },
    aUnDonneur
  );

  const order = await prisma.order.create({
    data: {
      acheteurId: session.user.id,
      productListingId: listing.id,
      quantite,
      montantTotal: repartition.montantTotal,
      montantDonneur: repartition.montantDonneur,
      montantCuisinier: repartition.montantCuisinier,
      montantPlateforme: repartition.montantPlateforme,
      statut: "EN_ATTENTE_PAIEMENT",
    },
  });

  const stripe = getStripe();
  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: { name: listing.titre },
          unit_amount: Math.round(Number(listing.prix) * 100),
        },
        quantity: quantite,
      },
    ],
    metadata: { orderId: order.id },
    success_url: `${origin}/commande/confirmation/${order.id}`,
    cancel_url: `${origin}/produits/${listing.id}`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripePaymentIntentId: checkoutSession.payment_intent as string | null },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
