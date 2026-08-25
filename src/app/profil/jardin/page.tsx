import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ArbreCard } from "./ArbreCard";
import { ArbreForm } from "./ArbreForm";

export default async function MonJardinPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/jardin");

  const jardin = await prisma.jardin.findUnique({
    where: { proprietaireId: session.user.id },
    include: { arbres: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mon jardin</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Une fiche par arbre : variété, saison, quantité, et si les fruits sont déjà récoltés ou
          à venir cueillir. Utile pour préparer tes prochaines annonces.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-kagette-prune-700">Ajouter un arbre</h2>
        <ArbreForm />
      </Card>

      <div className="space-y-3">
        {(jardin?.arbres.length ?? 0) === 0 ? (
          <p className="text-sm text-kagette-prune-700/60">
            Aucun arbre pour l&apos;instant, ajoute le premier ci-dessus.
          </p>
        ) : (
          jardin!.arbres.map((arbre) => <ArbreCard key={arbre.id} arbre={arbre} />)
        )}
      </div>
    </div>
  );
}
