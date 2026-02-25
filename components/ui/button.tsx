import type { ButtonHTMLAttributes } from "react";

import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-parchment-gold text-[#191919] border border-parchment-gold hover:brightness-95",
  secondary:
    "bg-transparent text-parchment-green border border-parchment-green hover:bg-parchment-green/10",
  ghost:
    "bg-transparent text-parchment-ink border border-parchment-border hover:bg-parchment-border/15"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-parchment-gold",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
