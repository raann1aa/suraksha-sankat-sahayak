import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Bell,
  AlertCircle,
  Loader2,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  Clock,
  Pause,
  Play,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";

// Enhanced toast variants
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50",
        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50",
        info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50",
        loading: "border-border bg-background text-foreground",
      },
      size: {
        default: "p-4",
        sm: "p-3 text-sm",
        lg: "p-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced interfaces
interface ToasterProps {
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  maxToasts?: number;
  duration?: number;
  pauseOnHover?: boolean;
  pauseOnFocusLoss?: boolean;
  closeOnClick?: boolean;
  showProgressBar?: boolean;
  enableSound?: boolean;
  soundVolume?: number;
  enableAnimations?: boolean;
  stackToasts?: boolean;
  newestOnTop?: boolean;
  className?: string;
}

interface EnhancedToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?:
    | "default"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "loading";
  duration?: number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  pauseOnHover?: boolean;
  showProgressBar?: boolean;
  onClose?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  sound?: boolean;
  persistent?: boolean;
  dismissible?: boolean;
}

// Enhanced Toaster with comprehensive accessibility[381][382][384]
export function Toaster({
  position = "bottom-right",
  maxToasts = 5,
  duration = 5000,
  pauseOnHover = true,
  pauseOnFocusLoss = true,
  closeOnClick = false,
  showProgressBar = false,
  enableSound = false,
  soundVolume = 0.3,
  enableAnimations = true,
  stackToasts = true,
  newestOnTop = true,
  className,
}: ToasterProps = {}) {
  const { toasts } = useToast();
  const [soundEnabled, setSoundEnabled] = React.useState(enableSound);
  const [isPaused, setIsPaused] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio for sound notifications[382]
  React.useEffect(() => {
    if (soundEnabled && typeof Audio !== "undefined") {
      audioRef.current = new Audio("/notification-sound.mp3"); // Add your sound file
      audioRef.current.volume = soundVolume;
    }
  }, [soundEnabled, soundVolume]);

  // Play notification sound
  const playNotificationSound = React.useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore errors if sound cannot be played
      });
    }
  }, [soundEnabled]);

  // Get icon for toast variant
  const getVariantIcon = (variant: string) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      case "destructive":
        return <XCircle className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Handle page visibility for pause functionality[381]
  React.useEffect(() => {
    if (!pauseOnFocusLoss) return;

    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseOnFocusLoss]);

  // Limit number of visible toasts
  const visibleToasts = React.useMemo(() => {
    const limited = toasts.slice(0, maxToasts);
    return newestOnTop ? limited : limited.reverse();
  }, [toasts, maxToasts, newestOnTop]);

  // Toast positioning classes
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <ToastProvider>
      {/* Sound control */}
      {enableSound && (
        <div className="fixed top-4 right-4 z-[100]">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-md bg-background border shadow-sm hover:bg-accent transition-colors"
            aria-label={
              soundEnabled
                ? "Disable notification sounds"
                : "Enable notification sounds"
            }
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* Toast list with accessibility support[381][382][417] */}
      <div
        className={cn(
          "fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col",
          positionClasses[position],
          className
        )}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="popLayout">
          {visibleToasts.map((toast, index) => {
            const {
              id,
              title,
              description,
              action,
              variant = "default",
              ...props
            } = toast;

            return (
              <EnhancedToast
                key={id}
                id={id}
                title={title}
                description={description}
                variant={variant}
                action={action}
                duration={duration}
                pauseOnHover={pauseOnHover}
                showProgressBar={showProgressBar}
                sound={soundEnabled}
                onClose={() => playNotificationSound()}
                enableAnimations={enableAnimations}
                stackOffset={stackToasts ? index * 4 : 0}
                {...props}
              />
            );
          })}
        </AnimatePresence>
      </div>

      <ToastViewport />
    </ToastProvider>
  );
}

// Enhanced individual toast component[377][414][416]
const EnhancedToast: React.FC<
  EnhancedToastProps & {
    enableAnimations?: boolean;
    stackOffset?: number;
  }
