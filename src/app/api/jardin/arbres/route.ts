import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { arbreSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!session.user.estDonneur) {
    return NextResponse.json(
      { error: "Active d'abord ta casquette donneur depuis ton profil" },
      { status: 403 }
    );
  }

  const parsed = arbreSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const jardin = await prisma.jardin.upsert({
    where: { proprietaireId: session.user.id },
    update: {},
    create: { proprietaireId: session.user.id },
  });

  const arbre = await prisma.arbre.create({
    data: {
      jardinId: jardin.id,
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

  return NextResponse.json({ arbre }, { status: 201 });
}
