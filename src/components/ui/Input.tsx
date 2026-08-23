import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm text-kagette-prune-700 placeholder:text-kagette-prune-700/40 focus:border-kagette-framboise-500 focus:outline-none focus:ring-2 focus:ring-kagette-framboise-100",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
