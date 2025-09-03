import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Settings,
  User,
  Bell,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Share2,
  Download,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced popover variants
const popoverVariants = cva(
  "z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
  {
    variants: {
      size: {
        sm: "w-64 p-3",
        default: "w-72 p-4",
        lg: "w-80 p-5",
        xl: "w-96 p-6",
        auto: "min-w-[200px] max-w-[400px] p-4",
        full: "w-screen max-w-none p-6",
      },
      variant: {
        default: "",
        minimal: "border-0 shadow-lg",
        outlined: "border-2",
        elevated: "shadow-xl border-0",
        glass: "bg-background/80 backdrop-blur-sm border-white/20",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const triggerVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 py-2",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced interfaces
interface PopoverProps
  extends React.ComponentProps<typeof PopoverPrimitive.Root> {
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  showArrow?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
    VariantProps<typeof popoverVariants> {
  showArrow?: boolean;
  showCloseButton?: boolean;
  animate?: boolean;
  maxHeight?: string;
  scrollable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

interface PopoverTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>,
    VariantProps<typeof triggerVariants> {
  icon?: React.ElementType;
  badge?: React.ReactNode;
  loading?: boolean;
  showChevron?: boolean;
  chevronPosition?: "left" | "right";
}

interface PopoverHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
}

interface PopoverFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
  orientation?: "horizontal" | "vertical";
}

// Context for sharing popover state
interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  triggerId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

const usePopover = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a Popover component");
  }
  return context;
};

// Enhanced Popover Root with accessibility improvements[288][292]
const Popover = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Root>,
  PopoverProps
>(
  (
    {
      trigger,
      content,
      side = "bottom",
      align = "center",
      sideOffset = 4,
      alignOffset = 0,
      showArrow = false,
      closeOnOutsideClick = true,
      closeOnEscape = true,
      modal = false,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const contentId = React.useId();
    const triggerId = React.useId();

    const handleOpenChange = React.useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen);
        onOpenChange?.(newOpen);
      },
      [onOpenChange]
    );

    const contextValue = React.useMemo(
      () => ({
        open,
        onOpenChange: handleOpenChange,
        contentId,
        triggerId,
      }),
      [open, handleOpenChange, contentId, triggerId]
    );

    if (trigger && content) {
      return (
        <PopoverContext.Provider value={contextValue}>
          <PopoverPrimitive.Root
            ref={ref}
            open={open}
            onOpenChange={handleOpenChange}
            modal={modal}
            {...props}
          >
            <PopoverPrimitive.Trigger asChild>
              {trigger}
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Content
              side={side}
              align={align}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
              className={cn(popoverVariants())}
            >
              {content}
              {showArrow && <PopoverPrimitive.Arrow className="fill-popover" />}
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Root>
        </PopoverContext.Provider>
      );
    }

    return (
      <PopoverContext.Provider value={contextValue}>
        <PopoverPrimitive.Root
          ref={ref}
          open={open}
          onOpenChange={handleOpenChange}
          modal={modal}
          {...props}
        >
          {children}
        </PopoverPrimitive.Root>
      </PopoverContext.Provider>
    );
  }
);

Popover.displayName = PopoverPrimitive.Root.displayName;

// Enhanced PopoverTrigger with rich features[288][300]
const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  PopoverTriggerProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon: Icon,
      badge,
      loading = false,
      showChevron = false,
      chevronPosition = "right",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { open, triggerId, contentId } = usePopover();

    return (
      <PopoverPrimitive.Trigger
        ref={ref}
        id={triggerId}
        className={cn(triggerVariants({ variant, size }), className)}
        disabled={disabled || loading}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? contentId : undefined}
        {...props}
      >
        <div className="flex items-center gap-2">
          {/* Left chevron */}
          {showChevron && chevronPosition === "left" && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}

          {/* Loading or Icon */}
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : Icon ? (
            <Icon className="h-4 w-4" />
          ) : null}

          {/* Content */}
          <span className="flex-1">{children}</span>

          {/* Badge */}
          {badge && <div className="ml-1">{badge}</div>}

          {/* Right chevron */}
          {showChevron && chevronPosition === "right" && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}
        </div>
      </PopoverPrimitive.Trigger>
    );
  }
);

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