> = ({
  id,
  title,
  description,
  variant = "default",
  duration = 5000,
  action,
  icon,
  pauseOnHover = true,
  showProgressBar = false,
  onClose,
  onPause,
  onResume,
  persistent = false,
  dismissible = true,
  enableAnimations = true,
  stackOffset = 0,
  ...props
}) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(duration);
  const [isVisible, setIsVisible] = React.useState(true);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const progressRef = React.useRef<HTMLDivElement>(null);

  // Timer management
  React.useEffect(() => {
    if (persistent || isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + timeLeft;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        handleClose();
        return;
      }

      setTimeLeft(remaining);
      timerRef.current = setTimeout(updateTimer, 16); // 60fps updates
    };

    timerRef.current = setTimeout(updateTimer, 16);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isPaused, persistent]);

  // Progress bar animation
  React.useEffect(() => {
    if (!showProgressBar || !progressRef.current || persistent) return;

    const progress = ((duration - timeLeft) / duration) * 100;
    progressRef.current.style.width = `${progress}%`;
  }, [timeLeft, duration, showProgressBar, persistent]);

  const handleClose = React.useCallback(() => {
    setIsVisible(false);
    onClose?.();
    // The actual removal will be handled by the parent component
  }, [onClose]);

  const handlePause = React.useCallback(() => {
    setIsPaused(true);
    onPause?.();
  }, [onPause]);

  const handleResume = React.useCallback(() => {
    setIsPaused(false);
    onResume?.();
  }, [onResume]);

  const handleMouseEnter = React.useCallback(() => {
    if (pauseOnHover) handlePause();
  }, [pauseOnHover, handlePause]);

  const handleMouseLeave = React.useCallback(() => {
    if (pauseOnHover) handleResume();
  }, [pauseOnHover, handleResume]);

  const toastIcon = icon || getVariantIcon(variant);

  const toastContent = (
    <Toast
      className={cn(
        toastVariants({ variant }),
        enableAnimations && "transition-all duration-300 ease-in-out",
        !isVisible && "opacity-0 scale-95"
      )}
      style={{
        transform: enableAnimations
          ? `translateY(-${stackOffset}px)`
          : undefined,
        zIndex: 50 - stackOffset,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live={variant === "destructive" ? "assertive" : "polite"}
      aria-atomic="true"
      aria-describedby={description ? `${id}-description` : undefined}
      {...props}
    >
      <div className="flex items-start gap-3 flex-1">
        {/* Icon */}
        {toastIcon && <div className="flex-shrink-0 mt-0.5">{toastIcon}</div>}

        {/* Content */}
        <div className="grid gap-1 flex-1 min-w-0">
          {title && (
            <ToastTitle className="text-sm font-medium leading-tight">
              {title}
            </ToastTitle>
          )}
          {description && (
            <ToastDescription
              id={`${id}-description`}
              className="text-sm opacity-90 leading-relaxed"
            >
              {description}
            </ToastDescription>
          )}
        </div>

        {/* Action */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>

      {/* Progress bar */}
      {showProgressBar && !persistent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
          <div
            ref={progressRef}
            className="h-full bg-current opacity-30 transition-all duration-75 ease-linear"
            style={{ width: "0%" }}
          />
        </div>
      )}

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute top-2 right-12">
          <Pause className="h-3 w-3 opacity-50" />
        </div>
      )}

      {/* Close button */}
      {dismissible && (
        <ToastClose onClick={handleClose} aria-label="Close notification" />
      )}
    </Toast>
  );

  if (!enableAnimations) {
    return toastContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      layout
    >
      {toastContent}
    </motion.div>
  );
};

// Utility function to get icon for variant
function getVariantIcon(variant: string) {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5" />;
    case "destructive":
      return <XCircle className="h-5 w-5" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5" />;
    case "info":
      return <Info className="h-5 w-5" />;
    case "loading":
      return <Loader2 className="h-5 w-5 animate-spin" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

export { type ToasterProps, type EnhancedToastProps };
