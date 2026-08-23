import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET() {
  const origin = process.env.AUTH_URL ?? "http://localhost:3000";
  const session = await auth();

  if (session?.user && isStripeConfigured()) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user?.stripeAccountId) {
      const stripe = getStripe();
      const account = await stripe.accounts.retrieve(user.stripeAccountId);
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeOnboardingComplete: Boolean(account.details_submitted) },
      });
    }
  }

  return NextResponse.redirect(new URL("/profil", origin));
}
