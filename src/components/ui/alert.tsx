import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  X,
  Bell,
  Shield,
  Lightbulb,
  Zap,
  Heart,
  Star,
  Flag,
  Clock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Settings,
  HelpCircle,
  MessageSquare,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  Tag,
  Filter,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced alert variants
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 transition-all duration-200 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        destructive:
          "border-destructive/50 text-destructive bg-destructive/5 dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400 [&>svg]:text-green-600",
        warning:
          "border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:bg-yellow-950/20 dark:text-yellow-400 [&>svg]:text-yellow-600",
        info: "border-blue-500/50 text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400 [&>svg]:text-blue-600",
        secondary:
          "border-gray-200 text-gray-700 bg-gray-50 dark:bg-gray-900 dark:text-gray-300 [&>svg]:text-gray-600",
        outline: "border-2 border-border bg-transparent",
        ghost: "border-transparent bg-transparent shadow-none",
      },
      size: {
        sm: "p-3 text-sm [&>svg]:w-4 [&>svg]:h-4",
        default: "p-4 [&>svg]:w-5 [&>svg]:h-5",
        lg: "p-6 text-lg [&>svg]:w-6 [&>svg]:h-6",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
);

// Enhanced Alert component with many new features
interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ElementType | boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoClose?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  actions?: AlertAction[];
  priority?: "low" | "medium" | "high" | "urgent";
  timestamp?: Date;
  author?: string;
  category?: string;
  tags?: string[];
  interactive?: boolean;
  animate?: boolean;
  sound?: boolean;
  persistent?: boolean;
  showProgress?: boolean;
  progress?: number;
  loading?: boolean;
  counter?: number;
  location?: string;
  metadata?: Record<string, any>;
}

