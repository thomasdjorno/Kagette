"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Region, FruitListing } from "@prisma/client";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PhotoUploader } from "@/components/listings/PhotoUploader";
import { productCategories } from "@/lib/validation";
import { libellesCategorie } from "@/lib/format";

type FruitListingAvecDonneur = FruitListing & { donneur: { prenom: string } };

export function ProductListingForm({
  regions,
  fruitListings,
}: {
  regions: Region[];
  fruitListings: FruitListingAvecDonneur[];
}) {
  const router = useRouter();
  const regionParDefaut = regions[0];
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [allergenesTexte, setAllergenesTexte] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const allergenes = allergenesTexte
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const payload = {
      titre: formData.get("titre"),
      categorie: formData.get("categorie"),
      description: formData.get("description"),
      allergenes,
      dluo: formData.get("dluo"),
      prix: formData.get("prix"),
      quantiteDisponible: formData.get("quantiteDisponible"),
      zoneRetrait: formData.get("zoneRetrait"),
      latitude: formData.get("latitude"),
      longitude: formData.get("longitude"),
      regionId: formData.get("regionId"),
      fruitListingOrigineId: formData.get("fruitListingOrigineId") || undefined,
      photoUrls,
    };

    const res = await fetch("/api/product-listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setChargement(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    const { listing } = await res.json();
    router.push(`/produits/${listing.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        📖 Pas sûr de la DLUO à indiquer, des allergènes à signaler ou de la bonne façon de
        stériliser tes bocaux ?{" "}
        <Link href="/guide" target="_blank" className="font-medium underline">
          Consulte le guide du Kagetteur →
        </Link>
      </div>

      <div>
        <Label htmlFor="titre">Titre</Label>
        <Input id="titre" name="titre" placeholder="Ex : Confiture de pommes reinette" required />
      </div>

      <div>
        <Label htmlFor="categorie">Catégorie</Label>
        <select
          id="categorie"
          name="categorie"
          required
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
        >
          {productCategories.map((cat) => (
            <option key={cat} value={cat}>
              {libellesCategorie[cat]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="fruitListingOrigineId">Fruits d&apos;origine (traçabilité)</Label>
        <select
          id="fruitListingOrigineId"
          name="fruitListingOrigineId"
          className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
          defaultValue=""
        >
          <option value="">Non renseigné</option>
          {fruitListings.map((fruit) => (
            <option key={fruit.id} value={fruit.id}>
              {fruit.variete} — chez {fruit.donneur.prenom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} required />
      </div>

      <div>
        <Label htmlFor="allergenes">Allergènes (séparés par des virgules)</Label>
        <Input
          id="allergenes"
          placeholder="Ex : fruits à coque, sulfites"
          value={allergenesTexte}
          onChange={(e) => setAllergenesTexte(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="dluo">DLUO (date limite d&apos;utilisation optimale)</Label>
        <Input id="dluo" name="dluo" type="date" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="prix">Prix (€)</Label>
          <Input id="prix" name="prix" type="number" min="0.5" step="0.1" required />
        </div>
        <div>
          <Label htmlFor="quantiteDisponible">Quantité disponible</Label>
          <Input id="quantiteDisponible" name="quantiteDisponible" type="number" min="0" required />
        </div>
      </div>

      <div>
        <Label htmlFor="zoneRetrait">Lieu de retrait</Label>
        <Input
          id="zoneRetrait"
          name="zoneRetrait"
          placeholder="Ex : Mensignac, marché du samedi"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="latitude">Latitude approx.</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="0.0001"
            defaultValue={regionParDefaut?.latitude}
            required
          />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude approx.</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="0.0001"
            defaultValue={regionParDefaut?.longitude}
            required
          />
        </div>
      </div>

      {regions.length > 1 ? (
        <div>
          <Label htmlFor="regionId">Région</Label>
          <select
            id="regionId"
            name="regionId"
            className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm"
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.nom}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <input type="hidden" name="regionId" value={regionParDefaut?.id} />
      )}

      <PhotoUploader photoUrls={photoUrls} onChange={setPhotoUrls} />

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <Button type="submit" disabled={chargement} className="w-full">
        {chargement ? "Publication..." : "Publier le produit"}
      </Button>
    </form>
  );
}
