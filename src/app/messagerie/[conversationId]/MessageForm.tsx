"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

export function MessageForm({ conversationId }: { conversationId: string }) {
  const router = useRouter();
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contenu.trim()) return;
    setErreur(null);
    setEnvoi(true);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenu }),
    });

    setEnvoi(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }

    setContenu("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows={2}
        placeholder="Écris ton message..."
        className="flex-1"
      />
      <Button type="submit" disabled={envoi}>
        Envoyer
      </Button>
      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
    </form>
  );
}
