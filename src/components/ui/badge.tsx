import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  AlertTriangle,
  Info,
  Star,
  Crown,
  Shield,
  Zap,
  Heart,
  Clock,
  User,
  Settings,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Flag,
  Award,
  Bookmark,
  Eye,
  Lock,
  Unlock,
  Loader2,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-green-500 text-white",
        warning: "border-transparent bg-yellow-500 text-yellow-900",
        info: "border-transparent bg-blue-500 text-white",
        outline: "text-foreground border-border bg-transparent",
        ghost: "text-muted-foreground bg-transparent border-transparent",
        gradient:
          "border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white",
        soft: "border-transparent bg-muted/50 text-muted-foreground",
        neon: "border-2 border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-400/25",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs rounded-md",
        default: "px-2.5 py-0.5 text-xs rounded-full",
        lg: "px-3 py-1 text-sm rounded-full",
        xl: "px-4 py-1.5 text-base rounded-full",
      },
      shape: {
        pill: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
        circle: "rounded-full aspect-square p-1.5",
      },
      interactive: {
        none: "",
        hover: "cursor-pointer hover:scale-105 hover:shadow-md active:scale-95",
        button: "cursor-pointer hover:opacity-80 active:scale-95",
      },
      pulse: {
        none: "",
        slow: "animate-pulse",
        fast: "animate-ping",
      },
      glow: {
        none: "",
        soft: "shadow-lg",
        medium: "shadow-xl shadow-current/25",
        strong: "shadow-2xl shadow-current/50",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "pill",
      interactive: "none",
      pulse: "none",
      glow: "none",
    },
  }
);

// Enhanced Badge props interface
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ElementType;
  iconPosition?: "left" | "right" | "only";
  closable?: boolean;
  onClose?: () => void;
  loading?: boolean;
  count?: number;
  dot?: boolean;
  maxCount?: number;
  animate?: boolean;
  tooltip?: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  disabled?: boolean;
  ariaLabel?: string;
  status?: "online" | "offline" | "busy" | "away";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  timestamp?: Date;
  truncate?: boolean;
  maxLength?: number;
}

// Status colors mapping
const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

// Priority colors mapping
const priorityColors = {
  low: "bg-blue-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500 animate-pulse",
};

function Badge({
  className,
  variant,
  size,
  shape,
  interactive,
  pulse,
  glow,
  icon: Icon,
  iconPosition = "left",
  closable = false,
  onClose,
  loading = false,
  count,
  dot = false,
  maxCount = 99,
  animate = false,
  tooltip,
  href,
  target = "_self",
  disabled = false,
  ariaLabel,
  status,
  priority,
  category,
  timestamp,
  truncate = false,
  maxLength = 20,
  children,
  onClick,
  ...props
}: BadgeProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  // Handle close functionality
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animate) {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 150);
    } else {
      onClose?.();
    }
  };

  // Handle click for interactive badges
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (href) {
      window.open(href, target);
    }
    onClick?.(e);
  };

  // Truncate text if needed
  const truncatedChildren = React.useMemo(() => {
    if (!truncate || typeof children !== "string") return children;
    if (children.length <= maxLength) return children;
    return children.slice(0, maxLength) + "...";
  }, [children, truncate, maxLength]);

  // Format count display
  const displayCount = React.useMemo(() => {
    if (typeof count !== "number") return count;
    return count > maxCount ? `${maxCount}+` : count;
  }, [count, maxCount]);

  // Determine if badge should be interactive
  const isInteractive = interactive !== "none" || onClick || href;

  const badgeContent = (
    <div
      className={cn(
        badgeVariants({ variant, size, shape, interactive, pulse, glow }),
        disabled && "opacity-50 cursor-not-allowed",
        isInteractive && !disabled && "transition-transform",
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick || href ? "button" : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      title={tooltip}
      {...props}
    >
      {/* Status Indicator */}
      {status && (
        <div
          className={cn("w-2 h-2 rounded-full mr-1.5", statusColors[status])}
        />
      )}

      {/* Priority Indicator */}
      {priority && (
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full mr-1.5",
            priorityColors[priority]
          )}
        />
      )}

      {/* Dot indicator */}
      {dot && <div className="w-1.5 h-1.5 rounded-full bg-current mr-1" />}

      {/* Left Icon */}
      {Icon && iconPosition === "left" && (
        <Icon className={cn("w-3 h-3", children && "mr-1")} />
      )}

      {/* Loading Spinner */}
      {loading && (
        <Loader2 className={cn("w-3 h-3 animate-spin", children && "mr-1")} />
      )}

      {/* Content */}
      {iconPosition !== "only" && (
        <span className="flex items-center gap-1">
          {/* Count Display */}
          {count !== undefined && (
            <span className="font-bold">{displayCount}</span>
          )}

          {/* Main Content */}
          {truncatedChildren}

          {/* Category */}
          {category && <span className="opacity-75 text-xs">#{category}</span>}

          {/* Timestamp */}
          {timestamp && (
            <span className="opacity-75 text-xs ml-1">
              {timestamp.toLocaleDateString()}
            </span>
          )}
        </span>
      )}

      {/* Right Icon */}
      {Icon && iconPosition === "right" && (
        <Icon className={cn("w-3 h-3", children && "ml-1")} />
      )}

      {/* Icon Only */}
      {Icon && iconPosition === "only" && <Icon className="w-3 h-3" />}

      {/* Close Button */}
      {closable && (
        <button
          type="button"
          onClick={handleClose}
          className={cn(
            "ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-current"
          )}
          aria-label="Remove badge"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );

  // Wrap with animation if needed
  if (animate) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: isInteractive ? 1.05 : 1 }}
            whileTap={{ scale: isInteractive ? 0.95 : 1 }}
          >
            {badgeContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return badgeContent;
}

// Badge Group component for managing multiple badges
interface BadgeGroupProps {
  children: React.ReactNode;
  max?: number;
  spacing?: "tight" | "normal" | "loose";
  wrap?: boolean;
  className?: string;
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ children, max = 5, spacing = "normal", wrap = true, className }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const hiddenCount = max ? Math.max(0, childrenArray.length - max) : 0;

    const getSpacingClass = () => {
      switch (spacing) {
        case "tight":
          return "gap-1";
        case "normal":
          return "gap-2";
        case "loose":
          return "gap-3";
        default:
          return "gap-2";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          getSpacingClass(),
          wrap ? "flex-wrap" : "overflow-hidden",
          className
        )}
      >
        {visibleChildren}
        {hiddenCount > 0 && (
          <Badge variant="ghost" size="sm">
            +{hiddenCount}
          </Badge>
        )}
      </div>
    );
  }
);