// Enhanced PopoverContent with comprehensive features[287][289]
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      size = "default",
      variant = "default",
      showArrow = false,
      showCloseButton = false,
      animate = false,
      maxHeight,
      scrollable = false,
      header,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const { contentId, onOpenChange } = usePopover();

    const contentElement = (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          id={contentId}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            popoverVariants({ size, variant }),
            scrollable && "overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          style={{ maxHeight }}
          role="dialog"
          aria-modal="false"
          {...props}
        >
          {/* Header */}
          {header && <div className="mb-4">{header}</div>}

          {/* Close button */}
          {showCloseButton && (
            <PopoverPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </PopoverPrimitive.Close>
          )}

          {/* Scrollable content wrapper */}
          <div
            className={cn(
              scrollable && "overflow-y-auto max-h-[300px]",
              (header || footer) && scrollable && "flex-1"
            )}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-4 pt-4 border-t border-border">{footer}</div>
          )}

          {/* Arrow */}
          {showArrow && (
            <PopoverPrimitive.Arrow className="fill-popover stroke-border stroke-1" />
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
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

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// PopoverHeader component for consistent header styling[295]
const PopoverHeader = React.forwardRef<HTMLDivElement, PopoverHeaderProps>(
  (
    {
      className,
      title,
      description,
      icon: Icon,
      actions,
      showCloseButton = false,
      children,
      ...props
    },
    ref
  ) => {
    const { onOpenChange } = usePopover();

    return (
      <div
        ref={ref}
        className={cn("flex items-start justify-between", className)}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {Icon && (
            <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="font-semibold text-sm leading-none tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {actions}
          {showCloseButton && (
            <PopoverPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </PopoverPrimitive.Close>
          )}
        </div>
      </div>
    );
  }
);

PopoverHeader.displayName = "PopoverHeader";

// PopoverFooter component for consistent footer styling
const PopoverFooter = React.forwardRef<HTMLDivElement, PopoverFooterProps>(
  (
    { className, justify = "end", orientation = "horizontal", ...props },
    ref
  ) => {
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          orientation === "horizontal" ? "flex-row" : "flex-col items-stretch",
          orientation === "horizontal" && justifyClasses[justify],
          className
        )}
        {...props}
      />
    );
  }
);

PopoverFooter.displayName = "PopoverFooter";

// PopoverClose component for explicit close actions
const PopoverClose = PopoverPrimitive.Close;

// Preset Popover components for common use cases
const UserPopover: React.FC<{
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ user, children, actions }) => (
  <Popover>
    <PopoverTrigger asChild>{children}</PopoverTrigger>
    <PopoverContent size="lg" showArrow>
      <PopoverHeader
        title={user.name}
        description={user.email}
        icon={User}
        actions={actions}
      />
      {user.role && (
        <div className="mt-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
            {user.role}
          </span>
        </div>
      )}
    </PopoverContent>
  </Popover>
);

const ActionPopover: React.FC<{
  children: React.ReactNode;
  actions: Array<{
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}> = ({ children, actions }) => (
  <Popover>
    <PopoverTrigger variant="ghost" size="icon">
      {children || <MoreHorizontal className="h-4 w-4" />}
    </PopoverTrigger>
    <PopoverContent size="sm">
      <div className="space-y-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              "w-full flex items-center gap-3 p-2 rounded text-sm text-left transition-colors",
              action.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10"
                : "hover:bg-accent"
            )}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </button>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

const InfoPopover: React.FC<{
  title: string;
  content: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, content, children }) => (
  <Popover>
    <PopoverTrigger variant="ghost" size="icon">
      {children || <Info className="h-4 w-4" />}
    </PopoverTrigger>
    <PopoverContent showArrow>
      <PopoverHeader title={title} icon={Info} />
      <div className="text-sm text-muted-foreground">{content}</div>
    </PopoverContent>
  </Popover>
);

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  PopoverClose,
  UserPopover,
  ActionPopover,
  InfoPopover,
  usePopover,
  type PopoverProps,
  type PopoverContentProps,
  type PopoverTriggerProps,
  type PopoverHeaderProps,
  type PopoverFooterProps,
};
