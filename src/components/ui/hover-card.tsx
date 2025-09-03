import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpCircle,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  User,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Bookmark,
  Flag,
  Tag,
  Eye,
  Mail,
  Phone,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Activity,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced hover card variants
const hoverCardVariants = cva(
  "z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
  {
    variants: {
      size: {
        sm: "w-48 p-3",
        default: "w-64 p-4",
        lg: "w-80 p-5",
        xl: "w-96 p-6",
        auto: "min-w-48 max-w-sm p-4",
      },
      variant: {
        default: "",
        minimal: "border-0 shadow-lg",
        outlined: "border-2",
        elevated: "shadow-lg border-0",
        glass: "bg-background/80 backdrop-blur-sm border-white/20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

// Enhanced interfaces
interface HoverCardProps
  extends React.ComponentProps<typeof HoverCardPrimitive.Root> {
  openDelay?: number;
  closeDelay?: number;
  keyboardAccessible?: boolean;
  showArrow?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  onOpenChange?: (open: boolean) => void;
}

interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
    VariantProps<typeof hoverCardVariants> {
  showArrow?: boolean;
  animate?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  scrollable?: boolean;
}

interface HoverCardTriggerProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> {
  keyboardAccessible?: boolean;
  keyboardShortcut?: string;
}

// Context for sharing hover card state
interface HoverCardContextValue {
  keyboardAccessible: boolean;
  showArrow: boolean;
}

const HoverCardContext = React.createContext<HoverCardContextValue>({
  keyboardAccessible: false,
  showArrow: true,
});

const useHoverCard = () => {
  return React.useContext(HoverCardContext);
};

// Enhanced HoverCard Root
const HoverCard = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Root>,
  HoverCardProps
>(
  (
    {
      openDelay = 700,
      closeDelay = 300,
      keyboardAccessible = false,
      showArrow = true,
      side,
      sideOffset,
      align,
      alignOffset,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({
        keyboardAccessible,
        showArrow,
      }),
      [keyboardAccessible, showArrow]
    );

    return (
      <HoverCardContext.Provider value={contextValue}>
        <HoverCardPrimitive.Root
          openDelay={openDelay}
          closeDelay={closeDelay}
          onOpenChange={onOpenChange}
          {...props}
        >
          {children}
        </HoverCardPrimitive.Root>
      </HoverCardContext.Provider>
    );
  }
);

HoverCard.displayName = "HoverCard";

// Enhanced HoverCardTrigger with keyboard accessibility
const HoverCardTrigger = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>,
  HoverCardTriggerProps
>(
  (
    {
      keyboardAccessible: triggerKeyboardAccessible,
      keyboardShortcut = "Alt + ↑",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { keyboardAccessible: contextKeyboardAccessible } = useHoverCard();
    const keyboardAccessible =
      triggerKeyboardAccessible ?? contextKeyboardAccessible;
    const [showKeyboardHint, setShowKeyboardHint] = React.useState(false);

    // Enhanced keyboard support
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (keyboardAccessible && event.altKey && event.key === "ArrowUp") {
          event.preventDefault();
          // This would need custom logic to open the hover card and focus it
          // As Radix doesn't support this natively, we'd need to implement it
        }
      },
      [keyboardAccessible]
    );

    const handleFocus = React.useCallback(() => {
      if (keyboardAccessible) {
        setShowKeyboardHint(true);
      }
    }, [keyboardAccessible]);

    const handleBlur = React.useCallback(() => {
      setShowKeyboardHint(false);
    }, []);

    return (
      <div className="relative inline-block">
        <HoverCardPrimitive.Trigger
          ref={ref}
          className={cn(
            keyboardAccessible &&
              "focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
            className
          )}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        {/* Keyboard accessibility hint */}
        {keyboardAccessible && showKeyboardHint && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-sm whitespace-nowrap z-50">
            Press {keyboardShortcut} to open
          </div>
        )}
      </div>
    );
  }
);

HoverCardTrigger.displayName = HoverCardPrimitive.Trigger.displayName;

// Enhanced HoverCardContent with rich features
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      size = "default",
      variant = "default",
      showArrow: contentShowArrow,
      animate = false,
      maxWidth,
      maxHeight,
      scrollable = false,
      children,
      ...props
    },
    ref
  ) => {
    const { showArrow: contextShowArrow } = useHoverCard();
    const showArrow = contentShowArrow ?? contextShowArrow;

    const contentElement = (
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          hoverCardVariants({ size, variant }),
          scrollable && "overflow-y-auto",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        style={{
          maxWidth: maxWidth || undefined,
          maxHeight: maxHeight || undefined,
        }}
        {...props}
      >
        {children}
        {showArrow && (
          <HoverCardPrimitive.Arrow className="fill-popover stroke-border stroke-1" />
        )}
      </HoverCardPrimitive.Content>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          {contentElement}
        </motion.div>
      );
    }

    return contentElement;
  }
);

HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

// HoverCard Header component
const HoverCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    avatar?: string | React.ReactNode;
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
  }
>(({ className, avatar, title, subtitle, badge, actions, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start gap-3 mb-3", className)}
    {...props}
  >
    {/* Avatar */}
    {avatar && (
      <div className="flex-shrink-0">
        {typeof avatar === "string" ? (
          <img
            src={avatar}
            alt={title}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          avatar
        )}
      </div>
    )}

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
        )}
      </div>
    </div>
  </div>
));

HoverCardHeader.displayName = "HoverCardHeader";

// HoverCard Stats component
const HoverCardStats = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    stats: Array<{
      label: string;
      value: string | number;
      icon?: React.ElementType;
    }>;
  }
>(({ className, stats, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-between items-center py-2 border-t border-border",
      className
    )}
    {...props}
  >
    {stats.map((stat, index) => (
      <div key={index} className="text-center">
        <div className="flex items-center justify-center gap-1">
          {stat.icon && <stat.icon className="h-3 w-3 text-muted-foreground" />}
          <span className="font-semibold text-sm">{stat.value}</span>
        </div>
        <span className="text-xs text-muted-foreground">{stat.label}</span>
      </div>
    ))}
  </div>
));

HoverCardStats.displayName = "HoverCardStats";

// Preset HoverCard components for common use cases
const UserHoverCard: React.FC<{
  children: React.ReactNode;
  user: {
    name: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinDate?: string;
    verified?: boolean;
    stats?: {
      followers?: number;
      following?: number;
      posts?: number;
    };
  };
}> = ({ children, user }) => (
  <HoverCard>
    <HoverCardTrigger asChild>{children}</HoverCardTrigger>
    <HoverCardContent size="lg">
      <HoverCardHeader
        avatar={user.avatar}
        title={user.name}
        subtitle={user.username ? `@${user.username}` : undefined}
        badge={
          user.verified && <CheckCircle className="h-4 w-4 text-blue-500" />
        }
      />

      {user.bio && <p className="text-sm mb-3 leading-relaxed">{user.bio}</p>}

      <div className="space-y-2 mb-3">
        {user.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{user.location}</span>
          </div>
        )}

        {user.website && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {user.website}
            </a>
          </div>
        )}

        {user.joinDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Joined {user.joinDate}</span>
          </div>
        )}
      </div>

      {user.stats && (
        <HoverCardStats
          stats={[
            ...(user.stats.followers !== undefined
              ? [
                  {
                    label: "Followers",
                    value: user.stats.followers.toLocaleString(),
                    icon: Users,
                  },
                ]
              : []),
            ...(user.stats.following !== undefined
              ? [
                  {
                    label: "Following",
                    value: user.stats.following.toLocaleString(),
                    icon: User,
                  },
                ]
              : []),
            ...(user.stats.posts !== undefined
              ? [
                  {
                    label: "Posts",
                    value: user.stats.posts.toLocaleString(),
                    icon: MessageCircle,
                  },
                ]
              : []),
          ]}
        />
      )}
    </HoverCardContent>
  </HoverCard>
);

const LinkPreviewCard: React.FC<{
  children: React.ReactNode;
  preview: {
    title: string;
    description?: string;
    image?: string;
    domain: string;
    url: string;
  };
}> = ({ children, preview }) => (
  <HoverCard>
    <HoverCardTrigger asChild>{children}</HoverCardTrigger>
    <HoverCardContent size="lg">
      {preview.image && (
        <img
          src={preview.image}
          alt={preview.title}
          className="w-full h-32 object-cover rounded-md mb-3"
        />
      )}

      <div className="space-y-2">
        <h3 className="font-semibold text-sm leading-tight">{preview.title}</h3>

        {preview.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {preview.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3 w-3" />
            <span>{preview.domain}</span>
          </div>

          <a
            href={preview.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Visit <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

const StatusHoverCard: React.FC<{
  children: React.ReactNode;
  status: {
    type: "success" | "warning" | "error" | "info";
    title: string;
    message: string;
    timestamp?: string;
    details?: string;
  };
}> = ({ children, status }) => {
  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
    info: Info,
  };

  const colors = {
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    info: "text-blue-600",
  };

  const Icon = icons[status.type];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent>
        <div className="flex items-start gap-3">
          <Icon className={cn("h-5 w-5 mt-0.5", colors[status.type])} />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{status.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
              {status.message}
            </p>

            {status.details && (
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                {status.details}
              </p>
            )}

            {status.timestamp && (
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {status.timestamp}
                </span>
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardStats,
  UserHoverCard,
  LinkPreviewCard,
  StatusHoverCard,
  useHoverCard,
  type HoverCardProps,
  type HoverCardContentProps,
  type HoverCardTriggerProps,
};
