import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { RegionToggle } from "./RegionToggle";
import { NouvelleRegionForm } from "./NouvelleRegionForm";

export default async function AdminRegionsPage() {
  const regions = await prisma.region.findMany({
    include: {
      _count: { select: { fruitListings: true, productListings: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="mb-3 font-semibold text-kagette-prune-700">Ouvrir une nouvelle région</h2>
        <NouvelleRegionForm />
      </Card>

      <div className="space-y-3">
        {regions.map((region) => (
          <Card key={region.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-kagette-prune-700">{region.nom}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    region.isActive
                      ? "bg-kagette-feuille-50 text-kagette-feuille-600"
                      : "bg-kagette-prune-700/5 text-kagette-prune-700/50"
                  }`}
                >
                  {region.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-kagette-prune-700/60">
                Centre : {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)} — rayon{" "}
                {region.rayonKm} km
              </p>
              <p className="text-xs text-kagette-prune-700/50">
                {region._count.fruitListings} annonce(s) fruits — {region._count.productListings}{" "}
                produit(s)
              </p>
            </div>
            <RegionToggle id={region.id} isActive={region.isActive} />
          </Card>
        ))}
      </div>
    </div>
  );
}
