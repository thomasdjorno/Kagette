import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { creerUrlUploadSignee, isR2Configured } from "@/lib/s3";

const EXTENSIONS_PAR_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "L'upload de photo n'est pas encore configuré (variables R2_* absentes)." },
      { status: 501 }
    );
  }

  const { contentType, size } = await request.json();

  if (typeof contentType !== "string" || !EXTENSIONS_PAR_TYPE[contentType]) {
    return NextResponse.json({ error: "Type d'image non autorisé" }, { status: 400 });
  }
  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0 || size > TAILLE_MAX_OCTETS) {
    return NextResponse.json({ error: "Image trop lourde (5 Mo maximum)" }, { status: 400 });
  }

  const key = `annonces/${session.user.id}/${crypto.randomUUID()}.${EXTENSIONS_PAR_TYPE[contentType]}`;
  const { uploadUrl, publicUrl } = await creerUrlUploadSignee(key, contentType, size);

  return NextResponse.json({ uploadUrl, publicUrl });
}
