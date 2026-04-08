import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "or";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-vert text-blanc hover:bg-vert-clair shadow-sm active:scale-[0.98]",
  secondary:
    "bg-anthracite text-blanc hover:bg-anthracite/90 shadow-sm active:scale-[0.98]",
  outline:
    "border border-vert text-vert hover:bg-vert hover:text-blanc active:scale-[0.98]",
  ghost: "text-vert hover:bg-vert-pale active:scale-[0.98]",
  or: "bg-or text-anthracite hover:bg-or-clair shadow-sm active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-2.5 text-base rounded-lg",
  lg: "px-8 py-3.5 text-base rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-or focus-visible:outline-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
