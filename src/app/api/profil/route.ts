import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { modifierProfilSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = modifierProfilSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { prenom, nom, telephone, photoUrl } = parsed.data;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(prenom !== undefined && { prenom }),
      ...(nom !== undefined && { nom }),
      ...(telephone !== undefined && { telephone: telephone || null }),
      ...(photoUrl !== undefined && { photoUrl: photoUrl || null }),
    },
  });

  return NextResponse.json({ user });
}
