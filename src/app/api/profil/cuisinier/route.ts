import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { demandeCuisinierSchema } from "@/lib/validation";

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

  // La casquette cuisinier n'est activée qu'à la validation manuelle du badge
  // par un admin (cf. backoffice) — ici on enregistre uniquement la demande.
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      siret: siret || null,
      charteHygieneAccepteeLe: new Date(),
      hygieneBadgeStatus: "EN_ATTENTE",
    },
  });

  return NextResponse.json({ ok: true });
}
