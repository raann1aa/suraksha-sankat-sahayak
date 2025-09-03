import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import {
  Power,
  Check,
  X,
  AlertTriangle,
  Shield,
  Bell,
  Lock,
  Unlock,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced types
interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "emergency"
    | "ghost";
  withIcons?: boolean;
  customIcons?: {
    checked?: React.ReactNode;
    unchecked?: React.ReactNode;
  };
  withLabels?: boolean;
  labels?: {
    on?: string;
    off?: string;
  };
  loading?: boolean;
  confirmationRequired?: boolean;
  confirmationMessage?: string;
  onConfirm?: () => void;
  emergencyMode?: boolean;
  pulseWhenOn?: boolean;
  glowEffect?: boolean;
  soundEnabled?: boolean;
  hapticFeedback?: boolean;
  description?: string;
  orientation?: "horizontal" | "vertical";
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(
  (
    {
      className,
      size = "md",
      variant = "default",
      withIcons = false,
      customIcons,
      withLabels = false,
      labels = { on: "On", off: "Off" },
      loading = false,
      confirmationRequired = false,
      confirmationMessage = "Are you sure?",
      onConfirm,
      emergencyMode = false,
      pulseWhenOn = false,
      glowEffect = false,
      soundEnabled = false,
      hapticFeedback = false,
      description,
      orientation = "horizontal",
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Size variants
    const sizeClasses = {
      sm: {
        root: "h-4 w-7",
        thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
        icons: "h-2 w-2",
        text: "text-xs",
      },
      md: {
        root: "h-6 w-11",
        thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
        icons: "h-3 w-3",
        text: "text-sm",
      },
      lg: {
        root: "h-8 w-14",
        thumb: "h-7 w-7 data-[state=checked]:translate-x-6",
        icons: "h-4 w-4",
        text: "text-base",
      },
    };

    // Variant styles
    const variantClasses = {
      default: {
        checked: "bg-primary",
        unchecked: "bg-input",
        thumb: "bg-background",
      },
      success: {
        checked: "bg-green-500",
        unchecked: "bg-gray-200 dark:bg-gray-800",
        thumb: "bg-background",
      },
      warning: {
        checked: "bg-yellow-500",
        unchecked: "bg-gray-200 dark:bg-gray-800",
        thumb: "bg-background",
      },
      danger: {
        checked: "bg-red-500",
        unchecked: "bg-gray-200 dark:bg-gray-800",
        thumb: "bg-background",
      },
      emergency: {
        checked: "bg-red-600 shadow-red-500/50 shadow-lg",
        unchecked: "bg-gray-300 dark:bg-gray-700",
        thumb: "bg-white border-2 border-red-100",
      },
      ghost: {
        checked: "bg-transparent border-primary border-2",
        unchecked: "bg-transparent border-input border-2",
        thumb: "bg-primary data-[state=unchecked]:bg-muted-foreground",
      },
    };

    // Handle audio feedback
    const playSound = React.useCallback(
      (type: "on" | "off") => {
        if (!soundEnabled) return;

        // Create audio context for click sounds
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(
            type === "on" ? 800 : 400,
            audioContext.currentTime
          );
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.1
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
          console.warn("Audio feedback not available:", error);
        }
      },
      [soundEnabled]
    );

    // Handle haptic feedback
    const triggerHapticFeedback = React.useCallback(() => {
      if (!hapticFeedback || !navigator.vibrate) return;

      navigator.vibrate(50); // Short vibration
    }, [hapticFeedback]);

    // Handle switch change
    const handleCheckedChange = React.useCallback(
      async (newChecked: boolean) => {
        if (loading) return;

        // Emergency mode confirmation
        if (confirmationRequired && newChecked && !showConfirmation) {
          setShowConfirmation(true);
          return;
        }

        setIsAnimating(true);

        // Haptic feedback
        triggerHapticFeedback();

        // Audio feedback
        playSound(newChecked ? "on" : "off");

        // Animation delay
        await new Promise((resolve) => setTimeout(resolve, 150));

        setIsChecked(newChecked);
        onCheckedChange?.(newChecked);

        if (onConfirm && newChecked) {
          onConfirm();
        }

        setShowConfirmation(false);
        setIsAnimating(false);
      },
      [
        loading,
        confirmationRequired,
        showConfirmation,
        triggerHapticFeedback,
        playSound,
        onCheckedChange,
        onConfirm,
      ]
    );

    // Get appropriate icons
    const getIcons = React.useCallback(() => {
      if (customIcons) return customIcons;

      const iconMap = {
        default: { checked: <Check />, unchecked: <X /> },
        success: { checked: <Check />, unchecked: <X /> },
        warning: { checked: <AlertTriangle />, unchecked: <AlertTriangle /> },
        danger: { checked: <AlertTriangle />, unchecked: <Shield /> },
        emergency: { checked: <Zap />, unchecked: <Power /> },
        ghost: { checked: <Eye />, unchecked: <EyeOff /> },
      };

      return iconMap[variant] || iconMap.default;
    }, [customIcons, variant]);

    const icons = getIcons();
    const currentChecked = checked !== undefined ? checked : isChecked;

    return (
      <div
        className={cn(
          "flex items-center gap-3",
          orientation === "vertical" && "flex-col",
          emergencyMode &&
            "p-2 border-2 border-red-500 rounded-lg bg-red-50/50 dark:bg-red-950/20"
        )}
      >
        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background border rounded-lg p-6 max-w-sm mx-4 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="font-semibold">Confirmation Required</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {confirmationMessage}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-3 py-1 text-sm border rounded hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCheckedChange(true)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Labels */}
          {withLabels && (
            <div
              className={cn(
                "flex justify-between text-muted-foreground",
                sizeClasses[size].text,
                orientation === "vertical" && "flex-col text-center"
              )}
            >
              <span
                className={cn(currentChecked && "text-foreground font-medium")}
              >
                {labels.on}
              </span>
              <span
                className={cn(!currentChecked && "text-foreground font-medium")}
              >
                {labels.off}
              </span>
            </div>
          )}

          {/* Main Switch */}
          <div className="relative">
            <SwitchPrimitives.Root
              className={cn(
                "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
                sizeClasses[size].root,
                `data-[state=checked]:${variantClasses[variant].checked}`,
                `data-[state=unchecked]:${variantClasses[variant].unchecked}`,
                currentChecked && pulseWhenOn && "animate-pulse",
                glowEffect && currentChecked && "shadow-lg shadow-current/25",
                emergencyMode && "border-red-500",
                loading && "opacity-75 cursor-wait",
                isAnimating && "scale-105",
                className
              )}
              {...props}
              ref={ref}
              checked={currentChecked}
              onCheckedChange={handleCheckedChange}
            >
              <SwitchPrimitives.Thumb
                className={cn(
                  "pointer-events-none block rounded-full shadow-lg ring-0 transition-transform duration-200",
                  sizeClasses[size].thumb,
                  variantClasses[variant].thumb,
                  loading && "animate-pulse"
                )}
              >
                {/* Icons inside thumb */}
                {withIcons && !loading && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div
                      className={cn(
                        sizeClasses[size].icons,
                        "transition-all duration-200"
                      )}
                    >
                      {currentChecked ? icons.checked : icons.unchecked}
                    </div>
                  </div>
                )}

                {/* Loading spinner */}
                {loading && (
                  <div className="flex items-center justify-center h-full w-full">
                    <div
                      className={cn(
                        "animate-spin rounded-full border-2 border-muted border-t-foreground",
                        size === "sm" && "h-2 w-2 border",
                        size === "md" && "h-3 w-3",
                        size === "lg" && "h-4 w-4"
                      )}
                    />
                  </div>
                )}
              </SwitchPrimitives.Thumb>
            </SwitchPrimitives.Root>

            {/* Status indicator */}
            {emergencyMode && (
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                  currentChecked ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}
              />
            )}
          </div>

          {/* Description */}
          {description && (
            <p
              className={cn(
                "text-muted-foreground",
                sizeClasses[size].text,
                orientation === "vertical" && "text-center"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Switch.displayName = "Switch";

// Emergency Toggle for critical systems
const EmergencyToggle = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchProps & {
    systemName?: string;
    requiresDoubleConfirmation?: boolean;
  }
>(
  (
    {
      systemName = "Emergency System",
      requiresDoubleConfirmation = true,
      ...props
    },
    ref
  ) => {
    const [firstConfirmation, setFirstConfirmation] = React.useState(false);

    const handleChange = React.useCallback(
      (checked: boolean) => {
        if (checked && requiresDoubleConfirmation && !firstConfirmation) {
          setFirstConfirmation(true);
          setTimeout(() => setFirstConfirmation(false), 5000); // Reset after 5 seconds
          return;
        }

        props.onCheckedChange?.(checked);
        setFirstConfirmation(false);
      },
      [requiresDoubleConfirmation, firstConfirmation, props]
    );

    return (
      <div className="space-y-2">
        <Switch
          ref={ref}
          variant="emergency"
          size="lg"
          withIcons
          customIcons={{
            checked: <Zap className="text-white" />,
            unchecked: <Power />,
          }}
          emergencyMode
          pulseWhenOn
          glowEffect
          soundEnabled
          hapticFeedback
          confirmationRequired={!firstConfirmation}
          confirmationMessage={`Activate ${systemName}?`}
          {...props}
          onCheckedChange={handleChange}
        />
        {firstConfirmation && (
          <p className="text-xs text-red-600 font-medium animate-pulse">
            Click again to confirm emergency activation
          </p>
        )}
      </div>
    );
  }
);
EmergencyToggle.displayName = "EmergencyToggle";

// Security Toggle with additional protection
const SecurityToggle = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchProps & {
    securityLevel?: "low" | "medium" | "high";
    requiresAuth?: boolean;
    onAuthRequired?: () => Promise<boolean>;
  }
>(
  (
    {
      securityLevel = "medium",
      requiresAuth = false,
      onAuthRequired,
      ...props
    },
    ref
  ) => {
    const [isAuthenticating, setIsAuthenticating] = React.useState(false);

    const handleChange = React.useCallback(
      async (checked: boolean) => {
        if (checked && requiresAuth && onAuthRequired) {
          setIsAuthenticating(true);
          try {
            const authResult = await onAuthRequired();
            if (!authResult) {
              setIsAuthenticating(false);
              return;
            }
          } catch (error) {
            setIsAuthenticating(false);
            return;
          }
          setIsAuthenticating(false);
        }

        props.onCheckedChange?.(checked);
      },
      [requiresAuth, onAuthRequired, props]
    );

    const getSecurityVariant = () => {
      switch (securityLevel) {
        case "high":
          return "danger";
        case "medium":
          return "warning";
        case "low":
          return "success";
        default:
          return "default";
      }
    };

    return (
      <Switch
        ref={ref}
        variant={getSecurityVariant()}
        withIcons
        customIcons={{
          checked: <Unlock />,
          unchecked: <Lock />,
        }}
        loading={isAuthenticating}
        glowEffect
        {...props}
        onCheckedChange={handleChange}
      />
    );
  }
);
SecurityToggle.displayName = "SecurityToggle";

// Utility hook for switch groups
export const useSwitchGroup = (initialStates: Record<string, boolean> = {}) => {
  const [switches, setSwitches] = React.useState(initialStates);

  const toggle = React.useCallback((key: string) => {
    setSwitches((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const set = React.useCallback((key: string, value: boolean) => {
    setSwitches((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleAll = React.useCallback((value?: boolean) => {
    setSwitches((prev) => {
      const newValue =
        value !== undefined ? value : !Object.values(prev).every(Boolean);
      return Object.keys(prev).reduce(
        (acc, key) => ({ ...acc, [key]: newValue }),
        {}
      );
    });
  }, []);

  const reset = React.useCallback(() => {
    setSwitches(initialStates);
  }, [initialStates]);

  return {
    switches,
    toggle,
    set,
    toggleAll,
    reset,
    allOn: Object.values(switches).every(Boolean),
    allOff: Object.values(switches).every((val) => !val),
    someOn: Object.values(switches).some(Boolean),
  };
};

export { Switch, EmergencyToggle, SecurityToggle };
