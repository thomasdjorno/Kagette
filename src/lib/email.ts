import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "Kagette <bonjour@kagette.fr>";
const BASE_URL = process.env.AUTH_URL || "http://localhost:3000";

function isResendConfigured() {
  const key = process.env.RESEND_API_KEY;
  return !!key && key.startsWith("re_") && !key.includes("...");
}

const resend = isResendConfigured() ? new Resend(process.env.RESEND_API_KEY) : null;

async function envoyerEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[email désactivé — RESEND_API_KEY absente] à ${to} : ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (error) {
    console.error("Erreur envoi email Resend", error);
  }
}

function echapper(texte: string) {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function gabarit(titre: string, corps: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #3d2f26;">
      <h2 style="color:#2C4F3E; margin-bottom: 16px;">${titre}</h2>
      ${corps}
      <p style="margin-top:32px; font-size:12px; color:#999;">Kagette — Mensignac et alentours</p>
    </div>
  `;
}

export async function envoyerEmailConfirmationCommande({
  to,
  prenom,
  titre,
  montant,
}: {
  to: string;
  prenom: string;
  titre: string;
  montant: string;
}) {
  await envoyerEmail({
    to,
    subject: `Confirmation de ta commande — ${titre}`,
    html: gabarit(
      "Commande confirmée !",
      `<p>Bonjour ${echapper(prenom)},</p>
       <p>Ta commande <strong>${echapper(titre)}</strong> (${montant} €) a bien été payée.
       Le vendeur va te contacter via la messagerie Kagette pour organiser la remise.</p>`
    ),
  });
}

export async function envoyerEmailNouveauMessage({
  to,
  prenom,
  expediteurPrenom,
  conversationId,
}: {
  to: string;
  prenom: string;
  expediteurPrenom: string;
  conversationId: string;
}) {
  await envoyerEmail({
    to,
    subject: `Nouveau message de ${expediteurPrenom} sur Kagette`,
    html: gabarit(
      "Nouveau message",
      `<p>Bonjour ${echapper(prenom)},</p>
       <p>${echapper(expediteurPrenom)} t'a envoyé un message sur Kagette.</p>
       <p><a href="${BASE_URL}/messagerie/${encodeURIComponent(conversationId)}">Voir la conversation →</a></p>`
    ),
  });
}

export async function envoyerEmailBadgeHygiene({
  to,
  prenom,
  valide,
}: {
  to: string;
  prenom: string;
  valide: boolean;
}) {
  await envoyerEmail({
    to,
    subject: valide ? "Ton badge hygiène Kagette est validé !" : "Ta demande de badge hygiène Kagette",
    html: gabarit(
      valide ? "Badge hygiène validé" : "Badge hygiène refusé",
      valide
        ? `<p>Bonjour ${echapper(prenom)},</p>
           <p>Ton badge hygiène Kagette est validé. Tu peux maintenant publier des produits
           transformés à la vente.</p>
           <p><a href="${BASE_URL}/produits/nouveau">Publier un produit →</a></p>`
        : `<p>Bonjour ${echapper(prenom)},</p>
           <p>Ta demande de badge hygiène n'a pas été validée pour le moment.
           Contacte l'équipe Kagette pour plus d'informations.</p>`
    ),
  });
}

export async function envoyerEmailReinitialisationMotDePasse({
  to,
  prenom,
  token,
}: {
  to: string;
  prenom: string;
  token: string;
}) {
  await envoyerEmail({
    to,
    subject: "Réinitialise ton mot de passe Kagette",
    html: gabarit(
      "Réinitialisation de mot de passe",
      `<p>Bonjour ${echapper(prenom)},</p>
       <p>Tu as demandé à réinitialiser ton mot de passe Kagette. Ce lien est valable 1 heure :</p>
       <p><a href="${BASE_URL}/reinitialiser-mot-de-passe?token=${encodeURIComponent(token)}">Choisir un nouveau mot de passe →</a></p>
       <p>Si tu n'es pas à l'origine de cette demande, ignore simplement cet email.</p>`
    ),
  });
}

export async function envoyerEmailNouvelleDemandeFruits({
  to,
  prenom,
  demandeurPrenom,
  variete,
  quantiteDemandeeKg,
  fruitListingId,
}: {
  to: string;
  prenom: string;
  demandeurPrenom: string;
  variete: string;
  quantiteDemandeeKg: number;
  fruitListingId: string;
}) {
  await envoyerEmail({
    to,
    subject: `Nouvelle demande sur tes ${variete}`,
    html: gabarit(
      "Nouvelle demande de fruits",
      `<p>Bonjour ${echapper(prenom)},</p>
       <p>${echapper(demandeurPrenom)} souhaite ${quantiteDemandeeKg} kg de tes ${echapper(variete)}.</p>
       <p><a href="${BASE_URL}/fruits/${encodeURIComponent(fruitListingId)}">Voir la demande →</a></p>`
    ),
  });
}
