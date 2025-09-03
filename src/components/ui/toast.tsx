import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import {
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  Bell,
  Shield,
  Zap,
  Clock,
  MapPin,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced types
interface ToastProviderProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Provider> {
  maxToasts?: number;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  emergencyMode?: boolean;
  soundEnabled?: boolean;
  persistEmergencyToasts?: boolean;
}

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  icon?: React.ReactNode;
  sound?: boolean;
  priority?: "low" | "normal" | "high" | "critical";
  emergencyLevel?: "info" | "warning" | "danger" | "critical";
  location?: { lat: number; lng: number; address?: string };
  timestamp?: Date;
  category?:
    | "system"
    | "emergency"
    | "security"
    | "communication"
    | "maintenance";
  actionable?: boolean;
  persistent?: boolean;
  expandable?: boolean;
}

const ToastProvider = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Provider>,
  ToastProviderProps
>(
  (
    {
      maxToasts = 5,
      position = "bottom-right",
      emergencyMode = false,
      soundEnabled = true,
      persistEmergencyToasts = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <ToastPrimitives.Provider ref={ref} swipeDirection="right" {...props}>
        <div data-toast-emergency={emergencyMode}>{children}</div>
        <ToastViewport
          position={position}
          maxToasts={maxToasts}
          emergencyMode={emergencyMode}
        />
      </ToastPrimitives.Provider>
    );
  }
);
ToastProvider.displayName = "ToastProvider";

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport> & {
    position?:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right"
      | "top-center"
      | "bottom-center";
    maxToasts?: number;
    emergencyMode?: boolean;
  }
>(
  (
    {
      className,
      position = "bottom-right",
      maxToasts = 5,
      emergencyMode = false,
      ...props
    },
    ref
  ) => {
    const positionClasses = {
      "top-left": "top-0 left-0 flex-col",
      "top-right": "top-0 right-0 flex-col",
      "bottom-left": "bottom-0 left-0 flex-col-reverse",
      "bottom-right": "bottom-0 right-0 flex-col-reverse",
      "top-center": "top-0 left-1/2 -translate-x-1/2 flex-col",
      "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 flex-col-reverse",
    };

    return (
      <ToastPrimitives.Viewport
        ref={ref}
        className={cn(
          "fixed z-[100] flex w-full max-w-[420px] p-4",
          "max-h-screen overflow-hidden",
          positionClasses[position],
          emergencyMode &&
            "z-[200] border-2 border-red-500 bg-red-50/90 backdrop-blur-sm rounded-lg",
          className
        )}
        style={
          {
            "--toast-max": maxToasts.toString(),
          } as React.CSSProperties
        }
        {...props}
      />
    );
  }
);
ToastViewport.displayName = "ToastViewport";

// Enhanced toast variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start space-x-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
        info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
        emergency:
          "border-red-600 bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100 shadow-red-500/25 shadow-2xl",
        critical:
          "border-red-700 bg-red-200 text-red-900 dark:bg-red-900 dark:text-red-100 animate-pulse shadow-red-600/50 shadow-2xl ring-2 ring-red-500",
      },
      priority: {
        low: "",
        normal: "",
        high: "ring-2 ring-primary/20",
        critical: "ring-4 ring-red-500/50 animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      priority: "normal",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(
  (
    {
      className,
      variant,
      priority = "normal",
      icon,
      sound = true,
      emergencyLevel,
      location,
      timestamp = new Date(),
      category = "system",
      actionable = false,
      persistent = false,
      expandable = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [soundEnabled, setSoundEnabled] = React.useState(true);

    // Play sound notification
    React.useEffect(() => {
      if (sound && soundEnabled) {
        playNotificationSound(variant || "default");
      }
    }, [sound, soundEnabled, variant]);

    // Auto-determine variant from emergency level
    const effectiveVariant = emergencyLevel
      ? emergencyLevel === "critical"
        ? "critical"
        : emergencyLevel === "danger"
        ? "destructive"
        : emergencyLevel === "warning"
        ? "warning"
        : "info"
      : variant;

    // Get appropriate icon
    const getIcon = () => {
      if (icon) return icon;

      const iconMap = {
        default: <Info className="h-5 w-5" />,
        destructive: <AlertCircle className="h-5 w-5" />,
        success: <CheckCircle className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        emergency: <Bell className="h-5 w-5" />,
        critical: <Zap className="h-5 w-5 animate-pulse" />,
      };

      return iconMap[effectiveVariant || "default"];
    };

    // Category colors
    const categoryClasses = {
      system: "border-l-4 border-l-blue-500",
      emergency: "border-l-4 border-l-red-500",
      security: "border-l-4 border-l-yellow-500",
      communication: "border-l-4 border-l-green-500",
      maintenance: "border-l-4 border-l-gray-500",
    };

    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(
          toastVariants({ variant: effectiveVariant, priority }),
          categoryClasses[category],
          persistent &&
            "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-0",
          "min-h-[80px]",
          className
        )}
        duration={
          persistent ? Infinity : priority === "critical" ? 10000 : 5000
        }
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {children}

          {/* Metadata */}
          {(location || timestamp) && (
            <div className="flex items-center gap-3 text-xs opacity-75 mt-2">
              {timestamp && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(timestamp)}
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location.address || `${location.lat}, ${location.lng}`}
                </div>
              )}
            </div>
          )}

          {/* Expandable content */}
          {expandable && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs underline opacity-75 hover:opacity-100 mt-1"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1">
          {/* Sound toggle */}
          {sound && (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded hover:bg-black/10 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="h-3 w-3" />
              ) : (
                <VolumeX className="h-3 w-3" />
              )}
            </button>
          )}

          {/* Priority indicator */}
          {priority === "critical" && (
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </div>

        {/* Close button (hidden for persistent toasts) */}
        {!persistent && <ToastClose />}
      </ToastPrimitives.Root>
    );
  }
);
Toast.displayName = "Toast";

