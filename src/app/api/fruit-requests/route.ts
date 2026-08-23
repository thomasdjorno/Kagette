import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fruitRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = fruitRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { fruitListingId, quantiteDemandeeKg, raison, message } = parsed.data;

  const listing = await prisma.fruitListing.findUnique({
    where: { id: fruitListingId },
    include: { demandes: { where: { statut: "ACCEPTEE" } } },
  });

  if (!listing || listing.statut !== "DISPONIBLE") {
    return NextResponse.json({ error: "Cette annonce n'est plus disponible" }, { status: 400 });
  }
  if (listing.donneurId === session.user.id) {
    return NextResponse.json({ error: "C'est ta propre annonce" }, { status: 400 });
  }

  const dejaAccepte = listing.demandes.reduce((total, d) => total + d.quantiteDemandeeKg, 0);
  const restant = listing.quantiteKg - dejaAccepte;

  if (quantiteDemandeeKg > restant) {
    return NextResponse.json(
      { error: `Il ne reste que ${restant} kg disponibles sur cette annonce` },
      { status: 400 }
    );
  }

  const demande = await prisma.fruitRequest.create({
    data: {
      fruitListingId,
      demandeurId: session.user.id,
      quantiteDemandeeKg,
      raison,
      message: message || null,
    },
  });

  return NextResponse.json({ demande }, { status: 201 });
}
