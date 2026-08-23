import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { userId } = await request.json();
  if (typeof userId !== "string" || !userId) {
    return NextResponse.json({ error: "Utilisateur invalide" }, { status: 400 });
  }
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Tu ne peux pas te suivre toi-même" }, { status: 400 });
  }

  const suivi = await prisma.user.findUnique({ where: { id: userId } });
  if (!suivi) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const follow = await prisma.follow.upsert({
    where: { suiveurId_suiviId: { suiveurId: session.user.id, suiviId: userId } },
    update: {},
    create: { suiveurId: session.user.id, suiviId: userId },
  });

  return NextResponse.json({ follow }, { status: 201 });
}