interface AlertAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  onClick: () => void | Promise<void>;
  variant?: "default" | "ghost" | "link";
  disabled?: boolean;
  loading?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      rounded = "default",
      icon,
      dismissible = false,
      onDismiss,
      autoClose,
      collapsible = false,
      defaultCollapsed = false,
      actions = [],
      priority,
      timestamp,
      author,
      category,
      tags = [],
      interactive = false,
      animate = false,
      sound = false,
      persistent = false,
      showProgress = false,
      progress = 0,
      loading = false,
      counter,
      location,
      metadata = {},
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [actionLoading, setActionLoading] = React.useState<string | null>(
      null
    );
    const [currentProgress, setCurrentProgress] = React.useState(progress);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    // Auto-close functionality
    React.useEffect(() => {
      if (autoClose && autoClose > 0 && !persistent) {
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, autoClose);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }, [autoClose, persistent]);

    // Progress animation
    React.useEffect(() => {
      if (showProgress && progress !== currentProgress) {
        const timer = setTimeout(() => setCurrentProgress(progress), 100);
        return () => clearTimeout(timer);
      }
    }, [progress, showProgress, currentProgress]);

    // Sound notification
    React.useEffect(() => {
      if (sound && variant && variant !== "default") {
        playNotificationSound(variant);
      }
    }, [sound, variant]);

    const getDefaultIcon = () => {
      switch (variant) {
        case "success":
          return CheckCircle;
        case "destructive":
          return XCircle;
        case "warning":
          return AlertTriangle;
        case "info":
          return Info;
        case "secondary":
          return Bell;
        default:
          return AlertCircle;
      }
    };

    const playNotificationSound = (alertType: string) => {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
          success: 523, // C5
          destructive: 207, // G#3
          warning: 415, // G#4
          info: 659, // E5
        };

        oscillator.frequency.setValueAtTime(
          frequencies[alertType as keyof typeof frequencies] || 440,
          audioContext.currentTime
        );

        oscillator.type = "sine";
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.error("Sound playback failed:", error);
      }
    };

    const handleDismiss = () => {
      if (animate) {
        setDismissed(true);
        setTimeout(() => {
          onDismiss?.();
        }, 300);
      } else {
        onDismiss?.();
      }
    };

    const handleActionClick = async (action: AlertAction) => {
      if (action.disabled) return;

      setActionLoading(action.id);
      try {
        await action.onClick();
      } finally {
        setActionLoading(null);
      }
    };

    const getPriorityStyles = () => {
      switch (priority) {
        case "urgent":
          return "ring-2 ring-red-500 ring-opacity-50 shadow-lg";
        case "high":
          return "ring-1 ring-orange-400 ring-opacity-30";
        case "medium":
          return "ring-1 ring-blue-400 ring-opacity-20";
        case "low":
          return "";
        default:
          return "";
      }
    };

    const IconComponent =
      typeof icon === "boolean" && icon
        ? getDefaultIcon()
        : typeof icon === "function"
        ? icon
        : null;

    const alertContent = (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant, size, rounded }),
          getPriorityStyles(),
          interactive && "hover:shadow-md cursor-pointer",
          dismissed &&
            animate &&
            "opacity-0 scale-95 transform transition-all duration-300",
          loading && "opacity-75",
          className
        )}
        {...props}
      >
        {/* Icon */}
        {IconComponent && (
          <div className="absolute left-4 top-4">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <IconComponent className="w-5 h-5" />
            )}
          </div>
        )}

        {/* Counter Badge */}
        {counter && counter > 1 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {counter > 99 ? "99+" : counter}
          </div>
        )}

        {/* Dismiss Button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}

        {/* Collapse Button */}
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-8 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {collapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
            <span className="sr-only">{collapsed ? "Expand" : "Collapse"}</span>
          </button>
        )}

        {/* Main Content */}
        <div
          className={cn(
            IconComponent && "pl-7",
            dismissible && "pr-8",
            collapsible && (dismissible ? "pr-16" : "pr-8")
          )}
        >
          {/* Header with metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <Tag className="w-3 h-3 mr-1" />
                {category}
              </span>
            )}
            {priority && (
              <span
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  priority === "urgent"
                    ? "bg-red-100 text-red-800"
                    : priority === "high"
                    ? "bg-orange-100 text-orange-800"
                    : priority === "medium"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <Flag className="w-3 h-3 mr-1" />
                {priority.toUpperCase()}
              </span>
            )}
            {timestamp && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {timestamp.toLocaleTimeString()}
              </span>
            )}
            {author && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <User className="w-3 h-3 mr-1" />
                {author}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {location}
              </span>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-blue-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(Math.max(currentProgress, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Collapsible Content */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={collapsible ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}

                {/* Actions */}
                {actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
                    {actions.map((action) => {
                      const isLoading = actionLoading === action.id;
                      const ActionIcon = action.icon;

                      return (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action)}
                          disabled={action.disabled || isLoading}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                            action.variant === "ghost"
                              ? "hover:bg-gray-100 text-gray-700"
                              : action.variant === "link"
                              ? "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline"
                              : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
                            action.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : ActionIcon ? (
                            <ActionIcon className="w-4 h-4" />
                          ) : null}
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Metadata Display */}
                {Object.keys(metadata).length > 0 && (
                  <details className="mt-4 pt-3 border-t border-gray-200">
                    <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
                      Additional Information
                    </summary>
                    <div className="mt-2 space-y-1">
                      {Object.entries(metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}:
                          </span>
                          <span className="text-gray-700 font-medium">
                            {String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );

    if (animate && !dismissed) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {alertContent}
        </motion.div>
      );
    }

    return alertContent;
  }
);

Alert.displayName = "Alert";

// Enhanced AlertTitle with size variants
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    size?: "sm" | "default" | "lg";
    truncate?: boolean;
  }
