import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Star,
  Check,
  X,
  Camera,
  Edit,
  Settings,
  MoreHorizontal,
  Verified,
  AlertCircle,
  Loader2,
  Upload,
  Download,
  Share2,
  Copy,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Award,
  Flag,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced avatar variants
const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
        "2xl": "h-20 w-20 text-2xl",
        "3xl": "h-24 w-24 text-3xl",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
        rounded: "rounded-lg",
      },
      ring: {
        none: "",
        sm: "ring-1 ring-border",
        md: "ring-2 ring-border",
        lg: "ring-4 ring-border",
        xl: "ring-8 ring-border",
      },
      status: {
        none: "",
        online: "ring-2 ring-green-500",
        offline: "ring-2 ring-gray-300",
        busy: "ring-2 ring-red-500",
        away: "ring-2 ring-yellow-500",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
      ring: "none",
      status: "none",
    },
  }
);

const fallbackVariants = cva(
  "flex h-full w-full items-center justify-center font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border-2 border-muted bg-transparent text-foreground",
        ghost: "bg-transparent text-muted-foreground",
        gradient: "bg-gradient-to-br from-blue-500 to-purple-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Enhanced Avatar component with many new features
interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  name?: string;
  showInitials?: boolean;
  badge?: React.ReactNode;
  statusIcon?: React.ElementType;
  statusPosition?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  interactive?: boolean;
  loading?: boolean;
  error?: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  tooltip?: string;
  animate?: boolean;
  lazy?: boolean;
  priority?: boolean;
  delayMs?: number;
  gradient?: boolean;
  verified?: boolean;
  premium?: boolean;
  role?: "admin" | "moderator" | "user" | "vip";
  customColors?: {
    background?: string;
    text?: string;
    border?: string;
  };
}

