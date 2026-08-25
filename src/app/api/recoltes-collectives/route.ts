import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recolteCollectiveSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = recolteCollectiveSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { fruitListingId, dateEvenement, placesMax, notes } = parsed.data;

  const listing = await prisma.fruitListing.findUnique({ where: { id: fruitListingId } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
  }
  if (listing.donneurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const existante = await prisma.recolteCollective.findUnique({ where: { fruitListingId } });
  if (existante) {
    return NextResponse.json(
      { error: "Une cueillette collective existe déjà pour cette annonce" },
      { status: 400 }
    );
  }

  const recolte = await prisma.recolteCollective.create({
    data: { fruitListingId, dateEvenement, placesMax, notes: notes || null },
  });

  return NextResponse.json({ recolte }, { status: 201 });
}
