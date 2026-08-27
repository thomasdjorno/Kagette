import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { alerteDisponibiliteSchema } from "@/lib/validation";
import { verifierLimite } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!verifierLimite(`alerte-dispo:${session.user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop d'alertes créées, réessaie plus tard" }, { status: 429 });
  }

  const parsed = alerteDisponibiliteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { critere, categorie } = parsed.data;

  const alerte = await prisma.alerteDisponibilite.create({
    data: {
      userId: session.user.id,
      critere: critere || null,
      categorie: categorie || null,
    },
  });

  return NextResponse.json({ alerte }, { status: 201 });
}
