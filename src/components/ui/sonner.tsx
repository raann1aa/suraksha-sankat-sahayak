import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ExternalToast } from "sonner";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
  Loader2,
  Bell,
  Settings,
  Star,
  Heart,
  Bookmark,
  Flag,
  Share2,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced toast variants
const toastVariants = cva(
  "group toast group-[.toaster]:border group-[.toaster]:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border",
        destructive:
          "group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive/20",
        success:
          "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200 dark:group-[.toaster]:bg-green-950 dark:group-[.toaster]:text-green-50 dark:group-[.toaster]:border-green-800",
        warning:
          "group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200 dark:group-[.toaster]:bg-yellow-950 dark:group-[.toaster]:text-yellow-50 dark:group-[.toaster]:border-yellow-800",
        info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-50 dark:group-[.toaster]:border-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Enhanced interfaces
type ToasterProps = React.ComponentProps<typeof Sonner> & {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  offset?: string | number;
  gap?: number;
  visibleToasts?: number;
  closeButton?: boolean;
  richColors?: boolean;
  expand?: boolean;
  pauseWhenPageIsHidden?: boolean;
  cn?: (...classes: string[]) => string;
};

interface ToastOptions extends ExternalToast {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label?: string;
    onClick?: () => void;
  };
  persistent?: boolean;
  sound?: boolean;
}

interface ToastType {
  (message: string | React.ReactNode, options?: ToastOptions): string | number;
  success: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
  error: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
  warning: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
  info: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
  loading: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: {
      loading?: string | React.ReactNode;
      success?: string | React.ReactNode | ((data: T) => React.ReactNode);
      error?: string | React.ReactNode | ((error: any) => React.ReactNode);
    } & ToastOptions
  ) => string | number;
  custom: (
    jsx: (id: string | number) => React.ReactElement,
    options?: ToastOptions
  ) => string | number;
  dismiss: (id?: string | number) => void;
  message: (
    message: string | React.ReactNode,
    options?: ToastOptions
  ) => string | number;
}

// Enhanced Toaster component with comprehensive accessibility[373][375][378]
const Toaster = ({
  position = "bottom-right",
  offset = 32,
  gap = 14,
  visibleToasts = 3,
  closeButton = false,
  richColors = false,
  expand = false,
  pauseWhenPageIsHidden = true,
  cn: classNameFn,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      offset={offset}
      gap={gap}
      visibleToasts={visibleToasts}
      closeButton={closeButton}
      richColors={richColors}
      expand={expand}
      pauseWhenPageIsHidden={pauseWhenPageIsHidden}
      cn={classNameFn}
      toastOptions={{
        classNames: {
          toast: toastVariants(),
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-close group-[.toast]:text-close-foreground",
          error: toastVariants({ variant: "destructive" }),
          success: toastVariants({ variant: "success" }),
          warning: toastVariants({ variant: "warning" }),
          info: toastVariants({ variant: "info" }),
        },
        // Enhanced accessibility attributes[375][378][380]
        "aria-label": "Notification",
        "aria-live": "polite",
        "aria-atomic": "true",
        role: "status",
      }}
      {...props}
    />
  );
};

// Enhanced toast function with accessibility improvements[373][380][381]
const enhancedToast: ToastType = (message, options = {}) => {
  const {
    variant = "default",
    icon,
    action,
    cancel,
    persistent = false,
    sound = false,
    ...restOptions
  } = options;

  // Play sound notification if enabled[382]
  if (sound && typeof Audio !== "undefined") {
    try {
      const audio = new Audio("/notification-sound.mp3"); // Add your sound file
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors if sound cannot be played
      });
    } catch (error) {
      // Ignore sound errors
    }
  }

  // Determine default icon based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const toastOptions: ExternalToast = {
    icon: icon || getDefaultIcon(),
    duration: persistent ? Infinity : restOptions.duration,
    dismissible: restOptions.dismissible !== false,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
    cancel: cancel
      ? {
          label: cancel.label || "Cancel",
          onClick: cancel.onClick,
        }
      : undefined,
    className: cn(toastVariants({ variant })),
    // Accessibility enhancements[375][378]
    ariaProps: {
      role: "status",
      "aria-live": variant === "destructive" ? "assertive" : "polite",
      "aria-atomic": "true",
    },
    ...restOptions,
  };

  return toast(message, toastOptions);
};

