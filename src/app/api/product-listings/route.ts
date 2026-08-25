import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productListingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!session.user.estCuisinier) {
    return NextResponse.json(
      {
        error:
          "Ton badge hygiène doit être validé par un admin pour publier un produit",
      },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = productListingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Données invalides" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const region = await prisma.region.findUnique({ where: { id: data.regionId } });
  if (!region?.isActive) {
    return NextResponse.json({ error: "Région introuvable ou inactive" }, { status: 400 });
  }

  if (data.fruitListingOrigineId) {
    const origine = await prisma.fruitListing.findUnique({
      where: { id: data.fruitListingOrigineId },
    });
    if (!origine) {
      return NextResponse.json({ error: "Annonce de fruits d'origine introuvable" }, { status: 400 });
    }
  }

  const listing = await prisma.productListing.create({
    data: {
      cuisinierId: session.user.id,
      fruitListingOrigineId: data.fruitListingOrigineId || null,
      titre: data.titre,
      categorie: data.categorie,
      description: data.description,
      ingredients: data.ingredients,
      allergenes: data.allergenes,
      dluo: data.dluo,
      prix: data.prix,
      quantiteDisponible: data.quantiteDisponible,
      zoneRetrait: data.zoneRetrait,
      latitude: data.latitude,
      longitude: data.longitude,
      regionId: data.regionId,
      photoUrls: data.photoUrls,
    },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
