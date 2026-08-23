"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export function MotDePasseOublieForm() {
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChargement(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/mot-de-passe-oublie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email") }),
    });
    const data = await res.json().catch(() => null);

    setChargement(false);
    setMessage(
      data?.message ?? data?.error ?? "Si un compte existe avec cet email, un lien vient d'être envoyé."
    );
  }

  if (message) {
    return <p className="mt-6 text-sm text-kagette-prune-700/80">{message}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <Button type="submit" disabled={chargement} className="w-full">
        {chargement ? "Envoi..." : "Envoyer le lien de réinitialisation"}
      </Button>
    </form>
  );
}
