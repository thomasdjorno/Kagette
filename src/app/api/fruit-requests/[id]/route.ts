import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creerNotification } from "@/lib/notifications";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { decision } = await request.json();
  if (decision !== "ACCEPTEE" && decision !== "REFUSEE") {
    return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
  }

  const demande = await prisma.fruitRequest.findUnique({
    where: { id: params.id },
    include: { fruitListing: true },
  });

  if (!demande) {
    return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
  }
  if (demande.fruitListing.donneurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  if (demande.statut !== "EN_ATTENTE") {
    return NextResponse.json({ error: "Cette demande a déjà été traitée" }, { status: 400 });
  }

  const updated = await prisma.fruitRequest.update({
    where: { id: params.id },
    data: { statut: decision },
  });

  await creerNotification({
    userId: demande.demandeurId,
    message:
      decision === "ACCEPTEE"
        ? `Ta demande de ${demande.quantiteDemandeeKg} kg de ${demande.fruitListing.variete} a été acceptée`
        : `Ta demande de ${demande.quantiteDemandeeKg} kg de ${demande.fruitListing.variete} a été refusée`,
    lien: `/fruits/${demande.fruitListingId}`,
  });

  return NextResponse.json({ demande: updated });
}