>(({ className, size = "default", truncate = false, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-none tracking-tight",
      size === "sm" && "text-sm",
      size === "default" && "text-base",
      size === "lg" && "text-lg",
      truncate && "truncate",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

// Enhanced AlertDescription with rich content support
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "muted" | "small";
    maxLines?: number;
  }
>(({ className, variant = "default", maxLines, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm [&_p]:leading-relaxed",
      variant === "muted" && "text-muted-foreground",
      variant === "small" && "text-xs",
      maxLines && `line-clamp-${maxLines}`,
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Alert List component for managing multiple alerts
interface AlertListProps {
  alerts: Array<AlertProps & { id: string }>;
  onDismiss?: (id: string) => void;
  maxVisible?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  spacing?: "sm" | "md" | "lg";
  stacked?: boolean;
}

const AlertList = React.forwardRef<HTMLDivElement, AlertListProps>(
  (
    {
      alerts,
      onDismiss,
      maxVisible = 5,
      position = "top-right",
      spacing = "md",
      stacked = false,
      ...props
    },
    ref
  ) => {
    const getPositionClasses = () => {
      switch (position) {
        case "top-right":
          return "fixed top-4 right-4 z-50";
        case "top-left":
          return "fixed top-4 left-4 z-50";
        case "bottom-right":
          return "fixed bottom-4 right-4 z-50";
        case "bottom-left":
          return "fixed bottom-4 left-4 z-50";
        case "top-center":
          return "fixed top-4 left-1/2 transform -translate-x-1/2 z-50";
        case "bottom-center":
          return "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50";
        default:
          return "fixed top-4 right-4 z-50";
      }
    };

    const getSpacingClasses = () => {
      switch (spacing) {
        case "sm":
          return "space-y-2";
        case "md":
          return "space-y-3";
        case "lg":
          return "space-y-4";
        default:
          return "space-y-3";
      }
    };

    const visibleAlerts = alerts.slice(0, maxVisible);
    const hiddenCount = Math.max(0, alerts.length - maxVisible);

    return (
      <div
        ref={ref}
        className={cn(getPositionClasses(), "max-w-sm w-full")}
        {...props}
      >
        <div className={cn(getSpacingClasses(), stacked && "relative")}>
          <AnimatePresence>
            {visibleAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{
                  opacity: 0,
                  x: position.includes("right") ? 300 : -300,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  ...(stacked && {
                    y: index * 4,
                    scale: 1 - index * 0.02,
                    zIndex: visibleAlerts.length - index,
                  }),
                }}
                exit={{
                  opacity: 0,
                  x: position.includes("right") ? 300 : -300,
                  scale: 0.8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={stacked ? "absolute inset-0" : ""}
              >
                <Alert
                  {...alert}
                  dismissible
                  onDismiss={() => onDismiss?.(alert.id)}
                  animate={false} // We handle animation here
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {hiddenCount > 0 && (
            <div className="text-center p-2 bg-gray-100 rounded-lg text-sm text-gray-600">
              +{hiddenCount} more alerts
            </div>
          )}
        </div>
      </div>
    );
  }
);

AlertList.displayName = "AlertList";

// Preset alert functions for common use cases
export const showSuccessAlert = (message: string) => ({
  id: `success-${Date.now()}`,
  variant: "success" as const,
  icon: true,
  title: "Success",
  children: message,
  dismissible: true,
  autoClose: 5000,
  animate: true,
});

export const showErrorAlert = (message: string) => ({
  id: `error-${Date.now()}`,
  variant: "destructive" as const,
  icon: true,
  title: "Error",
  children: message,
  dismissible: true,
  persistent: true,
  animate: true,
  sound: true,
});

export const showWarningAlert = (message: string) => ({
  id: `warning-${Date.now()}`,
  variant: "warning" as const,
  icon: true,
  title: "Warning",
  children: message,
  dismissible: true,
  autoClose: 8000,
  animate: true,
});

export const showInfoAlert = (message: string) => ({
  id: `info-${Date.now()}`,
  variant: "info" as const,
  icon: true,
  title: "Information",
  children: message,
  dismissible: true,
  autoClose: 5000,
  animate: true,
});

export { Alert, AlertTitle, AlertDescription, AlertList };
export type { AlertProps, AlertAction, AlertListProps };
