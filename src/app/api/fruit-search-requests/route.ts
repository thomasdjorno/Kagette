import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fruitSearchRequestSchema } from "@/lib/validation";
import { verifierLimite } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!verifierLimite(`fruit-search:${session.user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de recherches publiées, réessaie plus tard" }, { status: 429 });
  }

  const parsed = fruitSearchRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { variete, quantiteSouhaiteeKg, message, regionId } = parsed.data;

  const region = await prisma.region.findUnique({ where: { id: regionId } });
  if (!region?.isActive) {
    return NextResponse.json({ error: "Région introuvable ou inactive" }, { status: 400 });
  }

  const recherche = await prisma.fruitSearchRequest.create({
    data: {
      cuisinierId: session.user.id,
      variete,
      quantiteSouhaiteeKg,
      message: message || null,
      regionId,
    },
  });

  return NextResponse.json({ recherche }, { status: 201 });
}
