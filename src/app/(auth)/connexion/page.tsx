import { Suspense } from "react";
import { ConnexionForm } from "./ConnexionForm";
import { Card } from "@/components/ui/Card";

export default function ConnexionPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-xl font-serif font-bold text-kagette-prune-700">Connexion</h1>
        <Suspense>
          <ConnexionForm />
        </Suspense>
      </Card>
    </div>
  );
}
