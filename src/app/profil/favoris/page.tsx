import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { FollowButton } from "@/components/profil/FollowButton";

export default async function FavorisPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/favoris");

  const suivis = await prisma.follow.findMany({
    where: { suiveurId: session.user.id },
    include: { suivi: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mes favoris</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Les personnes que tu suis, leurs nouvelles annonces apparaissent en priorité sur l&apos;accueil.
        </p>
      </div>

      {suivis.length === 0 ? (
        <p className="text-sm text-kagette-prune-700/60">
          Tu ne suis personne pour l&apos;instant. Va sur le profil d&apos;un donneur ou d&apos;un
          cuisinier pour le suivre.
        </p>
      ) : (
        <div className="space-y-3">
          {suivis.map(({ suivi }) => (
            <Card key={suivi.id} className="flex items-center justify-between gap-4">
              <Link
                href={`/profil/${suivi.id}`}
                className="font-semibold text-kagette-prune-700 hover:underline"
              >
                {suivi.prenom} {suivi.nom.charAt(0)}.
              </Link>
              <FollowButton userId={suivi.id} suiviAuDepart={true} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
