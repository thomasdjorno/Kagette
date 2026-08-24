import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUTS_AUTORISES = ["OUVERTE", "COMBLEE", "ANNULEE"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { statut } = await request.json();
  if (!STATUTS_AUTORISES.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const recherche = await prisma.fruitSearchRequest.findUnique({ where: { id: params.id } });
  if (!recherche || recherche.cuisinierId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const updated = await prisma.fruitSearchRequest.update({
    where: { id: params.id },
    data: { statut },
  });

  return NextResponse.json({ recherche: updated });
}
