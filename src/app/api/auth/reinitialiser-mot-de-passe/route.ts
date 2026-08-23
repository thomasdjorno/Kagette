import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "8 caractères minimum"),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;

  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } });
  if (!verificationToken || verificationToken.expires < new Date()) {
    return NextResponse.json(
      { error: "Ce lien de réinitialisation est invalide ou a expiré" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email: verificationToken.identifier } });
  if (!user) {
    return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } }),
    prisma.verificationToken.deleteMany({ where: { identifier: verificationToken.identifier } }),
  ]);

  return NextResponse.json({ ok: true });
}
