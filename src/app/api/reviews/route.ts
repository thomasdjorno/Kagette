import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  orderId: z.string().min(1),
  note: z.coerce.number().int().min(1).max(5),
  commentaire: z.string().max(1000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = reviewSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const { orderId, note, commentaire } = parsed.data;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { productListing: true },
  });

  if (!order || order.acheteurId !== session.user.id) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }
  if (order.statut !== "RECUPEREE") {
    return NextResponse.json(
      { error: "L'avis n'est possible qu'une fois la commande récupérée" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        orderId,
        auteurId: session.user.id,
        cibleId: order.productListing.cuisinierId,
        note,
        commentaire: commentaire || null,
      },
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Tu as déjà laissé un avis pour cette commande" }, { status: 409 });
  }
}
