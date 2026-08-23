"use client";

import { useState } from "react";
import { clsx } from "@/lib/clsx";

const tailles = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
};

export function Avatar({
  photoUrl,
  prenom,
  nom,
  size = "md",
  className,
}: {
  photoUrl?: string | null;
  prenom: string;
  nom?: string;
  size?: keyof typeof tailles;
  className?: string;
}) {
  const [enErreur, setEnErreur] = useState(false);
  const initiales = `${prenom.charAt(0)}${nom?.charAt(0) ?? ""}`.toUpperCase();

  if (photoUrl && !enErreur) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- domaine de la photo variable (R2, avatar Google...), on gère l'échec nous-mêmes plutôt que de dépendre de next.config.js
      <img
        src={photoUrl}
        alt={prenom}
        onError={() => setEnErreur(true)}
        className={clsx("shrink-0 rounded-full object-cover", tailles[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full bg-kagette-feuille-500 font-bold text-white",
        tailles[size],
        className
      )}
    >
      {initiales}
    </div>
  );
}
