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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hygieneBadgeStatus: true },
    });
    const enAttente = user?.hygieneBadgeStatus === "EN_ATTENTE";

    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-lg font-serif font-bold text-kagette-prune-700">
            Badge hygiène requis
          </h1>
          <p className="mt-2 text-sm text-kagette-prune-700/70">
            {enAttente
              ? "Ta demande de badge hygiène est en cours d'examen par un admin, tu pourras publier dès qu'elle sera validée."
              : "Pour vendre des produits transformés, ton badge hygiène doit d'abord être validé par un admin — c'est la seule condition, aucune autre démarche préalable."}
          </p>
          <Link href="/profil/badge-cuisinier" className="mt-4 inline-block">
            <Button>{enAttente ? "Voir ma demande" : "Demander le badge hygiène"}</Button>
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
