import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUTS_AUTORISES_PROPRIETAIRE = ["EN_VENTE", "RUPTURE", "ARCHIVE"];

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { statut } = await request.json();
  if (!STATUTS_AUTORISES_PROPRIETAIRE.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const listing = await prisma.productListing.findUnique({ where: { id: params.id } });
  if (!listing || listing.cuisinierId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (listing.statut === "SIGNALE") {
    return NextResponse.json(
      { error: "Cette annonce est en cours de modération, contacte l'équipe Kagette" },
      { status: 400 }
    );
  }

  const updated = await prisma.productListing.update({
    where: { id: params.id },
    data: { statut },
  });

  return NextResponse.json({ listing: updated });
}
