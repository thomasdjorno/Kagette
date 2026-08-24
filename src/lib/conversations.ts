import { prisma } from "@/lib/prisma";

export async function getOrCreateConversation(params: {
  currentUserId: string;
  otherUserId: string;
  fruitListingId?: string;
  productListingId?: string;
  orderId?: string;
  fruitSearchRequestId?: string;
}) {
  const { currentUserId, otherUserId, fruitListingId, productListingId, orderId, fruitSearchRequestId } =
    params;

  const existing = await prisma.conversation.findFirst({
    where: {
      fruitListingId: fruitListingId ?? null,
      productListingId: productListingId ?? null,
      orderId: orderId ?? null,
      fruitSearchRequestId: fruitSearchRequestId ?? null,
      AND: [
        { participants: { some: { userId: currentUserId } } },
        { participants: { some: { userId: otherUserId } } },
      ],
    },
  });

  if (existing) return existing;

  return prisma.conversation.create({
    data: {
      fruitListingId,
      productListingId,
      orderId,
      fruitSearchRequestId,
      participants: {
        create: [{ userId: currentUserId }, { userId: otherUserId }],
      },
    },
  });
}
