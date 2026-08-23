import Link from "next/link";
import { ListingPhoto } from "./ListingPhoto";

interface FruitListingCardProps {
  id: string;
  variete: string;
  mode: "DON" | "PARTICIPATION_LIBRE";
  montantParticipation: string | null;
  zoneRetrait: string;
  donneurPrenom: string;
  photoUrl?: string | null;
}

export function FruitListingCard({
  id,
  variete,
  mode,
  montantParticipation,
  zoneRetrait,
  donneurPrenom,
  photoUrl,
}: FruitListingCardProps) {
  return (
    <Link
      href={`/fruits/${id}`}
      className="group block overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <ListingPhoto photoUrl={photoUrl} emoji="🍃" alt={variete} className="aspect-square w-full sm:aspect-auto sm:h-36" />
        <span className="absolute left-1.5 top-1.5 rounded-full bg-kagette-feuille-500 px-1.5 py-0.5 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          Fruits
        </span>
      </div>
      <div className="p-1.5 sm:p-4">
        <h3 className="line-clamp-1 font-serif text-xs font-bold text-kagette-prune-700 sm:text-base">{variete}</h3>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-kagette-prune-700/60 sm:mt-1 sm:text-sm">{zoneRetrait}</p>
        <div className="mt-1 flex flex-col items-start gap-1 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[10px] text-kagette-prune-700/70 sm:text-sm">Chez {donneurPrenom}</span>
          <span className="rounded-full bg-kagette-feuille-50 px-1.5 py-0.5 text-[10px] font-bold text-kagette-feuille-600 sm:px-3 sm:py-1 sm:text-sm">
            {mode === "DON" ? "Don" : `Dès ${montantParticipation}€`}
          </span>
        </div>
      </div>
    </Link>
  );
}
