import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { creerUrlUploadSignee, isR2Configured } from "@/lib/s3";

const TYPES_AUTORISES = ["image/jpeg", "image/png", "image/webp"];

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

  const { contentType, extension } = await request.json();

  if (typeof contentType !== "string" || !TYPES_AUTORISES.includes(contentType)) {
    return NextResponse.json({ error: "Type d'image non autorisé" }, { status: 400 });
  }

  const key = `annonces/${session.user.id}/${crypto.randomUUID()}.${extension ?? "jpg"}`;
  const { uploadUrl, publicUrl } = await creerUrlUploadSignee(key, contentType);

  return NextResponse.json({ uploadUrl, publicUrl });
}
