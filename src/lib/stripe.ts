import Stripe from "stripe";

let client: Stripe | null = null;

function cleEstValide(cle: string | undefined): cle is string {
  return Boolean(cle && cle.startsWith("sk_") && !cle.includes("..."));
}

export function isStripeConfigured() {
  return cleEstValide(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!cleEstValide(process.env.STRIPE_SECRET_KEY)) {
    throw new Error("STRIPE_SECRET_KEY manquant ou invalide, Stripe Connect n'est pas configuré");
  }
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  }
  return client;
}
