import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook Stripe non configuré" }, { status: 501 });
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as { metadata?: { orderId?: string }; payment_intent?: string };
    const orderId = checkoutSession.metadata?.orderId;
    if (orderId) {
      await traiterPaiementReussi(orderId, checkoutSession.payment_intent ?? null);
    }
  }

  return NextResponse.json({ received: true });
}

async function traiterPaiementReussi(orderId: string, paymentIntentId: string | null) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      productListing: {
        include: { cuisinier: true, fruitListingOrigine: { include: { donneur: true } } },
      },
    },
  });

  if (!order || order.statut !== "EN_ATTENTE_PAIEMENT") return;

  const stripe = getStripe();
  const { productListing } = order;

  let stripeTransferCuisinierId: string | null = null;
  let stripeTransferDonneurId: string | null = null;

  if (Number(order.montantCuisinier) > 0 && productListing.cuisinier.stripeAccountId) {
    const transfer = await stripe.transfers.create({
      amount: Math.round(Number(order.montantCuisinier) * 100),
      currency: "eur",
      destination: productListing.cuisinier.stripeAccountId,
      transfer_group: order.id,
    });
    stripeTransferCuisinierId = transfer.id;
  }

  const donneur = productListing.fruitListingOrigine?.donneur;
  if (donneur && Number(order.montantDonneur) > 0 && donneur.stripeAccountId) {
    const transfer = await stripe.transfers.create({
      amount: Math.round(Number(order.montantDonneur) * 100),
      currency: "eur",
      destination: donneur.stripeAccountId,
      transfer_group: order.id,
    });
    stripeTransferDonneurId = transfer.id;
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: {
        statut: "PAYEE",
        stripePaymentIntentId: paymentIntentId ?? order.stripePaymentIntentId,
        stripeTransferCuisinierId,
        stripeTransferDonneurId,
      },
    }),
    prisma.productListing.update({
      where: { id: productListing.id },
      data: {
        quantiteDisponible: { decrement: order.quantite },
        ...(productListing.quantiteDisponible - order.quantite <= 0 ? { statut: "RUPTURE" } : {}),
      },
    }),
  ]);
}
