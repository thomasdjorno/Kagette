"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

export function OrderActions({
  orderId,
  statut,
  aDejaUnAvis,
}: {
  orderId: string;
  statut: string;
  aDejaUnAvis: boolean;
}) {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [afficherAvis, setAfficherAvis] = useState(false);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");

  async function marquerRecuperee() {
    setChargement(true);
    setErreur(null);
    const res = await fetch(`/api/orders/${orderId}/statut`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "RECUPEREE" }),
    });
    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.refresh();
  }

  async function contacter() {
    setChargement(true);
    setErreur(null);
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const data = await res.json().catch(() => null);
    setChargement(false);
    if (!res.ok) {
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    router.push(`/messagerie/${data.conversationId}`);
  }

  async function envoyerAvis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChargement(true);
    setErreur(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, note, commentaire }),
    });
    setChargement(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErreur(data?.error ?? "Une erreur est survenue");
      return;
    }
    setAfficherAvis(false);
    router.refresh();
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" onClick={contacter} disabled={chargement}>
          Contacter le cuisinier
        </Button>
        {(statut === "PAYEE" || statut === "PRETE_RETRAIT") && (
          <Button variant="secondary" onClick={marquerRecuperee} disabled={chargement}>
            Marquer comme récupérée
          </Button>
        )}
        {statut === "RECUPEREE" && !aDejaUnAvis && !afficherAvis && (
          <Button variant="secondary" onClick={() => setAfficherAvis(true)}>
            Laisser un avis
          </Button>
        )}
        {statut === "RECUPEREE" && aDejaUnAvis && (
          <span className="self-center text-xs text-kagette-prune-700/50">Avis envoyé ✓</span>
        )}
      </div>

      {afficherAvis && (
        <form onSubmit={envoyerAvis} className="space-y-2 rounded-xl bg-kagette-mangue-50 p-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((valeur) => (
              <button
                type="button"
                key={valeur}
                onClick={() => setNote(valeur)}
                className="text-2xl"
                aria-label={`${valeur} étoiles`}
              >
                {valeur <= note ? "★" : "☆"}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Ton commentaire (facultatif)"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={2}
          />
          <Button type="submit" disabled={chargement}>
            Envoyer l&apos;avis
          </Button>
        </form>
      )}

      {erreur && <p className="text-sm text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
