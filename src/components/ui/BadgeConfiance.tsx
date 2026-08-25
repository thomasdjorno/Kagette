import type { Reputation } from "@/lib/reputation";

export function BadgeConfiance({ echanges, niveau, emoji }: Reputation) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-kagette-mangue-50 px-2.5 py-1 text-xs font-semibold text-kagette-mangue-600">
      {emoji} {niveau}
      {echanges > 0 && <span className="text-kagette-mangue-600/70">· {echanges} échange{echanges > 1 ? "s" : ""}</span>}
    </span>
  );
}
