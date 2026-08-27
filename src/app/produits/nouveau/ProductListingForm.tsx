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
import { AddressSearchInput } from "@/components/ui/AddressSearchInput";
import { productCategories } from "@/lib/validation";
import { libellesCategorie, formatPrix, calculerDluoSuggeree } from "@/lib/format";
import { calculerRepartition, type Pourcentages } from "@/lib/payment-split";

type FruitListingAvecDonneur = FruitListing & { donneur: { prenom: string } };

export function ProductListingForm({
  regions,
  fruitListings,
  fruitListingsPrioritaires = [],
  fruitListingIdPreselectionne,
  splitConfig,
}: {
  regions: Region[];
  fruitListings: FruitListingAvecDonneur[];
  fruitListingsPrioritaires?: FruitListingAvecDonneur[];
  fruitListingIdPreselectionne?: string;
  splitConfig?: Pourcentages | null;
}) {
  const router = useRouter();
  const regionParDefaut = regions[0];
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [ingredientsTexte, setIngredientsTexte] = useState("");
  const [allergenesTexte, setAllergenesTexte] = useState("");
  const [prixTexte, setPrixTexte] = useState("");
  const [categorie, setCategorie] = useState<string>(productCategories[0]);
  const [dluo, setDluo] = useState(calculerDluoSuggeree(productCategories[0]));
  const [dluoModifieeManuellement, setDluoModifieeManuellement] = useState(false);
  const [origineId, setOrigineId] = useState(fruitListingIdPreselectionne ?? "");
  const [zoneRetrait, setZoneRetrait] = useState("");
  const [latitude, setLatitude] = useState(regionParDefaut?.latitude ?? 0);
  const [longitude, setLongitude] = useState(regionParDefaut?.longitude ?? 0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);
  const mapboxConfigure = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const prixNombre = parseFloat(prixTexte.replace(",", "."));
  const repartition =
    splitConfig && Number.isFinite(prixNombre) && prixNombre > 0
      ? calculerRepartition(prixNombre, splitConfig, !!origineId)
      : null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const ingredients = ingredientsTexte
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    const allergenes = allergenesTexte
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const payload = {
      titre: formData.get("titre"),
      categorie: formData.get("categorie"),
      description: formData.get("description"),
      ingredients,
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
          value={categorie}
          onChange={(e) => {
            const nouvelleCategorie = e.target.value;
            setCategorie(nouvelleCategorie);
            if (!dluoModifieeManuellement) {
              setDluo(calculerDluoSuggeree(nouvelleCategorie));
            }
          }}
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
          value={origineId}
          onChange={(e) => setOrigineId(e.target.value)}
        >
          <option value="">Non renseigné</option>
          {fruitListingsPrioritaires.length > 0 && (
            <optgroup label="Tes demandes acceptées">
              {fruitListingsPrioritaires.map((fruit) => (
                <option key={fruit.id} value={fruit.id}>
                  {fruit.variete}, chez {fruit.donneur.prenom}
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="Toutes les annonces disponibles">
            {fruitListings.map((fruit) => (
              <option key={fruit.id} value={fruit.id}>
                {fruit.variete}, chez {fruit.donneur.prenom}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} required />
      </div>

      <div>
        <Label htmlFor="ingredients">Ingrédients (séparés par des virgules)</Label>
        <Input
          id="ingredients"
          placeholder="Ex : pommes, sucre, jus de citron"
          value={ingredientsTexte}
          onChange={(e) => setIngredientsTexte(e.target.value)}
        />
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
        <Input
          id="dluo"
          name="dluo"
          type="date"
          required
          value={dluo}
          onChange={(e) => {
            setDluo(e.target.value);
            setDluoModifieeManuellement(true);
          }}
        />
        <p className="mt-1 text-xs text-kagette-prune-700/50">
          Suggestion basée sur la catégorie, à ajuster selon ta recette (moins de sucre/vinaigre =
          conservation plus courte).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="prix">Prix (€)</Label>
          <Input
            id="prix"
            name="prix"
            type="number"
            min="0.5"
            step="0.1"
            required
            value={prixTexte}
            onChange={(e) => setPrixTexte(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quantiteDisponible">Quantité disponible</Label>
          <Input id="quantiteDisponible" name="quantiteDisponible" type="number" min="0" required />
        </div>
      </div>

      {repartition && (
        <div className="rounded-xl bg-kagette-feuille-50 p-4 text-sm">
          <p className="font-semibold text-kagette-feuille-600">
            Tu recevras {formatPrix(repartition.montantCuisinier)}
          </p>
          {origineId ? (
            <p className="mt-1 text-xs text-kagette-prune-700/60">
              Le donneur des fruits recevra {formatPrix(repartition.montantDonneur)}, Kagette{" "}
              {formatPrix(repartition.montantPlateforme)} (commission de mise en relation)
            </p>
          ) : (
            <p className="mt-1 text-xs text-kagette-prune-700/60">
              Kagette recevra {formatPrix(repartition.montantPlateforme)} (commission de mise en
              relation) — renseigne des fruits d&apos;origine pour reverser une part au donneur
            </p>
          )}
        </div>
      )}

      {mapboxConfigure ? (
        <div>
          <Label>Adresse ou commune la plus proche</Label>
          <AddressSearchInput
            onSelect={({ label, latitude, longitude }) => {
              setLatitude(latitude);
              setLongitude(longitude);
              if (!zoneRetrait) setZoneRetrait(label);
            }}
          />
          <input type="hidden" name="latitude" value={latitude} />
          <input type="hidden" name="longitude" value={longitude} />
        </div>
      ) : (
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
      )}

      <div>
        <Label htmlFor="zoneRetrait">Lieu de retrait précis</Label>
        <Input
          id="zoneRetrait"
          name="zoneRetrait"
          placeholder="Ex : Mensignac, marché du samedi"
          value={zoneRetrait}
          onChange={(e) => setZoneRetrait(e.target.value)}
          required
        />
        {mapboxConfigure && (
          <p className="mt-1 text-xs text-kagette-prune-700/50">
            Pré-rempli depuis l&apos;adresse choisie ci-dessus, précise si besoin (repère, nom de
            marché...).
          </p>
        )}
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
