import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { ReinitialiserMotDePasseForm } from "./ReinitialiserMotDePasseForm";

export default function ReinitialiserMotDePassePage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-xl font-serif font-bold text-kagette-prune-700">
          Choisir un nouveau mot de passe
        </h1>
        <Suspense>
          <ReinitialiserMotDePasseForm />
        </Suspense>
      </Card>
    </div>
  );
}
