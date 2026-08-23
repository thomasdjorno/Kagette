import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const splitConfigSchema = z
  .object({
    donneurPercent: z.coerce.number().min(0).max(100),
    cuisinierPercent: z.coerce.number().min(0).max(100),
    commissionPercent: z.coerce.number().min(0).max(100),
  })
  .refine(
    (data) =>
      Math.abs(data.donneurPercent + data.cuisinierPercent + data.commissionPercent - 100) < 0.01,
    { message: "Les 3 pourcentages doivent totaliser 100%" }
  );

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.estAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const parsed = splitConfigSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const actif = await prisma.splitConfig.findFirst({ where: { actif: true } });
  if (!actif) {
    return NextResponse.json({ error: "Aucune configuration active à modifier" }, { status: 404 });
  }

  const splitConfig = await prisma.splitConfig.update({
    where: { id: actif.id },
    data: parsed.data,
  });

  return NextResponse.json({ splitConfig });
}
