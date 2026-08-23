import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function MessagerieListePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/messagerie");

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId: session.user.id } } },
    include: {
      participants: { include: { user: { select: { id: true, prenom: true, nom: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      fruitListing: { select: { variete: true } },
      productListing: { select: { titre: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  conversations.sort((a, b) => {
    const dateA = a.messages[0]?.createdAt ?? a.createdAt;
    const dateB = b.messages[0]?.createdAt ?? b.createdAt;
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-serif font-bold text-kagette-prune-700">Messagerie</h1>

      {conversations.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">
          Aucune conversation pour le moment — contacte un donneur ou un cuisinier depuis une
          fiche annonce.
        </p>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            const autre = conversation.participants.find((p) => p.user.id !== session.user.id)?.user;
            const dernierMessage = conversation.messages[0];
            const sujet =
              conversation.fruitListing?.variete ??
              conversation.productListing?.titre ??
              "Commande";

            return (
              <Link key={conversation.id} href={`/messagerie/${conversation.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-kagette-prune-700">
                        {autre ? `${autre.prenom} ${autre.nom.charAt(0)}.` : "Utilisateur"}
                      </p>
                      <p className="text-xs text-kagette-prune-700/50">{sujet}</p>
                    </div>
                  </div>
                  {dernierMessage && (
                    <p className="mt-2 truncate text-sm text-kagette-prune-700/70">
                      {dernierMessage.contenu}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
