import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailNouveauMessage } from "@/lib/email";
import { verifierLimite } from "@/lib/rate-limit";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!verifierLimite(`message:${session.user.id}`, 30, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de messages envoyés — patiente un peu" }, { status: 429 });
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId: params.id, userId: session.user.id } },
  });
  if (!participant) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { contenu } = await request.json();
  if (typeof contenu !== "string" || contenu.trim().length === 0) {
    return NextResponse.json({ error: "Message vide" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: params.id,
      auteurId: session.user.id,
      contenu: contenu.trim().slice(0, 2000),
    },
  });

  const autresParticipants = await prisma.conversationParticipant.findMany({
    where: { conversationId: params.id, userId: { not: session.user.id } },
    include: { user: true },
  });

  const expediteurPrenom = session.user.name?.split(" ")[0] ?? "Quelqu'un";
  await Promise.all(
    autresParticipants.map((participant) =>
      envoyerEmailNouveauMessage({
        to: participant.user.email,
        prenom: participant.user.prenom,
        expediteurPrenom,
        conversationId: params.id,
      })
    )
  );

  return NextResponse.json({ message }, { status: 201 });
}
