import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  X,
  Loader2,
  Clock,
  Shield,
  Trash2,
  Download,
  Upload,
  Save,
  Send,
  Settings,
  User,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Heart,
  Star,
  Flag,
  HelpCircle,
  Lightbulb,
  Zap,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  Building,
  Car,
  CreditCard,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Enhanced Types
type AlertType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "confirm"
  | "custom";
type AlertSize = "sm" | "md" | "lg" | "xl" | "full";
type AlertPosition = "center" | "top" | "bottom";

interface AlertAction {
  id: string;
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ElementType;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
  shortcut?: string;
}

interface AlertDialogEnhancedProps {
  type?: AlertType;
  size?: AlertSize;
  position?: AlertPosition;
  icon?: React.ElementType | boolean;
  title?: string;
  description?: string;
  actions?: AlertAction[];
  showCloseButton?: boolean;
  closable?: boolean;
  persistent?: boolean;
  autoClose?: number;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
  maxWidth?: string;
  theme?: "light" | "dark";
  blur?: boolean;
  preventScrollLock?: boolean;
}

// Context for enhanced features
interface AlertDialogContextValue extends AlertDialogEnhancedProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  closeDialog: () => void;
}

const AlertDialogContext = React.createContext<
  AlertDialogContextValue | undefined
>(undefined);

const useAlertDialogContext = () => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error(
      "useAlertDialogContext must be used within AlertDialogProvider"
    );
  }
  return context;
};

// Enhanced Alert Dialog Root
const AlertDialog = AlertDialogPrimitive.Root;

// Enhanced Trigger with loading state
const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger> & {
    loading?: boolean;
  }
>(({ className, children, loading, disabled, ...props }, ref) => (
  <AlertDialogPrimitive.Trigger
    ref={ref}
    className={cn(className)}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {children}
      </div>
    ) : (
      children
    )}
  </AlertDialogPrimitive.Trigger>
));
AlertDialogTrigger.displayName = AlertDialogPrimitive.Trigger.displayName;

// Enhanced Portal
const AlertDialogPortal = AlertDialogPrimitive.Portal;

// Enhanced Overlay with blur support
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> & {
    blur?: boolean;
    theme?: "light" | "dark";
  }
>(({ className, blur = false, theme = "light", ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      blur ? "backdrop-blur-sm" : "",
      theme === "dark" ? "bg-black/90" : "bg-black/80",
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

// Enhanced Content with size and position support
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> &
    AlertDialogEnhancedProps
>(
  (
    {
      className,
      size = "md",
      position = "center",
      theme = "light",
      blur = false,
      maxWidth,
      showCloseButton = true,
      children,
      ...props
    },
    ref
  ) => {
    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "max-w-sm";
        case "md":
          return "max-w-lg";
        case "lg":
          return "max-w-2xl";
        case "xl":
          return "max-w-4xl";
        case "full":
          return "max-w-[95vw] max-h-[95vh]";
        default:
          return "max-w-lg";
      }
    };

    const getPositionClasses = () => {
      switch (position) {
        case "top":
          return "top-[20%] translate-y-0";
        case "bottom":
          return "bottom-[20%] translate-y-0";
        case "center":
        default:
          return "top-[50%] translate-y-[-50%]";
      }
    };

    return (
      <AlertDialogPortal>
        <AlertDialogOverlay blur={blur} theme={theme} />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-[50%] z-50 grid w-full translate-x-[-50%] gap-4 border shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2",
            position === "center" &&
              "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
            theme === "dark"
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-background",
            getSizeClasses(),
            getPositionClasses(),
            maxWidth && `max-w-[${maxWidth}]`,
            "sm:rounded-lg p-6",
            className
          )}
          style={maxWidth ? { maxWidth } : undefined}
          {...props}
        >
          {showCloseButton && (
            <AlertDialogPrimitive.Cancel asChild>
              <button className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </AlertDialogPrimitive.Cancel>
          )}
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    );
  }
);
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

// Enhanced Header with icon support
const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ElementType | boolean;
    type?: AlertType;
    centered?: boolean;
  }
>(({ className, icon, type, centered = false, children, ...props }, ref) => {
  const getTypeIcon = () => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "error":
        return XCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      case "confirm":
        return HelpCircle;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      case "confirm":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const IconComponent =
    typeof icon === "boolean" && icon
      ? getTypeIcon()
      : typeof icon === "function"
      ? icon
      : null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-3",
        centered ? "text-center items-center" : "text-left",
        className
      )}
      {...props}
    >
      {IconComponent && (
        <div
          className={cn("flex", centered ? "justify-center" : "justify-start")}
        >
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              type === "success"
                ? "bg-green-100"
                : type === "error"
                ? "bg-red-100"
                : type === "warning"
                ? "bg-yellow-100"
                : type === "info"
                ? "bg-blue-100"
                : "bg-gray-100"
            )}
          >
            <IconComponent className={cn("w-6 h-6", getIconColor())} />
          </div>
        </div>
      )}
      {children}
    </div>
  );
});
AlertDialogHeader.displayName = "AlertDialogHeader";

// Enhanced Footer with action buttons
const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    actions?: AlertAction[];
    onAction?: (actionId: string) => void;
    reversed?: boolean;
    fullWidth?: boolean;
  }
