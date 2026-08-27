"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/profil";
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setChargement(true);

    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setChargement(false);

    if (res?.error) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}

        <Button type="submit" disabled={chargement} className="w-full">
          {chargement ? "Connexion..." : "Se connecter"}
        </Button>

        <Link
          href="/mot-de-passe-oublie"
          className="block text-center text-sm text-kagette-prune-700/60 hover:underline"
        >
          Mot de passe oublié ?
        </Link>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs text-kagette-prune-700/50">
        <div className="h-px flex-1 bg-kagette-prune-700/10" />
        ou
        <div className="h-px flex-1 bg-kagette-prune-700/10" />
      </div>

      <Button
        variant="ghost"
        className="mt-4 w-full"
        onClick={() => signIn("google", { callbackUrl })}
      >
        Continuer avec Google
      </Button>

      <p className="mt-4 text-center text-sm text-kagette-prune-700/60">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-medium text-kagette-framboise-600 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </>
  );
}
