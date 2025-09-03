import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Minus,
  Plus,
  Power,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Heart,
  Star,
  Bookmark,
  Bell,
  BellOff,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  Bluetooth,
  Settings,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced toggle variants
const toggleVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        outline:
          "rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        ghost:
          "rounded-md hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        switch:
          "rounded-full bg-input relative transition-colors data-[state=on]:bg-primary",
        pill: "rounded-full bg-muted hover:bg-muted/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        filled:
          "rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        destructive:
          "rounded-md bg-transparent text-destructive hover:bg-destructive/10 data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
        icon: "h-10 w-10",
        switch: "h-6 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced interfaces
interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  icon?: React.ElementType;
  activeIcon?: React.ElementType;
  label?: string;
  description?: string;
  loading?: boolean;
  animate?: boolean;
  showState?: boolean;
  onLabel?: string;
  offLabel?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

interface ToggleGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: "tight" | "normal" | "loose";
}

interface SwitchToggleProps extends Omit<ToggleProps, "variant" | "size"> {
  size?: "sm" | "default" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "destructive";
}

// Enhanced Toggle component with comprehensive accessibility[422][426][428]
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon: Icon,
      activeIcon: ActiveIcon,
      label,
      description,
      loading = false,
      animate = false,
      showState = false,
      onLabel = "On",
      offLabel = "Off",
      children,
      pressed,
      onPressedChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalPressed, setInternalPressed] = React.useState(
      pressed ?? false
    );
    const [isFocused, setIsFocused] = React.useState(false);

    const isPressed = pressed !== undefined ? pressed : internalPressed;

    const handlePressedChange = React.useCallback(
      (newPressed: boolean) => {
        if (disabled || loading) return;

        setInternalPressed(newPressed);
        onPressedChange?.(newPressed);
      },
      [disabled, loading, onPressedChange]
    );

    const handleFocus = React.useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = React.useCallback(() => {
      setIsFocused(false);
    }, []);

    // Get appropriate icon based on state
    const getCurrentIcon = () => {
      if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
      if (isPressed && ActiveIcon) return <ActiveIcon className="h-4 w-4" />;
      if (Icon) return <Icon className="h-4 w-4" />;
      return null;
    };

    const currentIcon = getCurrentIcon();
    const stateText = showState ? (isPressed ? onLabel : offLabel) : null;

    const toggleContent = (
      <div
        className={cn(
          "flex items-center gap-2",
          variant === "switch" && "relative w-full h-full"
        )}
      >
        {variant === "switch" ? (
          <div
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200 ease-in-out",
              isPressed && "translate-x-5"
            )}
          />
        ) : (
          <>
            {currentIcon}
            {(children || stateText) && (
              <span className="flex items-center gap-1">
                {children}
                {stateText && (
                  <span className="text-xs opacity-75">({stateText})</span>
                )}
              </span>
            )}
          </>
        )}
      </div>
    );

    return (
      <div className={cn("flex flex-col", description && "space-y-1")}>
        <TogglePrimitive.Root
          ref={ref}
          className={cn(toggleVariants({ variant, size }), className)}
          pressed={isPressed}
          onPressedChange={handlePressedChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || loading}
          aria-pressed={isPressed}
          aria-label={props["aria-label"] || label}
          aria-describedby={
            props["aria-describedby"] ||
            (description ? `${props.id}-description` : undefined)
          }
          role="button"
          {...props}
        >
          {animate ? (
            <motion.div
              initial={false}
              animate={{
                scale: isPressed ? 0.95 : 1,
                rotate: isPressed ? (variant === "switch" ? 0 : 180) : 0,
              }}
              transition={{ duration: 0.15 }}
            >
              {toggleContent}
            </motion.div>
          ) : (
            toggleContent
          )}
        </TogglePrimitive.Root>

        {/* Label */}
        {label && !children && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        {/* Description */}
        {description && (
          <p
            id={`${props.id}-description`}
            className="text-xs text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Toggle.displayName = TogglePrimitive.Root.displayName;

// Switch-style toggle component[423][424][425]
const SwitchToggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  SwitchToggleProps
>(({ className, size = "default", color = "primary", ...props }, ref) => {
  const switchSizes = {
    sm: "h-5 w-9",
    default: "h-6 w-11",
    lg: "h-7 w-12",
  };

  const colorVariants = {
    primary: "data-[state=on]:bg-primary",
    secondary: "data-[state=on]:bg-secondary",
    success: "data-[state=on]:bg-green-600",
    warning: "data-[state=on]:bg-yellow-600",
    destructive: "data-[state=on]:bg-destructive",
  };

  return (
    <Toggle
      ref={ref}
      variant="switch"
      className={cn(switchSizes[size], colorVariants[color], className)}
      {...props}
    />
  );
});

SwitchToggle.displayName = "SwitchToggle";

// Toggle Group for organizing multiple toggles[421][428]
const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (
    {
      children,
      className,
      orientation = "horizontal",
      spacing = "normal",
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      tight: orientation === "horizontal" ? "gap-1" : "gap-1",
      normal: orientation === "horizontal" ? "gap-2" : "gap-2",
      loose: orientation === "horizontal" ? "gap-4" : "gap-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row items-center" : "flex-col",
          spacingClasses[spacing],
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  }
);

ToggleGroup.displayName = "ToggleGroup";

// Preset Toggle components for common use cases
const PlayPauseToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => (
  <Toggle
    icon={Play}
    activeIcon={Pause}
    aria-label="Play/Pause"
    variant="outline"
    size="icon"
    animate
    {...props}
  />
);

const MuteToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => (
  <Toggle
    icon={Volume2}
    activeIcon={VolumeX}
    aria-label="Mute/Unmute"
    variant="ghost"
    size="icon"
    {...props}
  />
);

const FavoriteToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => (
  <Toggle
    icon={Heart}
    activeIcon={Heart}
    aria-label="Add to favorites"
    variant="ghost"
    size="icon"
    className="data-[state=on]:text-red-500"
    animate
    {...props}
  />
);

const ThemeToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => (
  <Toggle
    icon={Sun}
    activeIcon={Moon}
    aria-label="Toggle theme"
    variant="outline"
    size="icon"
    animate
    {...props}
  />
);

const NotificationToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => <SwitchToggle aria-label="Enable notifications" {...props} />;

const BookmarkToggle: React.FC<Omit<ToggleProps, "icon" | "activeIcon">> = (
  props
) => (
  <Toggle
    icon={Bookmark}
    activeIcon={Bookmark}
    aria-label="Bookmark this page"
    variant="ghost"
    size="icon"
    className="data-[state=on]:text-blue-500"
    {...props}
  />
);

export {
  Toggle,
  SwitchToggle,
  ToggleGroup,
  PlayPauseToggle,
  MuteToggle,
  FavoriteToggle,
  ThemeToggle,
  NotificationToggle,
  BookmarkToggle,
  toggleVariants,
  type ToggleProps,
  type SwitchToggleProps,
  type ToggleGroupProps,
};
