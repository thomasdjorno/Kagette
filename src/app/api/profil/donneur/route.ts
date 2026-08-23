import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { actif } = await request.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { estDonneur: Boolean(actif) },
  });

  return NextResponse.json({ ok: true });
}
