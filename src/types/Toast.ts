import type { ReactNode } from "react";
import type * as RadixToast from "@radix-ui/react-toast";
import { 
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// Toast Variant Styles
export const TOAST_VARIANT_STYLES = {
  default: {
    base: "bg-neutral-900 text-white",
    icon: "text-neutral-300",
    title: "text-white",
    description: "text-neutral-300",
  },
  success: {
    base: "bg-green-500 text-white",
    icon: "text-green-100",
    title: "text-white",
    description: "text-green-50",
  },
  error: {
    base: "bg-red-500 text-white",
    icon: "text-red-100",
    title: "text-white",
    description: "text-red-50",
  },
  warning: {
    base: "bg-yellow-500 text-black",
    icon: "text-yellow-900",
    title: "text-black",
    description: "text-yellow-900/80",
  },
  info: {
    base: "bg-blue-500 text-white",
    icon: "text-blue-100",
    title: "text-white",
    description: "text-blue-50",
  },
} as const;

// Toast Icons
export const TOAST_ICONS = {
  default: null,
  success: FaCheckCircle,
  error: FaExclamationCircle,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
} as const;

// Toast Variant Type
export type ToastVariant = keyof typeof TOAST_VARIANT_STYLES;

// Base Toast Props
export interface BaseToastProps extends Omit<RadixToast.ToastProps, "children"> {
  id?: string;
  variant?: ToastVariant;
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick?: () => void;
    className?: string;
  };
  duration?: number;
}

// Toast Provider Props
export interface ToastProviderProps {
  children: ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxToasts?: number;
}

// Toast Context Type
export interface ToastContextType {
  toast: (props: BaseToastProps) => {
    id: string;
    dismiss: () => void;
  };
  toasts: BaseToastProps[];
  dismissToast: (id: string) => void;
}
