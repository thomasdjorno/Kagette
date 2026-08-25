"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  productListingId: string;
  titre: string;
  prix: number;
  photoUrl: string | null;
  cuisinierPrenom: string;
  quantiteDisponible: number;
  quantite: number;
}

interface CartContextValue {
  items: CartItem[];
  ajouter: (item: Omit<CartItem, "quantite">, quantite?: number) => void;
  modifierQuantite: (productListingId: string, quantite: number) => void;
  retirer: (productListingId: string) => void;
  vider: () => void;
  nombreArticles: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kagette-panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    try {
      const brut = localStorage.getItem(STORAGE_KEY);
      if (brut) setItems(JSON.parse(brut));
    } catch {
      // Panier illisible, on repart d'un panier vide
    }
    setCharge(true);
  }, []);

  useEffect(() => {
    if (charge) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, charge]);

  const value = useMemo<CartContextValue>(() => {
    const ajouter: CartContextValue["ajouter"] = (item, quantite = 1) => {
      setItems((prev) => {
        const existant = prev.find((i) => i.productListingId === item.productListingId);
        if (existant) {
          const nouvelleQuantite = Math.min(
            existant.quantite + quantite,
            existant.quantiteDisponible
          );
          return prev.map((i) =>
            i.productListingId === item.productListingId ? { ...i, quantite: nouvelleQuantite } : i
          );
        }
        return [...prev, { ...item, quantite: Math.min(quantite, item.quantiteDisponible) }];
      });
    };

    const modifierQuantite: CartContextValue["modifierQuantite"] = (productListingId, quantite) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.productListingId === productListingId
              ? { ...i, quantite: Math.max(1, Math.min(quantite, i.quantiteDisponible)) }
              : i
          )
          .filter((i) => i.quantite > 0)
      );
    };

    const retirer: CartContextValue["retirer"] = (productListingId) => {
      setItems((prev) => prev.filter((i) => i.productListingId !== productListingId));
    };

    const vider = () => setItems([]);

    const nombreArticles = items.reduce((somme, i) => somme + i.quantite, 0);
    const total = items.reduce((somme, i) => somme + i.prix * i.quantite, 0);

    return { items, ajouter, modifierQuantite, retirer, vider, nombreArticles, total };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
