import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FruitListingForm } from "./FruitListingForm";

export default async function NouvelleAnnonceFruitsPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/fruits/nouveau");

  if (!session.user.estDonneur) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-lg font-serif font-bold text-kagette-prune-700">
            Active ta casquette donneur
          </h1>
          <p className="mt-2 text-sm text-kagette-prune-700/70">
            Pour proposer des fruits, active d&apos;abord la casquette donneur depuis ton profil.
          </p>
          <Link href="/profil" className="mt-4 inline-block">
            <Button>Aller à mon profil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const [regionsActives, jardin] = await Promise.all([
    prisma.region.findMany({ where: { isActive: true } }),
    prisma.jardin.findUnique({
      where: { proprietaireId: session.user.id },
      include: { arbres: { orderBy: { createdAt: "desc" } } },
    }),
  ]);

  if (regionsActives.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <p className="text-sm text-kagette-prune-700/70">
            Aucune région n&apos;est active pour le moment, impossible de publier une annonce.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <h1 className="text-xl font-serif font-bold text-kagette-prune-700">
          Proposer des fruits disponibles
        </h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          En don ou avec une participation libre — c&apos;est toi qui choisis.
        </p>
        <FruitListingForm regions={regionsActives} arbres={jardin?.arbres ?? []} />
      </Card>
    </div>
  );
}
