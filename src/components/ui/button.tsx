import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Download,
  Upload,
  Save,
  Edit,
  Trash2,
  Share2,
  Copy,
  ExternalLink,
  Heart,
  Star,
  Settings,
  User,
  Mail,
  Phone,
  Search,
  Filter,
  Zap,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-md",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80 shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 shadow-sm hover:shadow-md",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline active:text-primary/80",
        success:
          "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md",
        warning:
          "bg-yellow-600 text-white hover:bg-yellow-700 active:bg-yellow-800 shadow-sm hover:shadow-md",
        info: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
        gradient:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 shadow-lg hover:shadow-xl",
        neon: "bg-cyan-500 text-black hover:bg-cyan-400 active:bg-cyan-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/50 border border-cyan-400",
        glass:
          "bg-white/10 backdrop-blur-sm border border-white/20 text-foreground hover:bg-white/20 active:bg-white/30 shadow-lg",
      },
      size: {
        xs: "h-7 rounded px-2 text-xs gap-1 [&_svg]:size-3",
        sm: "h-9 rounded-md px-3 text-xs gap-1.5 [&_svg]:size-3.5",
        default: "h-10 px-4 py-2 gap-2 [&_svg]:size-4",
        lg: "h-11 rounded-md px-8 text-base gap-2 [&_svg]:size-5",
        xl: "h-12 rounded-lg px-10 text-lg gap-3 [&_svg]:size-5",
        icon: "h-10 w-10 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 [&_svg]:size-3.5",
        "icon-lg": "h-12 w-12 [&_svg]:size-5",
      },
      shape: {
        default: "",
        rounded: "rounded-full",
        square: "rounded-none",
        pill: "rounded-full px-6",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        wiggle: "hover:animate-wiggle",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      animation: "none",
    },
  }
);

// Enhanced Button props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  fullWidth?: boolean;
  tooltip?: string;
  badge?: string | number;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  download?: boolean | string;
  ripple?: boolean;
  haptic?: boolean;
  sound?: boolean;
  sticky?: boolean;
  floating?: boolean;
  glow?: boolean;
  gradient?: boolean;
  animate?: boolean;
  iconOnly?: boolean;
  confirmation?: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  };
  onConfirm?: () => void;
  onCancel?: () => void;
  shortcut?: string;
  external?: boolean;
  group?: "start" | "middle" | "end";
}

// Ripple effect component
const RippleEffect: React.FC<{
  x: number;
  y: number;
  size: number;
  onComplete: () => void;
}> = ({ x, y, size, onComplete }) => (
  <motion.span
    className="absolute rounded-full bg-white/20 pointer-events-none"
    style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 4, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    onAnimationComplete={onComplete}
  />
);

