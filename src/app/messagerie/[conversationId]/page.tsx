import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { clsx } from "@/lib/clsx";
import { MessageForm } from "./MessageForm";

export default async function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  const session = await auth();
  if (!session?.user) redirect(`/connexion?callbackUrl=/messagerie/${params.conversationId}`);

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    include: {
      participants: { include: { user: { select: { id: true, prenom: true, nom: true } } } },
      messages: { orderBy: { createdAt: "asc" }, include: { auteur: { select: { prenom: true } } } },
      fruitListing: { select: { id: true, variete: true } },
      productListing: { select: { id: true, titre: true } },
    },
  });

  if (!conversation) notFound();

  const estParticipant = conversation.participants.some((p) => p.user.id === session.user.id);
  if (!estParticipant) notFound();

  const autre = conversation.participants.find((p) => p.user.id !== session.user.id)?.user;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <Link href="/messagerie" className="text-sm text-kagette-prune-700/50 hover:underline">
          ← Toutes les conversations
        </Link>
        <h1 className="mt-1 text-xl font-serif font-bold text-kagette-prune-700">
          {autre ? `${autre.prenom} ${autre.nom.charAt(0)}.` : "Conversation"}
        </h1>
        {conversation.fruitListing && (
          <Link
            href={`/fruits/${conversation.fruitListing.id}`}
            className="text-sm text-kagette-feuille-600 hover:underline"
          >
            à propos de : {conversation.fruitListing.variete}
          </Link>
        )}
        {conversation.productListing && (
          <Link
            href={`/produits/${conversation.productListing.id}`}
            className="text-sm text-kagette-framboise-600 hover:underline"
          >
            à propos de : {conversation.productListing.titre}
          </Link>
        )}
      </div>

      <Card className="space-y-3">
        {conversation.messages.length === 0 ? (
          <p className="text-sm text-kagette-prune-700/50">
            Aucun message pour l&apos;instant, lance la discussion pour organiser le retrait.
          </p>
        ) : (
          conversation.messages.map((message) => {
            const estMoi = message.auteurId === session.user.id;
            return (
              <div
                key={message.id}
                className={clsx("flex", estMoi ? "justify-end" : "justify-start")}
              >
                <div
                  className={clsx(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                    estMoi
                      ? "bg-kagette-framboise-500 text-white"
                      : "bg-kagette-feuille-50 text-kagette-prune-700"
                  )}
                >
                  <p>{message.contenu}</p>
                </div>
              </div>
            );
          })
        )}
      </Card>

      <MessageForm conversationId={conversation.id} />
    </div>
  );
}
