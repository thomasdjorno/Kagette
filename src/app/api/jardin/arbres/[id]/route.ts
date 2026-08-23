import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { arbreSchema } from "@/lib/validation";

async function verifierProprietaire(arbreId: string, userId: string) {
  const arbre = await prisma.arbre.findUnique({
    where: { id: arbreId },
    include: { jardin: true },
  });
  if (!arbre || arbre.jardin.proprietaireId !== userId) return null;
  return arbre;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const arbre = await verifierProprietaire(params.id, session.user.id);
  if (!arbre) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const parsed = arbreSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.arbre.update({
    where: { id: params.id },
    data: {
      variete: data.variete,
      saison: data.saison,
      quantite: data.quantite,
      unite: data.unite,
      modeRecolte: data.modeRecolte,
      urgenceRecolte: data.urgenceRecolte,
      photoUrl: data.photoUrl || null,
      notes: data.notes || null,
    },
  });

  return NextResponse.json({ arbre: updated });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const arbre = await verifierProprietaire(params.id, session.user.id);
  if (!arbre) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    await prisma.arbre.delete({ where: { id: params.id } });
  } catch {
    return NextResponse.json(
      { error: "Impossible de supprimer un arbre lié à une annonce active" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
