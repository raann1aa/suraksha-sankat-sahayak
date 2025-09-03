import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  GripHorizontal,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Settings,
  User,
  Bell,
  Mail,
  Calendar,
  FileText,
  Image,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  Plus,
  Minus,
  Star,
  Heart,
  Bookmark,
  Flag,
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced sheet variants
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
      size: {
        sm: "",
        default: "",
        lg: "",
        xl: "",
        full: "",
      },
      variant: {
        default: "p-6",
        compact: "p-4",
        spacious: "p-8",
        minimal: "p-0",
      },
    },
    compoundVariants: [
      // Horizontal sheets (top/bottom)
      {
        side: ["top", "bottom"],
        size: "sm",
        class: "h-1/3",
      },
      {
        side: ["top", "bottom"],
        size: "default",
        class: "h-1/2",
      },
      {
        side: ["top", "bottom"],
        size: "lg",
        class: "h-2/3",
      },
      {
        side: ["top", "bottom"],
        size: "xl",
        class: "h-3/4",
      },
      {
        side: ["top", "bottom"],
        size: "full",
        class: "h-full",
      },
      // Vertical sheets (left/right)
      {
        side: ["left", "right"],
        size: "sm",
        class: "w-3/4 sm:max-w-sm",
      },
      {
        side: ["left", "right"],
        size: "default",
        class: "w-3/4 sm:max-w-md",
      },
      {
        side: ["left", "right"],
        size: "lg",
        class: "w-3/4 sm:max-w-lg",
      },
      {
        side: ["left", "right"],
        size: "xl",
        class: "w-3/4 sm:max-w-2xl",
      },
      {
        side: ["left", "right"],
        size: "full",
        class: "w-full",
      },
    ],
    defaultVariants: {
      side: "right",
      size: "default",
      variant: "default",
    },
  }
);

const overlayVariants = cva("fixed inset-0 z-50 transition-all duration-100", {
  variants: {
    blur: {
      none: "bg-black/80",
      sm: "bg-black/60 backdrop-blur-sm",
      md: "bg-black/40 backdrop-blur-md",
      lg: "bg-black/20 backdrop-blur-lg",
    },
  },
  defaultVariants: {
    blur: "none",
  },
});

// Enhanced interfaces
interface SheetProps extends React.ComponentProps<typeof SheetPrimitive.Root> {
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "default" | "lg" | "xl" | "full";
  variant?: "default" | "compact" | "spacious" | "minimal";
  blur?: "none" | "sm" | "md" | "lg";
  dismissible?: boolean;
  showCloseButton?: boolean;
  closeButtonPosition?: "inside" | "outside";
  resizable?: boolean;
  draggable?: boolean;
  modal?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  preventScroll?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    Pick<
      SheetProps,
      | "side"
      | "size"
      | "variant"
      | "showCloseButton"
      | "closeButtonPosition"
      | "resizable"
      | "draggable"
    > {
  loading?: boolean;
  scrollable?: boolean;
  maxHeight?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

interface SheetTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  icon?: React.ElementType;
  badge?: React.ReactNode;
  loading?: boolean;
}

interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  sticky?: boolean;
}

interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
  orientation?: "horizontal" | "vertical";
  sticky?: boolean;
}

// Context for sharing sheet state[346][347]
interface SheetContextValue {
  side: string;
  size: string;
  onClose: () => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  return context || { side: "right", size: "default", onClose: () => {} };
};

// Enhanced Sheet Root
const Sheet = SheetPrimitive.Root;

