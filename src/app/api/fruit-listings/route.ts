import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fruitListingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = fruitListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region?.isActive) {
    return NextResponse.json({ error: "Région introuvable ou inactive" }, { status: 400 });
  }

  let arbreId: string | null = null;
  if (data.arbreId) {
    const arbre = await prisma.arbre.findUnique({
      where: { id: data.arbreId },
      include: { jardin: true },
    });
    if (!arbre || arbre.jardin.proprietaireId !== session.user.id) {
      return NextResponse.json({ error: "Arbre introuvable" }, { status: 400 });
    }
    arbreId = arbre.id;
  }

  const [listing] = await prisma.$transaction([
    prisma.fruitListing.create({
      data: {
        donneurId: session.user.id,
        arbreId,
        variete: data.variete,
        quantiteKg: data.quantiteKg,
        quantiteEstimee: `environ ${data.quantiteKg} kg`,
        mode: data.mode,
        montantParticipation: data.mode === "PARTICIPATION_LIBRE" ? data.montantParticipation : null,
        modeRecolte: data.modeRecolte,
        description: data.description || null,
        zoneRetrait: data.zoneRetrait,
        latitude: data.latitude,
        longitude: data.longitude,
        regionId: data.regionId,
        disponibleDu: data.disponibleDu,
        disponibleAu: data.disponibleAu,
        photoUrls: data.photoUrls,
      },
    }),
    // N'importe qui peut donner des fruits, pas besoin d'activer une
    // casquette au préalable : le statut "donneur" se déduit du premier don.
    prisma.user.update({ where: { id: session.user.id }, data: { estDonneur: true } }),
  ]);

  return NextResponse.json({ listing }, { status: 201 });
}
