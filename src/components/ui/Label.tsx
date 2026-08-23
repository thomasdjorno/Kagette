import { LabelHTMLAttributes } from "react";
import { clsx } from "@/lib/clsx";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={clsx("mb-1.5 block text-sm font-medium text-kagette-prune-700", className)}
      {...props}
    />
  );
}
