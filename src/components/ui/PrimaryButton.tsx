import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  compact?: boolean;
};

export function PrimaryButton({ children, compact = false, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-yellow px-6 font-bold text-brand-navy shadow-lg shadow-yellow-300/30 transition hover:-translate-y-0.5 hover:bg-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        compact ? "h-11 text-sm" : "h-14 text-base"
      } animate-pulseSoft ${className}`}
      {...props}
    >
      {children}
      <ArrowRight aria-hidden="true" size={18} />
    </button>
  );
}