// Enhanced toast methods with proper accessibility[373][380]
enhancedToast.success = (message, options = {}) => {
  return enhancedToast(message, { ...options, variant: "success" });
};

enhancedToast.error = (message, options = {}) => {
  return enhancedToast(message, {
    ...options,
    variant: "destructive",
    // Error toasts should be more assertive[381]
    duration: options.duration || 6000,
  });
};

enhancedToast.warning = (message, options = {}) => {
  return enhancedToast(message, { ...options, variant: "warning" });
};

enhancedToast.info = (message, options = {}) => {
  return enhancedToast(message, { ...options, variant: "info" });
};

enhancedToast.loading = (message, options = {}) => {
  return enhancedToast(message, {
    ...options,
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    duration: Infinity,
  });
};

enhancedToast.promise = <T,>(
  promise: Promise<T> | (() => Promise<T>),
  options: {
    loading?: string | React.ReactNode;
    success?: string | React.ReactNode | ((data: T) => React.ReactNode);
    error?: string | React.ReactNode | ((error: any) => React.ReactNode);
  } & ToastOptions
) => {
  const {
    loading = "Loading...",
    success = "Success!",
    error = "Error occurred",
    ...restOptions
  } = options;

  return toast.promise(
    promise,
    {
      loading: loading,
      success: success,
      error: error,
    },
    {
      className: cn(toastVariants({ variant: restOptions.variant })),
      ...restOptions,
    }
  );
};

enhancedToast.custom = (jsx, options = {}) => {
  return toast.custom(jsx, {
    className: cn(toastVariants({ variant: options.variant })),
    ...options,
  });
};

enhancedToast.dismiss = toast.dismiss;
enhancedToast.message = enhancedToast;

// Utility functions for common toast patterns
const showToast = {
  // Quick success message
  success: (message: string) =>
    enhancedToast.success(message, {
      duration: 3000,
      sound: true,
    }),

  // Error with retry action
  errorWithRetry: (message: string, onRetry: () => void) =>
    enhancedToast.error(message, {
      action: {
        label: "Retry",
        onClick: onRetry,
      },
      persistent: true,
    }),

  // Loading with progress
  loadingWithProgress: (message: string, promise: Promise<any>) => {
    const id = enhancedToast.loading(message);

    promise
      .then(() => {
        toast.dismiss(id);
        enhancedToast.success("Completed successfully");
      })
      .catch((error) => {
        toast.dismiss(id);
        enhancedToast.error(error.message || "An error occurred");
      });

    return id;
  },

  // Confirmation toast
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) =>
    enhancedToast(message, {
      variant: "warning",
      action: {
        label: "Confirm",
        onClick: onConfirm,
      },
      cancel: {
        label: "Cancel",
        onClick: onCancel,
      },
      persistent: true,
    }),

  // Undo action toast
  undo: (message: string, onUndo: () => void) =>
    enhancedToast.success(message, {
      action: {
        label: "Undo",
        onClick: onUndo,
      },
      duration: 8000,
    }),

  // Custom with icon
  withIcon: (
    message: string,
    icon: React.ReactNode,
    variant: ToastOptions["variant"] = "default"
  ) => enhancedToast(message, { icon, variant }),
};

// Hook for toast management in components
export const useToast = () => {
  const [toasts, setToasts] = React.useState<
    Array<{ id: string | number; message: string; type: string }>
  >([]);

  const addToast = React.useCallback(
    (message: string, options?: ToastOptions) => {
      const id = enhancedToast(message, options);
      setToasts((prev) => [
        ...prev,
        { id, message, type: options?.variant || "default" },
      ]);
      return id;
    },
    []
  );

  const removeToast = React.useCallback((id: string | number) => {
    toast.dismiss(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = React.useCallback(() => {
    toast.dismiss();
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    toast: enhancedToast,
    showToast,
  };
};

export {
  Toaster,
  enhancedToast as toast,
  showToast,
  type ToasterProps,
  type ToastOptions,
};