// Status indicator component
const StatusIndicator: React.FC<{
  status: string;
  position: string;
  icon?: React.ElementType;
  size: string;
}> = ({ status, position, icon: Icon, size }) => {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-300";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPositionClasses = () => {
    const sizeClasses = {
      xs: "w-1.5 h-1.5",
      sm: "w-2 h-2",
      default: "w-2.5 h-2.5",
      lg: "w-3 h-3",
      xl: "w-3.5 h-3.5",
      "2xl": "w-4 h-4",
      "3xl": "w-4 h-4",
    };

    switch (position) {
      case "top-right":
        return `absolute -top-0.5 -right-0.5 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "bottom-right":
        return `absolute -bottom-0.5 -right-0.5 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "top-left":
        return `absolute -top-0.5 -left-0.5 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "bottom-left":
        return `absolute -bottom-0.5 -left-0.5 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      default:
        return `absolute -bottom-0.5 -right-0.5 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
    }
  };

  return (
    <div
      className={cn(
        "rounded-full border-2 border-background",
        getStatusColor(),
        getPositionClasses()
      )}
    >
      {Icon && <Icon className="w-full h-full p-0.5 text-white" />}
    </div>
  );
};

// Badge component for roles and verification
const AvatarBadge: React.FC<{
  type: "verified" | "premium" | "admin" | "moderator" | "vip" | "custom";
  position: string;
  size: string;
  icon?: React.ElementType;
  color?: string;
  children?: React.ReactNode;
}> = ({ type, position, size, icon, color, children }) => {
  const getBadgeIcon = () => {
    switch (type) {
      case "verified":
        return Verified;
      case "premium":
        return Star;
      case "admin":
        return Crown;
      case "moderator":
        return Shield;
      case "vip":
        return Award;
      default:
        return icon || Check;
    }
  };

  const getBadgeColor = () => {
    if (color) return color;
    switch (type) {
      case "verified":
        return "text-blue-500 bg-white";
      case "premium":
        return "text-yellow-500 bg-white";
      case "admin":
        return "text-red-500 bg-white";
      case "moderator":
        return "text-green-500 bg-white";
      case "vip":
        return "text-purple-500 bg-white";
      default:
        return "text-gray-500 bg-white";
    }
  };

  const getPositionClasses = () => {
    const sizeClasses = {
      xs: "w-3 h-3",
      sm: "w-3.5 h-3.5",
      default: "w-4 h-4",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
      "2xl": "w-7 h-7",
      "3xl": "w-8 h-8",
    };

    switch (position) {
      case "top-right":
        return `absolute -top-1 -right-1 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "bottom-right":
        return `absolute -bottom-1 -right-1 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "top-left":
        return `absolute -top-1 -left-1 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      case "bottom-left":
        return `absolute -bottom-1 -left-1 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
      default:
        return `absolute -top-1 -right-1 ${
          sizeClasses[size as keyof typeof sizeClasses]
        }`;
    }
  };

  const IconComponent = getBadgeIcon();

  return (
    <div
      className={cn(
        "rounded-full border-2 border-background shadow-sm",
        getBadgeColor(),
        getPositionClasses(),
        "flex items-center justify-center"
      )}
    >
      {children || <IconComponent className="w-2/3 h-2/3" />}
    </div>
  );
};

// Generate initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// Generate a consistent color from string
const getAvatarColor = (name: string): { bg: string; text: string } => {
  const colors = [
    { bg: "bg-red-500", text: "text-white" },
    { bg: "bg-blue-500", text: "text-white" },
    { bg: "bg-green-500", text: "text-white" },
    { bg: "bg-yellow-500", text: "text-black" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-orange-500", text: "text-white" },
    { bg: "bg-cyan-500", text: "text-black" },
  ];

  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      size = "default",
      shape = "circle",
      ring = "none",
      status = "none",
      src,
      alt,
      fallback,
      name,
      showInitials = true,
      badge,
      statusIcon,
      statusPosition = "bottom-right",
      interactive = false,
      loading = false,
      error = false,
      onImageLoad,
      onImageError,
      onClick,
      onContextMenu,
      tooltip,
      animate = false,
      lazy = false,
      priority = false,
      delayMs = 600,
      gradient = false,
      verified = false,
      premium = false,
      role,
      customColors,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(error);
    const [imageLoading, setImageLoading] = React.useState(loading);
    const [isHovered, setIsHovered] = React.useState(false);
    const [showActions, setShowActions] = React.useState(false);

    const handleImageLoad = () => {
      setImageLoading(false);
      onImageLoad?.();
    };

    const handleImageError = () => {
      setImageLoading(false);
      setImageError(true);
      onImageError?.();
    };

    const handleClick = (e: React.MouseEvent) => {
      if (interactive && onClick) {
        onClick();
      }
    };

    const avatarColors = React.useMemo(() => {
      if (customColors) return customColors;
      if (name && showInitials) return getAvatarColor(name);
      return { bg: "", text: "" };
    }, [name, showInitials, customColors]);

    const avatarContent = (
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          avatarVariants({ size, shape, ring, status }),
          interactive && "cursor-pointer hover:opacity-80 transition-opacity",
          loading && "opacity-50",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onContextMenu={onContextMenu}
        title={tooltip || alt || name}
        {...props}
      >
        {/* Main Avatar Content */}
        {src && !imageError ? (
          <AvatarImage
            src={src}
            alt={alt || name}
            onLoadingStatusChange={(status) => {
              if (status === "loading") setImageLoading(true);
              if (status === "loaded") handleImageLoad();
              if (status === "error") handleImageError();
            }}
            className={cn(lazy && "loading-lazy", priority && "loading-eager")}
          />
        ) : null}

        {/* Fallback */}
        <AvatarFallback
          delayMs={delayMs}
          className={cn(
            fallbackVariants({ variant: gradient ? "gradient" : "default" }),
            shape === "circle" && "rounded-full",
            shape === "square" && "rounded-md",
            shape === "rounded" && "rounded-lg",
            avatarColors.bg,
            avatarColors.text
          )}
          style={
            customColors
              ? {
                  backgroundColor: customColors.background,
                  color: customColors.text,
                  borderColor: customColors.border,
                }
              : undefined
          }
        >
          {fallback ||
            (name && showInitials ? (
              <span className="font-semibold">{getInitials(name)}</span>
            ) : (
              <User className="w-1/2 h-1/2" />
            ))}
        </AvatarFallback>

        {/* Loading Indicator */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 rounded-full">
            <Loader2 className="w-1/3 h-1/3 animate-spin" />
          </div>
        )}

        {/* Status Indicator */}
        {status !== "none" && (
          <StatusIndicator
            status={status}
            position={statusPosition}
            icon={statusIcon}
            size={size}
          />
        )}

        {/* Badges */}
        {verified && (
          <AvatarBadge type="verified" position="top-right" size={size} />
        )}
        {premium && (
          <AvatarBadge type="premium" position="bottom-right" size={size} />
        )}
        {role && <AvatarBadge type={role} position="top-left" size={size} />}
        {badge && <div className="absolute -top-1 -right-1">{badge}</div>}

        {/* Interactive Actions */}
        {interactive && isHovered && (
          <div
            className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Actions Menu */}
        {showActions && (
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 min-w-32">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
              <User className="w-3 h-3" />
              View Profile
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
              <MessageCircle className="w-3 h-3" />
              Message
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2">
              <Copy className="w-3 h-3" />
              Copy Link
            </button>
          </div>
        )}
      </AvatarPrimitive.Root>
    );

    if (animate) {
      return (
        <motion.div
          whileHover={{ scale: interactive ? 1.05 : 1 }}
          whileTap={{ scale: interactive ? 0.95 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {avatarContent}
        </motion.div>
      );
    }

    return avatarContent;
  }
);

Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> &
    VariantProps<typeof fallbackVariants>
>(({ className, variant, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(fallbackVariants({ variant }), "rounded-full", className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Avatar Group component for displaying multiple avatars
interface AvatarGroupProps {
  avatars: Array<{
    id: string;
    src?: string;
    name?: string;
    alt?: string;
  }>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
  overlap?: boolean;
  spacing?: "tight" | "normal" | "loose";
  showCount?: boolean;
  onAvatarClick?: (id: string) => void;
  className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max = 5,
      size = "default",
      overlap = true,
      spacing = "normal",
      showCount = true,
      onAvatarClick,
      className,
    },
    ref
  ) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    const getSpacingClass = () => {
      if (!overlap) return "space-x-2";
      switch (spacing) {
        case "tight":
          return "-space-x-1";
        case "normal":
          return "-space-x-2";
        case "loose":
          return "-space-x-1";
        default:
          return "-space-x-2";
      }
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center", getSpacingClass(), className)}
      >
        <AnimatePresence>
          {visibleAvatars.map((avatar, index) => (
            <motion.div
              key={avatar.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ zIndex: visibleAvatars.length - index }}
            >
              <Avatar
                src={avatar.src}
                name={avatar.name}
                alt={avatar.alt}
                size={size}
                ring="sm"
                interactive={!!onAvatarClick}
                onClick={() => onAvatarClick?.(avatar.id)}
                className="border-2 border-background"
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {remainingCount > 0 && showCount && (
          <Avatar
            size={size}
            className="border-2 border-background bg-muted"
            fallback={
              <span className="text-xs font-medium text-muted-foreground">
                +{remainingCount}
              </span>
            }
          />
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

// Avatar Stack component for overlapping display
interface AvatarStackProps {
  children: React.ReactNode;
  max?: number;
  spacing?: number;
  direction?: "left" | "right";
  className?: string;
}

const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  (
    { children, max = 5, spacing = -8, direction = "right", className },
    ref
  ) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);

    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        style={{
          marginLeft:
            direction === "left" ? spacing * (visibleChildren.length - 1) : 0,
          marginRight:
            direction === "right" ? spacing * (visibleChildren.length - 1) : 0,
        }}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            style={{
              marginLeft: index > 0 && direction === "right" ? spacing : 0,
              marginRight: index > 0 && direction === "left" ? spacing : 0,
              zIndex:
                direction === "right"
                  ? visibleChildren.length - index
                  : index + 1,
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);

AvatarStack.displayName = "AvatarStack";

// Preset avatar components
const UserAvatar: React.FC<Omit<AvatarProps, "fallback">> = (props) => (
  <Avatar {...props} fallback={<User className="w-1/2 h-1/2" />} />
);

const AdminAvatar: React.FC<Omit<AvatarProps, "role" | "badge">> = (props) => (
  <Avatar {...props} role="admin" ring="md" />
);

const VerifiedAvatar: React.FC<Omit<AvatarProps, "verified">> = (props) => (
  <Avatar {...props} verified />
);

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarStack,
  UserAvatar,
  AdminAvatar,
  VerifiedAvatar,
  StatusIndicator,
  AvatarBadge,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarStackProps,
};
