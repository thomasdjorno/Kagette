import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateConversation } from "@/lib/conversations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { fruitListingId, productListingId, orderId } = await request.json();
  const currentUserId = session.user.id;
  let otherUserId: string;

  if (fruitListingId) {
    const fruit = await prisma.fruitListing.findUnique({ where: { id: fruitListingId } });
    if (!fruit) return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
    if (fruit.donneurId === currentUserId) {
      return NextResponse.json({ error: "C'est ta propre annonce" }, { status: 400 });
    }
    otherUserId = fruit.donneurId;
  } else if (productListingId) {
    const produit = await prisma.productListing.findUnique({ where: { id: productListingId } });
    if (!produit) return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
    if (produit.cuisinierId === currentUserId) {
      return NextResponse.json({ error: "C'est ta propre annonce" }, { status: 400 });
    }
    otherUserId = produit.cuisinierId;
  } else if (orderId) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { productListing: true },
    });
    if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    if (order.acheteurId !== currentUserId && order.productListing.cuisinierId !== currentUserId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }
    otherUserId =
      order.acheteurId === currentUserId ? order.productListing.cuisinierId : order.acheteurId;
  } else {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const conversation = await getOrCreateConversation({
    currentUserId,
    otherUserId,
    fruitListingId,
    productListingId,
    orderId,
  });

  return NextResponse.json({ conversationId: conversation.id });
}
