import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const recolte = await prisma.recolteCollective.findUnique({
    where: { id: params.id },
    include: { fruitListing: true },
  });
  if (!recolte) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
  if (recolte.fruitListing.donneurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.participationRecolte.deleteMany({ where: { recolteCollectiveId: params.id } }),
    prisma.recolteCollective.delete({ where: { id: params.id } }),
  ]);

  return NextResponse.json({ ok: true });
}
