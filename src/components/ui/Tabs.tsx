"use client";

import React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface TabsProps extends RadixTabs.TabsProps {
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabs.Root ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </RadixTabs.Root>
  )
);
Tabs.displayName = "Tabs";

interface TabsListProps extends RadixTabs.TabsListProps {
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabs.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-[var(--color-dark-navy)] p-1 text-[var(--color-secondary-text)]",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.List>
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {
  className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabs.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-blue)]",
        "data-[state=active]:bg-[var(--color-background)] data-[state=active]:text-[var(--color-primary-text)] data-[state=active]:shadow-sm",
        "hover:bg-[var(--color-dark-navy)] hover:text-[var(--color-secondary-text)]",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  )
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends RadixTabs.TabsContentProps {
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ children, className, ...props }, ref) => (
    <RadixTabs.Content
      ref={ref}
      className={cn(
        "mt-2 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background)] p-4 text-[var(--color-primary-text)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-blue)]",
        className
      )}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