// Confirmation dialog component
const ConfirmationDialog: React.FC<{
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      animation,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      tooltip,
      badge,
      href,
      target = "_self",
      download,
      ripple = false,
      haptic = false,
      sound = false,
      sticky = false,
      floating = false,
      glow = false,
      animate = false,
      iconOnly = false,
      confirmation,
      onConfirm,
      onCancel,
      shortcut,
      external = false,
      group,
      children,
      onClick,
      onMouseDown,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number; size: number }>
    >([]);
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Play sound effect
    const playSound = React.useCallback(() => {
      if (!sound) return;
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfCCGH0fPTgjIGGGq+7qOYRAkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSl+zPLaizsIGGS57OihUgwNVKzn8LJjGwg2jdT0z3wvBSJ9ye7dkDEIF2m98qOaRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSh+zPHbizwIGGS56+mjUgwNVKzn8LJjGwg2jdTy0H4wBSF8yO3dkzAIGGi+8qSbRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSh+zPHbizwIGGS56+mjUgwNVKzn8LJjGwg2jdTy0H4wBSF8yO3dkzAIGGi+8qSbRQkPUKbh8rhmHgg3jNTypH4wBSJ8xu7dkzEIGGm98qObRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSh+zPHbizwIGGS56+mjUgwNVKzn8LJjGwg2jdTy0H4wBSF8yO3dkzAIGGi+8qSbRQkPUKbh8rhmHgg3jNTypH4wBSJ8xu7dkzEIGGm98qObRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSh+zPHbizwIGGS56+mjUgwNVKzn8LJjGwg2jdTy0H4wBSF8yO3dkzAIGGi+8qSbRQkPUKbh8rhmHgg3jNTypH4wBSJ8xu7dkzEIGGm98qObRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg+ltryxXkpBSh+zPHbizwIGGS56+mjUgwNVKzn8LJjGwg2jdTy0H4wBSF8yO3dkzAIGGi+8qSbRQkPUKbh8rhmHgg3jNTypH4wBSJ8xu7dkzEIGGm98qObRQkPUKXh8bllHgg2jdXzzn0vBSN7x+/eizEIHWm98qSaRgoQU6jn77RfGAg="
        );
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignore errors
      } catch (error) {
        console.warn("Sound playback failed:", error);
      }
    }, [sound]);

    // Haptic feedback
    const triggerHaptic = React.useCallback(() => {
      if (!haptic || !("vibrate" in navigator)) return;
      navigator.vibrate([10]);
    }, [haptic]);

    // Handle ripple effect
    const createRipple = React.useCallback(
      (event: React.MouseEvent) => {
        if (!ripple || !buttonRef.current) return;

        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple = {
          id: Date.now(),
          x,
          y,
          size,
        };

        setRipples((prev) => [...prev, newRipple]);
      },
      [ripple]
    );

    // Remove completed ripples
    const removeRipple = React.useCallback((id: number) => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, []);

    // Handle click with confirmation
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (loading || props.disabled) return;

        playSound();
        triggerHaptic();

        if (ripple) {
          createRipple(event);
        }

        if (confirmation) {
          setShowConfirmation(true);
          return;
        }

        if (href && !asChild) {
          if (external || target === "_blank") {
            window.open(href, target);
          } else {
            window.location.href = href;
          }
          return;
        }

        onClick?.(event);
      },
      [
        loading,
        props.disabled,
        playSound,
        triggerHaptic,
        ripple,
        createRipple,
        confirmation,
        href,
        asChild,
        external,
        target,
        onClick,
      ]
    );

    // Handle confirmation
    const handleConfirm = React.useCallback(() => {
      setShowConfirmation(false);
      onConfirm?.();
    }, [onConfirm]);

    const handleConfirmCancel = React.useCallback(() => {
      setShowConfirmation(false);
      onCancel?.();
    }, [onCancel]);

    // Keyboard shortcut handling
    React.useEffect(() => {
      if (!shortcut) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        const keys = shortcut.toLowerCase().split("+");
        const ctrlKey = keys.includes("ctrl") || keys.includes("cmd");
        const shiftKey = keys.includes("shift");
        const altKey = keys.includes("alt");
        const key = keys[keys.length - 1];

        if (
          (ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey) &&
          (shiftKey ? e.shiftKey : !e.shiftKey) &&
          (altKey ? e.altKey : !e.altKey) &&
          e.key.toLowerCase() === key
        ) {
          e.preventDefault();
          buttonRef.current?.click();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [shortcut]);

    // Group styling
    const getGroupClasses = () => {
      switch (group) {
        case "start":
          return "rounded-r-none border-r-0";
        case "middle":
          return "rounded-none border-r-0";
        case "end":
          return "rounded-l-none";
        default:
          return "";
      }
    };

    const Comp = asChild ? Slot : href ? "a" : "button";

    const buttonElement = (
      <Comp
        className={cn(
          buttonVariants({ variant, size, shape, animation, className }),
          fullWidth && "w-full",
          sticky && "sticky top-4 z-10",
          floating && "fixed bottom-4 right-4 z-50 shadow-lg",
          glow && "shadow-lg shadow-current/25",
          group && getGroupClasses(),
          "relative overflow-hidden",
          className
        )}
        ref={asChild ? undefined : ref || buttonRef}
        disabled={loading}
        onClick={handleClick}
        onMouseDown={(e) => {
          setIsPressed(true);
          onMouseDown?.(e);
        }}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        title={tooltip}
        href={href}
        target={href ? target : undefined}
        download={download}
        {...props}
      >
        {/* Ripple effects */}
        {ripple &&
          ripples.map((ripple) => (
            <RippleEffect
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              size={ripple.size}
              onComplete={() => removeRipple(ripple.id)}
            />
          ))}

        {/* Badge */}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold">
            {badge}
          </span>
        )}

        {/* Loading spinner */}
        {loading && <Loader2 className="animate-spin" />}

        {/* Left icon */}
        {!loading && LeftIcon && !iconOnly && (
          <LeftIcon className="flex-shrink-0" />
        )}

        {/* Icon only content */}
        {iconOnly && LeftIcon && !loading && (
          <LeftIcon className="flex-shrink-0" />
        )}

        {/* Button content */}
        {!iconOnly && (
          <span
            className={cn("flex-1 truncate", loading && loadingText && "ml-2")}
          >
            {loading && loadingText ? loadingText : children}
          </span>
        )}

        {/* Right icon */}
        {!loading && RightIcon && !iconOnly && (
          <RightIcon className="flex-shrink-0" />
        )}

        {/* External link indicator */}
        {external && href && !iconOnly && (
          <ExternalLink className="w-3 h-3 opacity-60" />
        )}

        {/* Keyboard shortcut */}
        {shortcut && (
          <span className="ml-auto text-xs opacity-60 font-mono">
            {shortcut}
          </span>
        )}
      </Comp>
    );

    const wrappedElement = animate ? (
      <motion.div
        whileHover={{ scale: isPressed ? 0.95 : 1.02 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        {buttonElement}
      </motion.div>
    ) : (
      buttonElement
    );

    return (
      <>
        {wrappedElement}
        {confirmation && (
          <ConfirmationDialog
            open={showConfirmation}
            title={confirmation.title}
            message={confirmation.message}
            confirmText={confirmation.confirmText || "Confirm"}
            cancelText={confirmation.cancelText || "Cancel"}
            onConfirm={handleConfirm}
            onCancel={handleConfirmCancel}
          />
        )}
      </>
    );
  }
);

