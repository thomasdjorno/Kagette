import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { calculerRepartition } from "@/lib/payment-split";
import { panierCheckoutSchema } from "@/lib/validation";

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

  const body = await request.json().catch(() => null);
  const parsed = panierCheckoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Panier invalide" }, { status: 400 });
  }

  const splitConfig = await prisma.splitConfig.findFirst({ where: { actif: true } });
  if (!splitConfig) {
    return NextResponse.json({ error: "Aucune configuration de répartition active" }, { status: 500 });
  }

  const listings = await prisma.productListing.findMany({
    where: { id: { in: parsed.data.items.map((i) => i.productListingId) } },
    include: { fruitListingOrigine: true },
  });

  const lignes: {
    listing: (typeof listings)[number];
    quantite: number;
    repartition: ReturnType<typeof calculerRepartition>;
  }[] = [];

  for (const item of parsed.data.items) {
    const listing = listings.find((l) => l.id === item.productListingId);
    if (!listing || listing.statut !== "EN_VENTE") {
      return NextResponse.json({ error: "Un produit du panier n'est plus en vente" }, { status: 400 });
    }
    if (listing.quantiteDisponible < item.quantite) {
      return NextResponse.json(
        { error: `Quantité indisponible pour ${listing.titre}` },
        { status: 400 }
      );
    }
    if (listing.cuisinierId === session.user.id) {
      return NextResponse.json(
        { error: "Tu ne peux pas acheter ton propre produit" },
        { status: 400 }
      );
    }

    const montantTotal = Number(listing.prix) * item.quantite;
    const repartition = calculerRepartition(
      montantTotal,
      {
        donneurPercent: Number(splitConfig.donneurPercent),
        cuisinierPercent: Number(splitConfig.cuisinierPercent),
        commissionPercent: Number(splitConfig.commissionPercent),
      },
      Boolean(listing.fruitListingOrigineId)
    );

    lignes.push({ listing, quantite: item.quantite, repartition });
  }

  const panierGroupId = randomUUID();

  const orders = await prisma.$transaction(
    lignes.map((ligne) =>
      prisma.order.create({
        data: {
          acheteurId: session.user.id,
          productListingId: ligne.listing.id,
          quantite: ligne.quantite,
          montantTotal: ligne.repartition.montantTotal,
          montantDonneur: ligne.repartition.montantDonneur,
          montantCuisinier: ligne.repartition.montantCuisinier,
          montantPlateforme: ligne.repartition.montantPlateforme,
          statut: "EN_ATTENTE_PAIEMENT",
          panierGroupId,
        },
      })
    )
  );

  const stripe = getStripe();
  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lignes.map((ligne) => ({
      price_data: {
        currency: "eur",
        product_data: { name: ligne.listing.titre },
        unit_amount: Math.round(Number(ligne.listing.prix) * 100),
      },
      quantity: ligne.quantite,
    })),
    metadata: { panierGroupId },
    success_url: `${origin}/commande/confirmation/${panierGroupId}`,
    cancel_url: `${origin}/panier`,
  });

  await prisma.order.updateMany({
    where: { id: { in: orders.map((o) => o.id) } },
    data: { stripePaymentIntentId: checkoutSession.payment_intent as string | null },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
