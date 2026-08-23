import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUTS_VALIDES = ["DISPONIBLE", "RESERVE", "TERMINE", "ANNULE"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { statut } = await request.json();
  if (!STATUTS_VALIDES.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const listing = await prisma.fruitListing.findUnique({ where: { id: params.id } });
  if (!listing || listing.donneurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const updated = await prisma.fruitListing.update({
    where: { id: params.id },
    data: { statut },
  });

  return NextResponse.json({ listing: updated });
}