// Enhanced Action with variants
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> & {
    variant?: "default" | "destructive" | "outline" | "secondary";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});
ToastAction.displayName = "ToastAction";

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = "ToastClose";

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

// Emergency-specific toast components for Suraksha Sankat Sahayak
const EmergencyToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  ToastProps & {
    emergencyType?:
      | "fire"
      | "medical"
      | "security"
      | "natural_disaster"
      | "technical";
    responseTeamId?: string;
    estimatedResponseTime?: number;
  }
>(
  (
    {
      emergencyType = "security",
      responseTeamId,
      estimatedResponseTime,
      location,
      children,
      ...props
    },
    ref
  ) => {
    const emergencyIcons = {
      fire: <Zap className="h-5 w-5 text-red-600" />,
      medical: <AlertCircle className="h-5 w-5 text-blue-600" />,
      security: <Shield className="h-5 w-5 text-yellow-600" />,
      natural_disaster: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      technical: <Info className="h-5 w-5 text-purple-600" />,
    };

    return (
      <Toast
        ref={ref}
        variant="critical"
        priority="critical"
        icon={emergencyIcons[emergencyType]}
        category="emergency"
        persistent
        sound
        location={location}
        {...props}
      >
        {children}

        {(responseTeamId || estimatedResponseTime) && (
          <div className="mt-2 p-2 bg-black/5 rounded text-xs space-y-1">
            {responseTeamId && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Team: {responseTeamId}
              </div>
            )}
            {estimatedResponseTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ETA: {estimatedResponseTime} minutes
              </div>
            )}
          </div>
        )}
      </Toast>
    );
  }
);
EmergencyToast.displayName = "EmergencyToast";

// Utility functions
const playNotificationSound = (variant: string) => {
  try {
    const context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Different sounds for different variants
    const frequencies = {
      default: 440,
      success: 523, // C5
      warning: 349, // F4
      destructive: 220, // A3
      emergency: 880, // A5
      critical: 1760, // A6
    };

    oscillator.frequency.setValueAtTime(
      frequencies[variant as keyof typeof frequencies] || 440,
      context.currentTime
    );
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);

    // For critical alerts, play a sequence
    if (variant === "critical") {
      setTimeout(() => {
        const osc2 = context.createOscillator();
        const gain2 = context.createGain();
        osc2.connect(gain2);
        gain2.connect(context.destination);
        osc2.frequency.setValueAtTime(1760, context.currentTime);
        gain2.gain.setValueAtTime(0.1, context.currentTime);
        gain2.gain.exponentialRampToValueAtTime(
          0.01,
          context.currentTime + 0.3
        );
        osc2.start();
        osc2.stop(context.currentTime + 0.3);
      }, 400);
    }
  } catch (error) {
    console.warn("Audio notification not available:", error);
  }
};

const formatTimestamp = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

// Hook for managing toast queue
export const useToastQueue = (maxToasts = 5) => {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string;
      content: React.ReactNode;
      variant?: string;
      priority?: "low" | "normal" | "high" | "critical";
    }>
  >([]);

  const addToast = React.useCallback(
    (toast: {
      content: React.ReactNode;
      variant?: string;
      priority?: "low" | "normal" | "high" | "critical";
    }) => {
      const id = Date.now().toString();
      setToasts((prev) => {
        const newToasts = [...prev, { ...toast, id }];

        // Sort by priority and keep only maxToasts
        newToasts.sort((a, b) => {
          const priorities = { low: 0, normal: 1, high: 2, critical: 3 };
          return (
            priorities[b.priority || "normal"] -
            priorities[a.priority || "normal"]
          );
        });

        return newToasts.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, addToast, removeToast, clearAll };
};

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  EmergencyToast,
};
