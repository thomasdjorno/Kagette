import { TextareaHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/clsx";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm text-kagette-prune-700 placeholder:text-kagette-prune-700/40 focus:border-kagette-framboise-500 focus:outline-none focus:ring-2 focus:ring-kagette-framboise-100",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
