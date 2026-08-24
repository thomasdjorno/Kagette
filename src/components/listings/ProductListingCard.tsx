import Link from "next/link";
import { ListingPhoto } from "./ListingPhoto";
import { formatPrix, libellesCategorie, emojiCategorie, formatDistance } from "@/lib/format";

interface ProductListingCardProps {
  id: string;
  titre: string;
  categorie: string;
  prix: string;
  zoneRetrait: string;
  cuisinierPrenom: string;
  donneurOriginePrenom: string | null;
  photoUrl?: string | null;
  distanceKm?: number | null;
}

export function ProductListingCard({
  id,
  titre,
  categorie,
  prix,
  zoneRetrait,
  cuisinierPrenom,
  donneurOriginePrenom,
  photoUrl,
  distanceKm,
}: ProductListingCardProps) {
  return (
    <Link
      href={`/produits/${id}`}
      className="group block overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <ListingPhoto
          photoUrl={photoUrl}
          emoji={emojiCategorie[categorie] ?? "🍯"}
          alt={titre}
          className="aspect-square w-full sm:aspect-auto sm:h-36"
        />
        <span className="absolute left-1.5 top-1.5 rounded-full bg-kagette-framboise-500 px-1.5 py-0.5 text-[9px] font-bold text-white sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
          {libellesCategorie[categorie] ?? categorie}
        </span>
      </div>
      <div className="p-1.5 sm:p-4">
        <h3 className="line-clamp-1 font-serif text-xs font-bold text-kagette-prune-700 sm:text-base">{titre}</h3>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-kagette-prune-700/60 sm:mt-1 sm:text-sm">
          {zoneRetrait}
          {typeof distanceKm === "number" && ` · ${formatDistance(distanceKm)}`}
        </p>
        {donneurOriginePrenom && (
          <p className="mt-0.5 hidden text-xs italic text-kagette-mangue-600 sm:block">
            Fait avec les fruits de {donneurOriginePrenom}
          </p>
        )}
        <div className="mt-1 flex flex-col items-start gap-1 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[10px] text-kagette-prune-700/70 sm:text-sm">Par {cuisinierPrenom}</span>
          <span className="rounded-full bg-kagette-framboise-50 px-1.5 py-0.5 text-[10px] font-bold text-kagette-framboise-600 sm:px-3 sm:py-1 sm:text-sm">
            {formatPrix(prix)}
          </span>
        </div>
      </div>
    </Link>
  );
}
