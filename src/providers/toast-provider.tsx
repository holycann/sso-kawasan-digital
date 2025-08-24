"use client";

import React, { useState, useCallback } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import {
  BaseToastProps,
  ToastProviderProps,
  ToastContextType,
  TOAST_VARIANT_STYLES,
  TOAST_ICONS,
} from "@/types/Toast";

// Toast Context
export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

// Comprehensive Toast Provider
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = "bottom-right",
  maxToasts = 3,
}) => {
  // Toast State Management
  const [toasts, setToasts] = useState<BaseToastProps[]>([]);

  // Dismiss Toast
  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  // Create Toast
  const toast = useCallback(
    (props: BaseToastProps) => {
      const id =
        props.id ||
        `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const toastProps = { ...props, id };

      setToasts((currentToasts) => {
        // Limit number of toasts if maxToasts is set
        const updatedToasts = [...currentToasts, toastProps];
        return maxToasts ? updatedToasts.slice(-maxToasts) : updatedToasts;
      });

      // Auto-dismiss
      const timer = setTimeout(() => {
        dismissToast(id);
      }, props.duration || 3000);

      return {
        id,
        dismiss: () => {
          clearTimeout(timer);
          dismissToast(id);
        },
      };
    },
    [dismissToast, maxToasts]
  );

  // Positioning Classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  } as const;

  // Toast Component
  const Toast = React.forwardRef<HTMLLIElement, BaseToastProps>(
    (
      {
        id,
        variant = "default",
        title,
        description,
        icon: CustomIcon,
        action,
        className,
        duration = 3000,
        ...props
      },
      ref
    ) => {
      const Icon = CustomIcon || TOAST_ICONS[variant];
      const variantStyles = TOAST_VARIANT_STYLES[variant];

      return (
        <RadixToast.Root
          ref={ref as React.Ref<HTMLLIElement>}
          duration={duration}
          className={cn(
            "group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-y-0 data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=end]:animate-swipeOut",
            variantStyles.base,
            className
          )}
          {...props}
        >
          <div className="flex items-center space-x-3">
            {Icon && <Icon className={cn("h-5 w-5", variantStyles.icon)} />}
            <div className="flex flex-col">
              {title && (
                <RadixToast.Title
                  className={cn("text-sm font-medium", variantStyles.title)}
                >
                  {title}
                </RadixToast.Title>
              )}
              {description && (
                <RadixToast.Description
                  className={cn(
                    "text-xs opacity-90",
                    variantStyles.description
                  )}
                >
                  {description}
                </RadixToast.Description>
              )}
            </div>
          </div>

          {action && (
            <RadixToast.Action
              altText={action.label}
              onClick={action.onClick}
              className={cn(
                "ml-auto text-sm underline hover:no-underline",
                action.className
              )}
            >
              {action.label}
            </RadixToast.Action>
          )}

          <RadixToast.Close
            className="absolute top-2 right-2 opacity-50 hover:opacity-100"
            aria-label="Close"
          >
            <span className="text-current">×</span>
          </RadixToast.Close>
        </RadixToast.Root>
      );
    }
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      <RadixToast.Provider swipeDirection="right" duration={3000}>
        {children}

        {/* Render Toasts */}
        {toasts.map((toastProps) => (
          <Toast key={toastProps.id} {...toastProps} />
        ))}

        <RadixToast.Viewport
          className={cn(
            "fixed z-[100] flex flex-col gap-3 w-[390px] max-w-[100vw] m-0 list-none p-4 outline-none",
            positionClasses[position]
          )}
          label="Notifications"
          hotkey={["F8"]}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};

// Hook to use toast from anywhere in the app
export function useToastContext() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
