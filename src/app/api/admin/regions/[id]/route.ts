import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.estAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { isActive } = await request.json();
  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "Paramètre invalide" }, { status: 400 });
  }

  const region = await prisma.region.update({
    where: { id: params.id },
    data: { isActive },
  });

  return NextResponse.json({ region });
}
