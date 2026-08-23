import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await prisma.follow.deleteMany({
    where: { suiveurId: session.user.id, suiviId: params.userId },
  });

  return NextResponse.json({ ok: true });
}
