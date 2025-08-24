import React from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { 
  BaseToastProps, 
  TOAST_VARIANT_STYLES, 
  TOAST_ICONS 
} from "@/types/Toast";

export const Toast = React.forwardRef<HTMLLIElement, BaseToastProps>(
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
                className={cn("text-xs opacity-90", variantStyles.description)}
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

Toast.displayName = "Toast";

// Toast Provider with Positioning
export const ToastProvider: React.FC<{
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxToasts?: number;
}> = ({ 
  children, 
  position = "bottom-right", 
  maxToasts = 3 
}) => {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  } as const;

  return (
    <RadixToast.Provider 
      swipeDirection="right" 
      duration={3000}
    >
      {children}
      <RadixToast.Viewport
        className={cn(
          "fixed z-[100] flex flex-col gap-3 w-[390px] max-w-[100vw] m-0 list-none p-4 outline-none",
          positionClasses[position]
        )}
        label="Notifications"
        hotkey={["F8"]}
      />
    </RadixToast.Provider>
  );
};

ToastProvider.displayName = "ToastProvider";

// Separate Viewport for flexibility
export const ToastViewport = RadixToast.Viewport;
