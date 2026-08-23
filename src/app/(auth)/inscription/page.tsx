import { InscriptionForm } from "./InscriptionForm";
import { Card } from "@/components/ui/Card";

export default function InscriptionPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-xl font-serif font-bold text-kagette-prune-700">Créer un compte</h1>
        <p className="mt-1 text-sm text-kagette-prune-700/60">
          Un seul compte pour donner des fruits, cuisiner ou simplement acheter.
        </p>
        <InscriptionForm />
      </Card>
    </div>
  );
}
