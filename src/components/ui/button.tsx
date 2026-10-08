import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";

const VARIANT: Record<ButtonVariant, string> = {
  // Rich gold, near-black label, 48px high (DESIGN.md)
  primary:
    "bg-primary-container text-on-primary-container border border-deep-gold hover:bg-deep-gold hover:text-background",
  // Transparent with a light gold border, blush on hover (DESIGN.md)
  secondary: "bg-transparent text-on-surface border border-gold-border hover:bg-blush",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-tap items-center justify-center gap-2 rounded-lg px-6 font-sans text-label-lg font-semibold transition-colors disabled:opacity-50 ${VARIANT[variant]} ${className}`}
      {...props}
    />
  );
}
