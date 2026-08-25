"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ListingPhoto } from "@/components/listings/ListingPhoto";
import { formatPrix } from "@/lib/format";
import { useCart } from "@/lib/CartContext";

export function PanierClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { items, modifierQuantite, retirer, total } = useCart();
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function passerCommande() {
    setErreur(null);
    setChargement(true);

    const res = await fetch("/api/stripe/checkout-panier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productListingId: i.productListingId, quantite: i.quantite })),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      setChargement(false);
      return;
    }

    window.location.href = data.url;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-4xl">🧺</p>
        <h1 className="mt-2 font-serif text-2xl font-bold text-kagette-prune-700">
          Ton panier est vide
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/60">
          Parcours les produits transformés par nos cuisiniers locaux et ajoute-les à ton panier.
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button>Voir les produits</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mon panier</h1>

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.productListingId} className="flex items-center gap-4">
            <ListingPhoto
              photoUrl={item.photoUrl}
              emoji="🍯"
              alt={item.titre}
              className="h-16 w-16 shrink-0 rounded-xl"
            />
            <div className="flex-1">
              <Link
                href={`/produits/${item.productListingId}`}
                className="font-semibold text-kagette-prune-700 hover:underline"
              >
                {item.titre}
              </Link>
              <p className="text-xs text-kagette-prune-700/50">Par {item.cuisinierPrenom}</p>
              <p className="mt-1 text-sm font-medium text-kagette-framboise-600">
                {formatPrix(item.prix)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => modifierQuantite(item.productListingId, item.quantite - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-kagette-prune-700/5 text-kagette-prune-700 hover:bg-kagette-prune-700/10"
                aria-label="Diminuer la quantité"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-medium text-kagette-prune-700">
                {item.quantite}
              </span>
              <button
                type="button"
                onClick={() => modifierQuantite(item.productListingId, item.quantite + 1)}
                disabled={item.quantite >= item.quantiteDisponible}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-kagette-prune-700/5 text-kagette-prune-700 hover:bg-kagette-prune-700/10 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => retirer(item.productListingId)}
              className="ml-2 text-xs font-medium text-kagette-framboise-600 hover:underline"
            >
              Retirer
            </button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex justify-between text-sm">
          <span className="text-kagette-prune-700/70">Total</span>
          <span className="text-lg font-semibold text-kagette-framboise-600">{formatPrix(total)}</span>
        </div>

        {!isAuthenticated ? (
          <Link href="/connexion?callbackUrl=/panier" className="mt-4 block">
            <Button className="w-full">Se connecter pour payer</Button>
          </Link>
        ) : (
          <Button onClick={passerCommande} disabled={chargement} className="mt-4 w-full">
            {chargement ? "Redirection vers le paiement..." : "Passer la commande"}
          </Button>
        )}
        {erreur && <p className="mt-2 text-sm text-kagette-framboise-600">{erreur}</p>}
      </Card>
    </div>
  );
}
