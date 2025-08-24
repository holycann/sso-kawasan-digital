import React from "react";
import * as Slot from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary-blue)] text-[var(--color-primary-text)] shadow-theme-xs hover:bg-[var(--color-bright-blue)] disabled:bg-[var(--color-primary-blue)]/50 focus:ring-[var(--color-primary-blue)]",
        outline:
          "border border-[var(--color-border-subtle)] bg-[var(--color-background)] text-[var(--color-secondary-text)] hover:bg-[var(--color-dark-navy)] focus:ring-[var(--color-primary-blue)]",
        ghost:
          "hover:bg-[var(--color-dark-navy)] hover:text-[var(--color-primary-text)] focus:ring-[var(--color-primary-blue)]",
        social:
          "inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-[var(--color-secondary-text)] transition-colors bg-[var(--color-background)] rounded-lg px-7 hover:bg-[var(--color-dark-navy)] focus:ring-[var(--color-primary-blue)]",
      },
      size: {
        default: "px-4 py-3 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
        social: "gap-3 py-3 text-sm font-normal px-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
