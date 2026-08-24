import { prisma } from "@/lib/prisma";

export async function creerNotification({
  userId,
  message,
  lien,
}: {
  userId: string;
  message: string;
  lien: string;
}) {
  await prisma.notification.create({ data: { userId, message, lien } });
}
