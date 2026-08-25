import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genererQrCodeDataUrl } from "@/lib/qrcode";
import { ImprimerButton } from "@/components/ui/ImprimerButton";

export default async function CarteProfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/carte");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const qrCodeDataUrl = await genererQrCodeDataUrl(`${baseUrl}/profil/${user.id}`);

  const roles = [
    user.estDonneur && "donneur de fruits",
    user.estCuisinier && "cuisinier local",
  ].filter(Boolean);
  const libelleRoles = roles.length > 0 ? roles.join(" · ").replace(/^./, (c) => c.toUpperCase()) : "";

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="no-print flex items-center justify-between">
        <h1 className="font-serif text-xl font-bold text-kagette-prune-700">Ma carte Kagette</h1>
        <ImprimerButton label="🖨️ Imprimer ma carte" />
      </div>

      <div className="rounded-2xl border-2 border-kagette-prune-700/20 bg-white p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-kagette-framboise-600">
          Kagette · Mensignac et alentours
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-kagette-prune-700">
          {user.prenom} {user.nom.charAt(0)}.
        </h2>
        {libelleRoles && <p className="mt-1 text-sm text-kagette-prune-700/70">{libelleRoles}</p>}

        <div className="mt-6 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- QR code en data URL, next/image ne le gère pas bien */}
          <img src={qrCodeDataUrl} alt="QR code vers mon profil Kagette" width={160} height={160} />
        </div>

        <p className="mt-4 text-sm text-kagette-prune-700/60">
          Scanne pour voir mes annonces et me suivre sur Kagette
        </p>
      </div>

      <p className="no-print text-xs text-kagette-prune-700/50">
        Affiche cette carte au marché, sur ton portail ou partage-la à tes voisins pour qu&apos;ils
        retrouvent facilement tes annonces sur Kagette.
      </p>
    </div>
  );
}
