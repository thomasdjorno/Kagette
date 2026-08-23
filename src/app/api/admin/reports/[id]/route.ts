import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.estAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { action } = await request.json();
  if (action !== "traiter" && action !== "rejeter") {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report) {
    return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
  }

  if (action === "traiter") {
    if (report.fruitListingId) {
      await prisma.fruitListing.update({
        where: { id: report.fruitListingId },
        data: { statut: "ANNULE" },
      });
    }
    if (report.productListingId) {
      await prisma.productListing.update({
        where: { id: report.productListingId },
        data: { statut: "ARCHIVE" },
      });
    }
  }

  const updated = await prisma.report.update({
    where: { id: params.id },
    data: { statut: action === "traiter" ? "TRAITE" : "REJETE" },
  });

  return NextResponse.json({ report: updated });
}
