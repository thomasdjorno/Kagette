"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";

export function AvatarUploader({
  photoUrl,
  prenom,
  nom,
}: {
  photoUrl: string | null;
  prenom: string;
  nom: string;
}) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [apercu, setApercu] = useState<string | null>(photoUrl);

  async function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErreur("L'image dépasse 5 Mo, choisis une image plus légère.");
      event.target.value = "";
      return;
    }

    setEnCours(true);
    setErreur(null);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErreur(data?.error ?? "Upload indisponible pour le moment");
        setEnCours(false);
        event.target.value = "";
        return;
      }

      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });

      const patchRes = await fetch("/api/profil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: publicUrl }),
      });

      if (!patchRes.ok) {
        setErreur("Impossible d'enregistrer la nouvelle photo");
        setEnCours(false);
        event.target.value = "";
        return;
      }

      setApercu(publicUrl);
      router.refresh();
    } catch {
      setErreur("Échec de l'upload, réessaie plus tard.");
    }

    setEnCours(false);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Avatar photoUrl={apercu} prenom={prenom} nom={nom} size="lg" />
      <label className="cursor-pointer text-xs font-medium text-kagette-framboise-600 hover:underline">
        {enCours ? "Envoi..." : "Changer la photo"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={enCours}
          onChange={onFileSelected}
        />
      </label>
      {erreur && <p className="max-w-[6rem] text-[10px] text-kagette-framboise-600">{erreur}</p>}
    </div>
  );
}
