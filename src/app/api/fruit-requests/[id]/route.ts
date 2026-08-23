import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { decision } = await request.json();
  if (decision !== "ACCEPTEE" && decision !== "REFUSEE") {
    return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
  }

  const demande = await prisma.fruitRequest.findUnique({
    where: { id: params.id },
    include: { fruitListing: true },
  });

  if (!demande) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }
  if (demande.fruitListing.donneurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (demande.statut !== "EN_ATTENTE") {
    return NextResponse.json({ error: "Cette demande a déjà été traitée" }, { status: 400 });
  }

  const updated = await prisma.fruitRequest.update({
    where: { id: params.id },
    data: { statut: decision },
  });

  return NextResponse.json({ demande: updated });
}
