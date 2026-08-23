import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TRANSITIONS_AUTORISEES: Record<string, string[]> = {
  PAYEE: ["PRETE_RETRAIT", "RECUPEREE"],
  PRETE_RETRAIT: ["RECUPEREE"],
};

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { statut } = await request.json();
  if (typeof statut !== "string") {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { productListing: true },
  });

  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });

  const estAcheteur = order.acheteurId === session.user.id;
  const estCuisinier = order.productListing.cuisinierId === session.user.id;
  if (!estAcheteur && !estCuisinier) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const transitionsPossibles = TRANSITIONS_AUTORISEES[order.statut] ?? [];
  if (!transitionsPossibles.includes(statut)) {
    return NextResponse.json(
      { error: `Impossible de passer de ${order.statut} à ${statut}` },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { statut: statut as "PRETE_RETRAIT" | "RECUPEREE" },
  });

  return NextResponse.json({ order: updated });
}
