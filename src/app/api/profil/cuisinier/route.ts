import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { demandeCuisinierSchema } from "@/lib/validation";
import { creerNotification } from "@/lib/notifications";
import { envoyerEmailNouvelleDemandeBadge } from "@/lib/email";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = demandeCuisinierSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { siret } = parsed.data;

  // estCuisinier n'est activé qu'à la validation manuelle du badge par un
  // admin (cf. backoffice), ici on enregistre uniquement la demande.
  const [demandeur, admins] = await Promise.all([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        siret: siret || null,
        charteHygieneAccepteeLe: new Date(),
        hygieneBadgeStatus: "EN_ATTENTE",
      },
    }),
    prisma.user.findMany({ where: { estAdmin: true }, select: { id: true, email: true } }),
  ]);

  // Le badge est le seul vrai verrou pour vendre : on prévient les admins
  // tout de suite pour ne pas laisser un cuisinier bloqué inutilement
  // longtemps en attendant une validation.
  await Promise.all(
    admins.flatMap((admin) => [
      creerNotification({
        userId: admin.id,
        message: `${demandeur.prenom} a demandé le badge cuisinier`,
        lien: "/admin/badges",
      }),
      envoyerEmailNouvelleDemandeBadge({ to: admin.email, prenomDemandeur: demandeur.prenom }),
    ])
  );

  return NextResponse.json({ ok: true });
}
