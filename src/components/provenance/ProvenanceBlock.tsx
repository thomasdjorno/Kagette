import Link from "next/link";
import { PhotoPlaceholder } from "@/components/listings/PhotoPlaceholder";

export function ProvenanceBlock({
  donneurId,
  donneurPrenom,
  variete,
  zoneRetrait,
  fruitListingId,
}: {
  donneurId: string;
  donneurPrenom: string;
  variete: string;
  zoneRetrait: string;
  fruitListingId: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-kagette-mangue-300/60 bg-kagette-mangue-50">
      <div className="flex items-center gap-4 p-5">
        <PhotoPlaceholder emoji="🌳" className="h-20 w-20 shrink-0 rounded-lg" />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-kagette-mangue-600">
            Origine
          </p>
          <p className="mt-1 font-serif text-lg font-bold text-kagette-prune-700">
            Fait avec les {variete.toLowerCase()} de{" "}
            <Link href={`/profil/${donneurId}`} className="underline decoration-dotted">
              {donneurPrenom}
            </Link>
          </p>
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
