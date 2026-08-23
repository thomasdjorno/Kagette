"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ReinitialiserMotDePasseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  if (!token) {
    return (
      <p className="mt-6 text-sm text-kagette-framboise-600">
        Lien invalide — vérifie que tu as bien copié l&apos;URL complète depuis ton email.
      </p>
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmation = formData.get("confirmation") as string;

    if (password !== confirmation) {
      setErreur("Les deux mots de passe ne correspondent pas");
      return;
    }

    setChargement(true);
    const res = await fetch("/api/auth/reinitialiser-mot-de-passe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    router.push("/connexion");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div>
        <Label htmlFor="confirmation">Confirme le mot de passe</Label>
        <Input
          id="confirmation"
          name="confirmation"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

      <Button type="submit" disabled={chargement} className="w-full">
        {chargement ? "Enregistrement..." : "Changer mon mot de passe"}
      </Button>
    </form>
  );
}
