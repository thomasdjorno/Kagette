import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { envoyerEmailReinitialisationMotDePasse } from "@/lib/email";
import { verifierLimite, ipDepuisRequete } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  if (!verifierLimite(`mdp-oublie:${ipDepuisRequete(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Trop de demandes — réessaie plus tard" },
      { status: 429 }
    );
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const { email } = parsed.data;

  // Toujours répondre pareil, que le compte existe ou non, pour ne pas
  // permettre de deviner quels emails sont inscrits (énumération de comptes).
  const message = {
    message: "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
  };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return NextResponse.json(message);
  }

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  await envoyerEmailReinitialisationMotDePasse({ to: email, prenom: user.prenom, token });

  return NextResponse.json(message);
}
