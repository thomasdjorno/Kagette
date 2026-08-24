import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { ListingPhoto } from "@/components/listings/ListingPhoto";

export function ProvenanceBlock({
  donneurId,
  donneurPrenom,
  donneurNom,
  donneurPhotoUrl,
  variete,
  zoneRetrait,
  fruitListingId,
  fruitPhotoUrl,
  arbrePhotoUrl,
}: {
  donneurId: string;
  donneurPrenom: string;
  donneurNom: string;
  donneurPhotoUrl: string | null;
  variete: string;
  zoneRetrait: string;
  fruitListingId: string;
  fruitPhotoUrl?: string | null;
  arbrePhotoUrl?: string | null;
}) {
  const photoOrigine = arbrePhotoUrl || fruitPhotoUrl;

  return (
    <div className="overflow-hidden rounded-lg border border-kagette-mangue-300/60 bg-kagette-mangue-50">
      <div className="flex items-center gap-4 p-5">
        <ListingPhoto
          photoUrl={photoOrigine}
          emoji="🌳"
          alt={variete}
          className="h-20 w-20 shrink-0 rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-kagette-mangue-600">
            Origine
          </p>
          <div className="mt-1 flex items-center gap-2">
            <Avatar photoUrl={donneurPhotoUrl} prenom={donneurPrenom} nom={donneurNom} size="sm" />
            <p className="font-serif text-lg font-bold text-kagette-prune-700">
              Fait avec les {variete.toLowerCase()} de{" "}
              <Link href={`/profil/${donneurId}`} className="underline decoration-dotted">
                {donneurPrenom}
              </Link>
            </p>
          </div>
          <p className="text-sm text-kagette-prune-700/60">Récoltés à {zoneRetrait}</p>
          <Link
            href={`/fruits/${fruitListingId}`}
            className="mt-1 inline-block text-sm font-medium text-kagette-feuille-600 hover:underline"
          >
            Voir l&apos;annonce de fruits d&apos;origine →
          </Link>
        </div>
      </div>
    </div>
  );
}
