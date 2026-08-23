"use client";

import dynamic from "next/dynamic";
import type { FruitMapMarker, ProductMapMarker } from "./MapView";

const MapView = dynamic(() => import("./MapView").then((mod) => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-2xl border border-kagette-prune-700/10 bg-white text-sm text-kagette-prune-700/50 sm:h-96">
      Chargement de la carte...
    </div>
  ),
});

export function HomeMapSection({
  region,
  fruits,
  produits,
}: {
  region: { nom: string; latitude: number; longitude: number; rayonKm: number };
  fruits: FruitMapMarker[];
  produits: ProductMapMarker[];
}) {
  return <MapView region={region} fruits={fruits} produits={produits} />;
}
