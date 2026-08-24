import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProductListingForm } from "./ProductListingForm";

export default async function NouvelleAnnonceProduitPage({
  searchParams,
}: {
  searchParams: { fruitListingId?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/produits/nouveau");

  if (!session.user.estCuisinier) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-lg font-serif font-bold text-kagette-prune-700">
            Casquette cuisinier non active
          </h1>
          <p className="mt-2 text-sm text-kagette-prune-700/70">
            Il faut que ton badge hygiène soit validé par un admin pour publier un produit
            transformé. Fais ta demande depuis ton profil si ce n&apos;est pas déjà fait.
          </p>
          <Link href="/profil" className="mt-4 inline-block">
            <Button>Aller à mon profil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const [regionsActives, fruitListings, demandesAcceptees, splitConfig] = await Promise.all([
    prisma.region.findMany({ where: { isActive: true } }),
    prisma.fruitListing.findMany({
      where: { region: { isActive: true }, statut: { not: "ANNULE" } },
      include: { donneur: { select: { prenom: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.fruitRequest.findMany({
      where: { demandeurId: session.user.id, statut: "ACCEPTEE" },
      include: { fruitListing: { include: { donneur: { select: { prenom: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.splitConfig.findFirst({ where: { actif: true } }),
  ]);

  const fruitListingsPrioritaires = Array.from(
    new Map(demandesAcceptees.map((d) => [d.fruitListing.id, d.fruitListing])).values()
  );
  const idsPrioritaires = new Set(fruitListingsPrioritaires.map((f) => f.id));
  const fruitListingsRestants = fruitListings.filter((f) => !idsPrioritaires.has(f.id));

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
          Publier un produit transformé
        </h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Confiture, sirop, chutney ou fruits secs, indique d&apos;où viennent tes fruits pour
          mettre en avant leur provenance.
        </p>
        <ProductListingForm
          regions={regionsActives}
          fruitListings={fruitListingsRestants}
          fruitListingsPrioritaires={fruitListingsPrioritaires}
          fruitListingIdPreselectionne={searchParams.fruitListingId}
          splitConfig={
            splitConfig
              ? {
                  donneurPercent: Number(splitConfig.donneurPercent),
                  cuisinierPercent: Number(splitConfig.cuisinierPercent),
                  commissionPercent: Number(splitConfig.commissionPercent),
                }
              : null
          }
        />
      </Card>
    </div>
  );
}
