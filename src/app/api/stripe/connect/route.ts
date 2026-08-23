import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!session.user.estDonneur && !session.user.estCuisinier) {
    return NextResponse.json(
      { error: "Active une casquette donneur ou cuisinier pour connecter un compte de paiement" },
      { status: 403 }
    );
  }
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe Connect n'est pas encore configuré (STRIPE_SECRET_KEY manquant)." },
      { status: 501 }
    );
  }

  const stripe = getStripe();
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Session invalide, reconnecte-toi" }, { status: 401 });
  }
  const origin = process.env.AUTH_URL ?? "http://localhost:3000";

  let stripeAccountId = user.stripeAccountId;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email: user.email,
      capabilities: { transfers: { requested: true } },
      business_type: "individual",
    });
    stripeAccountId = account.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeAccountId } });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${origin}/api/stripe/connect`,
    return_url: `${origin}/api/stripe/connect/retour`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}

// Le refresh_url de Stripe (lien expiré) redirige ici en GET : on relance
// simplement un nouvel Account Link côté serveur.
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/connexion", process.env.AUTH_URL ?? "http://localhost:3000"));
  }

  const res = await POST();
  const data = await res.json();

  if (!res.ok || !data.url) {
    return NextResponse.redirect(new URL("/profil", process.env.AUTH_URL ?? "http://localhost:3000"));
  }

  return NextResponse.redirect(data.url);
}
