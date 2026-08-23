import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  }

  if (user.password) {
    const { password } = await request.json().catch(() => ({}));
    const motDePasseValide = typeof password === "string" && (await bcrypt.compare(password, user.password));
    if (!motDePasseValide) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });
    }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        email: `compte-supprime-${user.id}@kagette.invalid`,
        password: null,
        prenom: "Utilisateur",
        nom: "supprimé",
        photoUrl: null,
        telephone: null,
        siret: null,
        estDonneur: false,
        estCuisinier: false,
        hygieneBadgeStatus: "NON_DEMANDE",
        stripeAccountId: null,
        stripeOnboardingComplete: false,
        latitude: null,
        longitude: null,
      },
    }),
    prisma.fruitListing.updateMany({
      where: { donneurId: user.id, statut: { in: ["DISPONIBLE", "RESERVE"] } },
      data: { statut: "ANNULE" },
    }),
    prisma.productListing.updateMany({
      where: { cuisinierId: user.id, statut: "EN_VENTE" },
      data: { statut: "ARCHIVE" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