// Enhanced SheetTrigger with variants
const SheetTrigger = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Trigger>,
  SheetTriggerProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon: Icon,
      badge,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const triggerVariants = cva(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            outline:
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          },
          size: {
            sm: "h-9 px-3",
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

    return (
      <SheetPrimitive.Trigger
        ref={ref}
        className={cn(triggerVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {Icon && !loading && <Icon className="h-4 w-4" />}
        {children}
        {badge && <div className="ml-2">{badge}</div>}
      </SheetPrimitive.Trigger>
    );
  }
);

SheetTrigger.displayName = SheetPrimitive.Trigger.displayName;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

// Enhanced SheetOverlay with blur effects[353]
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> & {
    blur?: "none" | "sm" | "md" | "lg";
  }
>(({ className, blur = "none", ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      overlayVariants({ blur }),
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));

SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// Enhanced SheetContent with comprehensive accessibility[346][353]
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      size = "default",
      variant = "default",
      className,
      children,
      showCloseButton = true,
      closeButtonPosition = "inside",
      resizable = false,
      draggable = false,
      loading = false,
      scrollable = false,
      maxHeight,
      header,
      footer,
      ...props
    },
    ref
  ) => {
    const [isResizing, setIsResizing] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => contentRef.current!, []);

    const contextValue = React.useMemo(
      () => ({
        side,
        size,
        onClose: () => {
          // This would need to be passed from parent
        },
      }),
      [side, size]
    );

    return (
      <SheetContext.Provider value={contextValue}>
        <SheetPortal>
          <SheetOverlay />
          <SheetPrimitive.Content
            ref={contentRef}
            className={cn(
              sheetVariants({ side, size, variant }),
              scrollable && "overflow-hidden",
              resizable && "resize",
              draggable && "cursor-move",
              loading && "pointer-events-none",
              className
            )}
            style={{ maxHeight }}
            role="dialog"
            aria-modal="true"
            {...props}
          >
            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              </div>
            )}

            {/* Drag handle */}
            {draggable && (
              <div
                className={cn(
                  "absolute bg-muted rounded-full transition-colors hover:bg-muted/80 cursor-move",
                  side === "top" && "top-2 left-1/2 -translate-x-1/2 w-12 h-1",
                  side === "bottom" &&
                    "bottom-2 left-1/2 -translate-x-1/2 w-12 h-1",
                  side === "left" && "left-2 top-1/2 -translate-y-1/2 w-1 h-12",
                  side === "right" &&
                    "right-2 top-1/2 -translate-y-1/2 w-1 h-12"
                )}
              >
                {["left", "right"].includes(side) ? (
                  <GripVertical className="h-4 w-4" />
                ) : (
                  <GripHorizontal className="h-4 w-4" />
                )}
              </div>
            )}

            {/* Header */}
            {header && (
              <div className="border-b border-border pb-4 mb-4">{header}</div>
            )}

            {/* Scrollable content wrapper */}
            <div
              className={cn(
                "flex-1",
                scrollable && "overflow-y-auto",
                (header || footer) && scrollable && "min-h-0"
              )}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-border pt-4 mt-4">{footer}</div>
            )}

            {/* Close button */}
            {showCloseButton && (
              <SheetPrimitive.Close
                className={cn(
                  "absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                  closeButtonPosition === "inside"
                    ? "right-4 top-4 data-[state=open]:bg-secondary"
                    : "right-[-12px] top-[-12px] bg-background border border-border shadow-md hover:bg-accent"
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}

            {/* Resize handles */}
            {resizable && (
              <>
                {side === "right" && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-border" />
                )}
                {side === "left" && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-border" />
                )}
                {side === "bottom" && (
                  <div className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-border" />
                )}
                {side === "top" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-border" />
                )}
              </>
            )}
          </SheetPrimitive.Content>
        </SheetPortal>
      </SheetContext.Provider>
    );
  }
);

SheetContent.displayName = SheetPrimitive.Content.displayName;

// Enhanced SheetHeader with comprehensive features[346][352]
const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  (
    {
      className,
      title,
      description,
      icon: Icon,
      actions,
      showCloseButton = false,
      sticky = false,
      children,
      ...props
    },
    ref
  ) => {
    const { side } = useSheet();

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-2",
          side === "top" || side === "bottom"
            ? "text-center sm:text-left"
            : "text-left",
          sticky && "sticky top-0 bg-background border-b z-10 pb-4",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {Icon && (
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              {title && (
                <SheetTitle className="text-lg font-semibold leading-none tracking-tight">
                  {title}
                </SheetTitle>
              )}
              {description && (
                <SheetDescription className="text-sm text-muted-foreground mt-2">
                  {description}
                </SheetDescription>
              )}
              {children}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {actions}
            {showCloseButton && (
              <SheetPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetPrimitive.Close>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SheetHeader.displayName = "SheetHeader";

// Enhanced SheetFooter with flexible layout
const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  (
    {
      className,
      justify = "end",
      orientation = "horizontal",
      sticky = false,
      ...props
    },
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
          orientation === "horizontal" ? justifyClasses[justify] : "",
          orientation === "vertical" && "space-y-2",
          sticky && "sticky bottom-0 bg-background border-t pt-4",
          "flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto",
          className
        )}
        {...props}
      />
    );
  }
);

SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));

SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

SheetDescription.displayName = SheetPrimitive.Description.displayName;

// Preset Sheet components for common use cases
const ActionSheet: React.FC<{
  trigger?: React.ReactNode;
  title?: string;
  actions: Array<{
    label: string;
    icon?: React.ElementType;
    variant?: "default" | "destructive";
    onClick: () => void;
  }>;
}> = ({ trigger, title, actions }) => (
  <Sheet>
    {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
    <SheetContent side="bottom" size="sm">
      <SheetHeader title={title} />
      <div className="grid gap-2 py-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md text-left transition-colors",
              action.variant === "destructive"
                ? "text-destructive hover:bg-destructive/10"
                : "hover:bg-accent"
            )}
          >
            {action.icon && <action.icon className="h-5 w-5" />}
            {action.label}
          </button>
        ))}
      </div>
    </SheetContent>
  </Sheet>
);

const SidebarSheet: React.FC<{
  children: React.ReactNode;
  side?: "left" | "right";
  trigger?: React.ReactNode;
}> = ({ children, side = "left", trigger }) => (
  <Sheet>
    {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
    <SheetContent side={side} size="sm" variant="minimal">
      <div className="h-full overflow-y-auto p-6">{children}</div>
    </SheetContent>
  </Sheet>
);

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  ActionSheet,
  SidebarSheet,
  useSheet,
  type SheetProps,
  type SheetContentProps,
  type SheetTriggerProps,
  type SheetHeaderProps,
  type SheetFooterProps,
};
