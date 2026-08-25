import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, libellesCategorie } from "@/lib/format";
import { genererQrCodeDataUrl } from "@/lib/qrcode";
import { ImprimerButton } from "@/components/ui/ImprimerButton";

export default async function EtiquetteProduitPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) redirect(`/connexion?callbackUrl=/produits/${params.id}/etiquette`);

  const listing = await prisma.productListing.findUnique({
    where: { id: params.id },
    include: { cuisinier: true },
  });

  if (!listing) notFound();
  if (listing.cuisinierId !== session.user.id) {
    redirect(`/produits/${params.id}`);
  }

  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const qrCodeDataUrl = await genererQrCodeDataUrl(`${baseUrl}/produits/${listing.id}`);

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="no-print flex items-center justify-between">
        <h1 className="font-serif text-xl font-bold text-kagette-prune-700">Étiquette du produit</h1>
        <ImprimerButton label="🖨️ Imprimer l'étiquette" />
      </div>

      <div className="rounded-2xl border-2 border-kagette-prune-700/20 bg-white p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-kagette-framboise-600">
              {libellesCategorie[listing.categorie] ?? listing.categorie}
            </p>
            <h2 className="font-serif text-xl font-bold text-kagette-prune-700">{listing.titre}</h2>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- QR code en data URL, next/image ne le gère pas bien */}
          <img src={qrCodeDataUrl} alt="QR code vers la fiche produit Kagette" width={80} height={80} />
        </div>

        <div className="mt-4 space-y-2 text-sm text-kagette-prune-700">
          <p>
            <span className="font-semibold">Ingrédients : </span>
            {listing.ingredients.length > 0 ? listing.ingredients.join(", ") : "non renseignés"}
          </p>
          {listing.allergenes.length > 0 && (
            <p>
              <span className="font-semibold">Allergènes : </span>
              <strong>{listing.allergenes.join(", ")}</strong>
            </p>
          )}
          <p>
            <span className="font-semibold">À consommer de préférence avant le : </span>
            {formatDate(listing.dluo)}
          </p>
          <p>
            <span className="font-semibold">Fait par : </span>
            {listing.cuisinier.prenom} {listing.cuisinier.nom}
          </p>
          <p className="text-xs text-kagette-prune-700/60">
            Produit artisanal, préparé par un particulier via Kagette (Mensignac et alentours).
          </p>
        </div>
      </div>

      <p className="no-print text-xs text-kagette-prune-700/50">
        Le QR code renvoie vers la fiche produit sur Kagette.
      </p>
    </div>
  );
}
