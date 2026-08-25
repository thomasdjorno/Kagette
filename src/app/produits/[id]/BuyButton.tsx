"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/CartContext";

export function BuyButton({
  productListingId,
  titre,
  prix,
  photoUrl,
  cuisinierPrenom,
  quantiteDisponible,
}: {
  productListingId: string;
  titre: string;
  prix: number;
  photoUrl: string | null;
  cuisinierPrenom: string;
  quantiteDisponible: number;
}) {
  const { ajouter } = useCart();
  const [ajoute, setAjoute] = useState(false);

  function ajouterAuPanier() {
    ajouter({ productListingId, titre, prix, photoUrl, cuisinierPrenom, quantiteDisponible });
    setAjoute(true);
  }

  if (ajoute) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-kagette-feuille-600">✓ Ajouté au panier</p>
        <Link href="/panier" className="text-sm font-medium text-kagette-framboise-600 hover:underline">
          Voir mon panier →
        </Link>
      </div>
    );
  }

  return (
    <Button onClick={ajouterAuPanier} className="w-full sm:w-auto">
      🧺 Ajouter au panier
    </Button>
  );
}
