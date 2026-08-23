import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fruitRequestSchema } from "@/lib/validation";
import { envoyerEmailNouvelleDemandeFruits } from "@/lib/email";
import { verifierLimite } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!verifierLimite(`fruit-request:${session.user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de demandes envoyées, réessaie plus tard" }, { status: 429 });
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
    include: { demandes: { where: { statut: "ACCEPTEE" } }, donneur: true },
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

  await envoyerEmailNouvelleDemandeFruits({
    to: listing.donneur.email,
    prenom: listing.donneur.prenom,
    demandeurPrenom: session.user.name?.split(" ")[0] ?? "Quelqu'un",
    variete: listing.variete,
    quantiteDemandeeKg,
    fruitListingId,
  });

  return NextResponse.json({ demande }, { status: 201 });
}
