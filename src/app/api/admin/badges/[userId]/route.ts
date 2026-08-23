import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailBadgeHygiene } from "@/lib/email";

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  const session = await auth();
  if (!session?.user?.estAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { decision } = await request.json();
  if (decision !== "VALIDE" && decision !== "REFUSE") {
    return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.userId },
    data: {
      hygieneBadgeStatus: decision,
      hygieneBadgeValideParId: session.user.id,
      hygieneBadgeValideLe: new Date(),
      estCuisinier: decision === "VALIDE" ? true : false,
    },
  });

  await envoyerEmailBadgeHygiene({
    to: user.email,
    prenom: user.prenom,
    valide: decision === "VALIDE",
  });

  return NextResponse.json({ user });
}