BadgeGroup.displayName = "BadgeGroup";

// Notification Badge component
interface NotificationBadgeProps extends Omit<BadgeProps, "children"> {
  count: number;
  showZero?: boolean;
  max?: number;
}

const NotificationBadge = React.forwardRef<
  HTMLDivElement,
  NotificationBadgeProps
>(({ count, showZero = false, max = 99, className, ...props }, ref) => {
  if (!showZero && count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      ref={ref}
      variant="destructive"
      size="sm"
      shape="circle"
      className={cn("min-w-5 h-5 p-0 justify-center", className)}
      {...props}
    >
      {displayCount}
    </Badge>
  );
});

NotificationBadge.displayName = "NotificationBadge";

// Status Badge component
interface StatusBadgeProps extends Omit<BadgeProps, "variant" | "children"> {
  status: "active" | "inactive" | "pending" | "success" | "error" | "warning";
  showIcon?: boolean;
  label?: string;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, showIcon = true, label, className, ...props }, ref) => {
    const statusConfig = {
      active: { variant: "success" as const, icon: Check, label: "Active" },
      inactive: {
        variant: "secondary" as const,
        icon: Circle,
        label: "Inactive",
      },
      pending: { variant: "warning" as const, icon: Clock, label: "Pending" },
      success: { variant: "success" as const, icon: Check, label: "Success" },
      error: { variant: "destructive" as const, icon: X, label: "Error" },
      warning: {
        variant: "warning" as const,
        icon: AlertTriangle,
        label: "Warning",
      },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        icon={showIcon ? config.icon : undefined}
        iconPosition="left"
        className={className}
        {...props}
      >
        {label || config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

// Preset badge components
const SuccessBadge: React.FC<Omit<BadgeProps, "variant" | "icon">> = (
  props
) => <Badge variant="success" icon={Check} iconPosition="left" {...props} />;

const ErrorBadge: React.FC<Omit<BadgeProps, "variant" | "icon">> = (props) => (
  <Badge variant="destructive" icon={X} iconPosition="left" {...props} />
);

const WarningBadge: React.FC<Omit<BadgeProps, "variant" | "icon">> = (
  props
) => (
  <Badge
    variant="warning"
    icon={AlertTriangle}
    iconPosition="left"
    {...props}
  />
);

const InfoBadge: React.FC<Omit<BadgeProps, "variant" | "icon">> = (props) => (
  <Badge variant="info" icon={Info} iconPosition="left" {...props} />
);

const PremiumBadge: React.FC<Omit<BadgeProps, "variant" | "icon">> = (
  props
) => (
  <Badge
    variant="gradient"
    icon={Crown}
    iconPosition="left"
    glow="medium"
    {...props}
  >
    Premium
  </Badge>
);

const NewBadge: React.FC<Omit<BadgeProps, "variant">> = (props) => (
  <Badge variant="neon" pulse="slow" glow="strong" {...props}>
    NEW
  </Badge>
);

export {
  Badge,
  BadgeGroup,
  NotificationBadge,
  StatusBadge,
  SuccessBadge,
  ErrorBadge,
  WarningBadge,
  InfoBadge,
  PremiumBadge,
  NewBadge,
  badgeVariants,
  type BadgeProps,
  type BadgeGroupProps,
  type NotificationBadgeProps,
  type StatusBadgeProps,
};
