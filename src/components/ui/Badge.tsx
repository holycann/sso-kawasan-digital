"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "solid" | "soft" | "surface" | "outline";
type BadgeSize = "1" | "2" | "3";
type BadgeColor =
  | "gray"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "indigo"
  | "cyan"
  | "crimson";
type BadgeRadius = "none" | "small" | "medium" | "large" | "full";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  highContrast?: boolean;
  radius?: BadgeRadius;
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = "surface",
      size = "1",
      color = "gray",
      highContrast = false,
      radius = "full", // Changed default radius to "full"
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium",

          // Size variants
          {
            "px-2 py-0.5 text-xs": size === "1",
            "px-4 py-1 text-sm": size === "2",
            "px-6 py-1.5 text-base": size === "3",
          },

          // Variant and color styles
          {
            // Solid variants
            "text-white": variant === "solid",
            [`bg-${color}-9 ${highContrast ? `text-${color}-12` : ""}`]:
              variant === "solid",

            // Soft variants
            [`bg-${color}-3 text-${color}-11`]: variant === "soft",

            // Surface variants
            "bg-[var(--color-background)] text-[var(--color-secondary-text)] border border-[var(--color-border-subtle)]":
              variant === "surface",

            // Outline variants
            [`border border-${color}-7 text-${color}-11`]:
              variant === "outline",
          },

          // Radius variants
          {
            "rounded-none": radius === "none",
            "rounded-sm": radius === "small",
            "rounded-md": radius === "medium",
            "rounded-lg": radius === "large",
            "rounded-full": radius === "full",
          },

          // Additional shared styles
          "select-none whitespace-nowrap",

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
