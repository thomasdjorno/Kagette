import { auth } from "@/lib/auth";
import { PanierClient } from "./PanierClient";

export default async function PanierPage() {
  const session = await auth();
  return <PanierClient isAuthenticated={!!session?.user} />;
}
