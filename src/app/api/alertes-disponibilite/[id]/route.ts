import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const alerte = await prisma.alerteDisponibilite.findUnique({ where: { id: params.id } });
  if (!alerte || alerte.userId !== session.user.id) {
    return NextResponse.json({ error: "Alerte introuvable" }, { status: 404 });
  }

  await prisma.alerteDisponibilite.delete({ where: { id: params.id } });

  return NextResponse.json({ ok: true });
}
