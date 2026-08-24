import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailBadgeHygiene } from "@/lib/email";
import { creerNotification } from "@/lib/notifications";

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

  await Promise.all([
    envoyerEmailBadgeHygiene({
      to: user.email,
      prenom: user.prenom,
      valide: decision === "VALIDE",
    }),
    creerNotification({
      userId: user.id,
      message:
        decision === "VALIDE"
          ? "Ton badge hygiène Kagette est validé !"
          : "Ta demande de badge hygiène n'a pas été validée",
      lien: "/profil",
    }),
  ]);

  return NextResponse.json({ user });
}
