import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creerNotification } from "@/lib/notifications";
import { verifierLimite } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!verifierLimite(`participer-recolte:${session.user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives, réessaie plus tard" }, { status: 429 });
  }

  const recolte = await prisma.recolteCollective.findUnique({
    where: { id: params.id },
    include: { fruitListing: { include: { donneur: true } }, participants: true },
  });
  if (!recolte) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  if (recolte.fruitListing.donneurId === session.user.id) {
    return NextResponse.json({ error: "C'est ta propre cueillette" }, { status: 400 });
  }
  if (recolte.participants.some((p) => p.participantId === session.user.id)) {
    return NextResponse.json({ error: "Tu participes déjà" }, { status: 400 });
  }
  if (recolte.placesMax && recolte.participants.length >= recolte.placesMax) {
    return NextResponse.json({ error: "Complet" }, { status: 400 });
  }

  await prisma.participationRecolte.create({
    data: { recolteCollectiveId: params.id, participantId: session.user.id },
  });

  await creerNotification({
    userId: recolte.fruitListing.donneurId,
    message: `${session.user.name?.split(" ")[0] ?? "Quelqu'un"} vient à ta cueillette collective`,
    lien: `/fruits/${recolte.fruitListingId}`,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await prisma.participationRecolte.deleteMany({
    where: { recolteCollectiveId: params.id, participantId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
