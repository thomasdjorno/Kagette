import { clsx } from "@/lib/clsx";

export function PhotoPlaceholder({
  emoji,
  className,
}: {
  emoji: string;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center justify-center bg-kagette-mangue-50", className)}>
      <span className="text-5xl">{emoji}</span>
    </div>
  );
}