>(
  (
    {
      className,
      actions,
      onAction,
      reversed = false,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const [loadingAction, setLoadingAction] = React.useState<string | null>(
      null
    );

    const handleActionClick = async (action: AlertAction) => {
      if (action.disabled) return;

      setLoadingAction(action.id);
      try {
        await action.onClick?.();
        onAction?.(action.id);
      } finally {
        setLoadingAction(null);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          fullWidth
            ? "flex-col"
            : "flex-col-reverse sm:flex-row sm:justify-end",
          reversed && "flex-row-reverse",
          className
        )}
        {...props}
      >
        {actions?.map((action) => {
          const isLoading = loadingAction === action.id;
          const IconComponent = action.icon;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled || isLoading}
              className={cn(
                buttonVariants({ variant: action.variant }),
                fullWidth && "w-full",
                "flex items-center gap-2",
                action.autoFocus && "ring-2 ring-ring ring-offset-2"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : IconComponent ? (
                <IconComponent className="w-4 h-4" />
              ) : null}
              {action.label}
              {action.shortcut && (
                <span className="text-xs opacity-60 ml-auto">
                  {action.shortcut}
                </span>
              )}
            </button>
          );
        })}
        {children}
      </div>
    );
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// Enhanced Title with truncation support
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & {
    truncate?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
  }
>(({ className, truncate = false, size = "lg", ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-semibold leading-tight tracking-tight",
      size === "sm" && "text-base",
      size === "md" && "text-lg",
      size === "lg" && "text-xl",
      size === "xl" && "text-2xl",
      truncate && "truncate",
      className
    )}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

// Enhanced Description with rich content support
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> & {
    variant?: "default" | "muted" | "destructive" | "warning";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
  }
>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "muted":
          return "text-muted-foreground";
        case "destructive":
          return "text-destructive";
        case "warning":
          return "text-yellow-600";
        default:
          return "text-muted-foreground";
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case "sm":
          return "text-xs";
        case "md":
          return "text-sm";
        case "lg":
          return "text-base";
        default:
          return "text-sm";
      }
    };

    return (
      <AlertDialogPrimitive.Description
        ref={ref}
        className={cn(
          "leading-relaxed",
          getVariantStyles(),
          getSizeStyles(),
          className
        )}
        {...props}
      />
    );
  }
);
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName;

// Enhanced Action button
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    loading?: boolean;
    icon?: React.ElementType;
    shortcut?: string;
  }
>(({ className, loading, icon: Icon, shortcut, children, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), "flex items-center gap-2", className)}
    disabled={loading}
    {...props}
  >
    {loading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : Icon ? (
      <Icon className="w-4 h-4" />
    ) : null}
    {children}
    {shortcut && <span className="text-xs opacity-60 ml-auto">{shortcut}</span>}
  </AlertDialogPrimitive.Action>
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

// Enhanced Cancel button
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
    icon?: React.ElementType;
  }
>(({ className, icon: Icon, children, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0 flex items-center gap-2",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </AlertDialogPrimitive.Cancel>
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// Enhanced Body component for rich content
const AlertDialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    scrollable?: boolean;
    maxHeight?: string;
    padding?: boolean;
  }
>(
  (
    { className, scrollable = false, maxHeight, padding = true, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "space-y-4",
        padding && "px-1",
        scrollable && "overflow-y-auto",
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
      {...props}
    />
  )
);
AlertDialogBody.displayName = "AlertDialogBody";

// Progress component for loading states
const AlertDialogProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    indeterminate?: boolean;
    label?: string;
  }
>(({ className, value, indeterminate = false, label, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {label && (
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        {!indeterminate && typeof value === "number" && (
          <span>{Math.round(value)}%</span>
        )}
      </div>
    )}
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={cn(
          "h-2 bg-blue-600 transition-all duration-300",
          indeterminate && "animate-pulse"
        )}
        style={
          indeterminate
            ? { width: "100%" }
            : { width: `${Math.min(Math.max(value || 0, 0), 100)}%` }
        }
      />
    </div>
  </div>
));
AlertDialogProgress.displayName = "AlertDialogProgress";

// Form component for input dialogs
const AlertDialogForm = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-4", className)} {...props} />
));
AlertDialogForm.displayName = "AlertDialogForm";

// Input group for form fields
const AlertDialogInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    icon?: React.ElementType;
    helperText?: string;
  }
>(({ className, label, error, icon: Icon, helperText, ...props }, ref) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          Icon && "pl-10",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    {helperText && !error && (
      <p className="text-sm text-muted-foreground">{helperText}</p>
    )}
  </div>
));
AlertDialogInput.displayName = "AlertDialogInput";

// Preset alert dialogs for common use cases
interface PresetAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
}

// Confirmation Dialog Preset
export const ConfirmDialog: React.FC<PresetAlertProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  destructive = false,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader icon type="confirm" centered>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction
          loading={loading}
          className={destructive ? "bg-red-600 hover:bg-red-700" : undefined}
          onClick={onConfirm}
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Success Dialog Preset
export const SuccessDialog: React.FC<
  Omit<PresetAlertProps, "onCancel" | "cancelLabel">
> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "OK",
  loading = false,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader icon type="success" centered>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          loading={loading}
          onClick={onConfirm}
          className="bg-green-600 hover:bg-green-700"
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Error Dialog Preset
export const ErrorDialog: React.FC<
  Omit<PresetAlertProps, "onCancel" | "cancelLabel">
> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "OK",
  loading = false,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader icon type="error" centered>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription variant="destructive">
            {description}
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction
          loading={loading}
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogBody,
  AlertDialogProgress,
  AlertDialogForm,
  AlertDialogInput,
  type AlertAction,
  type AlertDialogEnhancedProps,
};
