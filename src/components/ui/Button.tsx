import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/clsx";

type Variant = "primary" | "secondary" | "ghost" | "invert" | "invert-outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-kagette-framboise-500 text-white hover:bg-kagette-framboise-600 disabled:bg-kagette-framboise-300",
  secondary:
    "bg-kagette-feuille-500 text-white hover:bg-kagette-feuille-600 disabled:bg-kagette-feuille-300",
  ghost:
    "bg-kagette-prune-700/5 text-kagette-prune-700 hover:bg-kagette-prune-700/10 border border-kagette-prune-700/10",
  invert: "bg-white text-kagette-framboise-600 hover:bg-kagette-mangue-50",
  "invert-outline": "bg-transparent text-white border border-white/40 hover:bg-white/10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
