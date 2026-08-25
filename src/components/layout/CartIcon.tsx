"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";

export function CartIcon() {
  const { nombreArticles } = useCart();

  return (
    <Link href="/panier" className="relative text-xl" aria-label="Mon panier">
      🧺
      {nombreArticles > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-kagette-framboise-500 px-1 text-[10px] font-semibold text-white">
          {nombreArticles}
        </span>
      )}
    </Link>
  );
}