Button.displayName = "Button";

// Button Group component
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md";
  className?: string;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    { children, orientation = "horizontal", spacing = "none", className },
    ref
  ) => {
    const spacingClasses = {
      none: "",
      sm: orientation === "horizontal" ? "space-x-2" : "space-y-2",
      md: orientation === "horizontal" ? "space-x-4" : "space-y-4",
    };

    // Auto-assign group positions to children
    const childrenArray = React.Children.toArray(children);
    const enhancedChildren = childrenArray.map((child, index) => {
      if (React.isValidElement(child) && spacing === "none") {
        const group =
          index === 0
            ? "start"
            : index === childrenArray.length - 1
            ? "end"
            : "middle";
        return React.cloneElement(child, { group });
      }
      return child;
    });

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          spacingClasses[spacing],
          className
        )}
      >
        {spacing === "none" ? enhancedChildren : children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// Preset button components
const IconButton: React.FC<Omit<ButtonProps, "iconOnly">> = (props) => (
  <Button iconOnly size="icon" {...props} />
);

const LoadingButton: React.FC<ButtonProps> = ({ loading: _, ...props }) => (
  <Button loading {...props} />
);

const ConfirmButton: React.FC<
  ButtonProps & {
    confirmationTitle?: string;
    confirmationMessage?: string;
  }
> = ({
  confirmationTitle = "Are you sure?",
  confirmationMessage = "This action cannot be undone.",
  ...props
}) => (
  <Button
    confirmation={{
      title: confirmationTitle,
      message: confirmationMessage,
    }}
    {...props}
  />
);

const FloatingActionButton: React.FC<ButtonProps> = (props) => (
  <Button
    floating
    size="icon-lg"
    shape="rounded"
    variant="default"
    glow
    animate
    {...props}
  />
);

export {
  Button,
  ButtonGroup,
  IconButton,
  LoadingButton,
  ConfirmButton,
  FloatingActionButton,
  buttonVariants,
  type ButtonProps,
};
