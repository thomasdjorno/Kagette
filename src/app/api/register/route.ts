import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { inscriptionSchema } from "@/lib/validation";
import { verifierLimite, ipDepuisRequete } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!verifierLimite(`register:${ipDepuisRequete(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de tentatives d'inscription, réessaie plus tard" },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = inscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { prenom, nom, email, password } = parsed.data;

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    return NextResponse.json(
      { error: "Un compte existe déjà avec cet email" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { prenom, nom, email, password: passwordHash },
    select: { id: true, email: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
