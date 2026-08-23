import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const regionSchema = z.object({
  nom: z.string().min(1),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  rayonKm: z.coerce.number().positive(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.estAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const parsed = regionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const region = await prisma.region.create({
    data: { ...parsed.data, isActive: false },
  });

  return NextResponse.json({ region }, { status: 201 });
}
