import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reportSchema = z.object({
  fruitListingId: z.string().optional(),
  productListingId: z.string().optional(),
  motif: z.string().min(1, "Précise la raison du signalement").max(500),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { fruitListingId, productListingId, motif } = parsed.data;
  if (!fruitListingId && !productListingId) {
    return NextResponse.json({ error: "Annonce manquante" }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType: fruitListingId ? "FRUIT_LISTING" : "PRODUCT_LISTING",
      fruitListingId,
      productListingId,
      motif,
    },
  });

  return NextResponse.json({ report }, { status: 201 });
}
