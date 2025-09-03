import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GripHorizontal,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ArrowDown,
  ArrowUp,
  Settings,
  Share2,
  Download,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Minus,
  Star,
  Heart,
  Bookmark,
  Flag,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  FileText,
  Image,
  Video,
  Filter,
  Search,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced drawer variants
const drawerVariants = cva("fixed z-50 flex flex-col bg-background", {
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
      right:
        "inset-y-0 right-0 h-full w-3/4 border-l data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
      xl: "",
      full: "",
    },
  },
  compoundVariants: [
    // Bottom drawer sizes
    {
      side: "bottom",
      size: "sm",
      class: "h-1/3",
    },
    {
      side: "bottom",
      size: "default",
      class: "h-1/2",
    },
    {
      side: "bottom",
      size: "lg",
      class: "h-2/3",
    },
    {
      side: "bottom",
      size: "xl",
      class: "h-3/4",
    },
    {
      side: "bottom",
      size: "full",
      class: "h-full",
    },
    // Top drawer sizes
    {
      side: "top",
      size: "sm",
      class: "h-1/3",
    },
    {
      side: "top",
      size: "default",
      class: "h-1/2",
    },
    {
      side: "top",
      size: "lg",
      class: "h-2/3",
    },
    {
      side: "top",
      size: "xl",
      class: "h-3/4",
    },
    {
      side: "top",
      size: "full",
      class: "h-full",
    },
    // Left/Right drawer sizes
    {
      side: ["left", "right"],
      size: "sm",
      class: "max-w-xs",
    },
    {
      side: ["left", "right"],
      size: "default",
      class: "max-w-sm",
    },
    {
      side: ["left", "right"],
      size: "lg",
      class: "max-w-md",
    },
    {
      side: ["left", "right"],
      size: "xl",
      class: "max-w-lg",
    },
    {
      side: ["left", "right"],
      size: "full",
      class: "max-w-none w-full",
    },
  ],
  defaultVariants: {
    side: "bottom",
    size: "default",
  },
});

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
interface DrawerProps
  extends React.ComponentProps<typeof DrawerPrimitive.Root> {
  shouldScaleBackground?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "default" | "lg" | "xl" | "full";
  blur?: "none" | "sm" | "md" | "lg";
  snapPoints?: (string | number)[];
  fadeFromIndex?: number;
  modal?: boolean;
  dismissible?: boolean;
  onClose?: () => void;
  preventScrollRestoration?: boolean;
}

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
    Pick<DrawerProps, "side" | "size"> {
  showHandle?: boolean;
  handlePosition?: "top" | "bottom" | "left" | "right";
  showCloseButton?: boolean;
  loading?: boolean;
  scrollable?: boolean;
  maxHeight?: string;
  minHeight?: string;
}

interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  actions?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  showHandle?: boolean;
}

interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
  orientation?: "horizontal" | "vertical";
  sticky?: boolean;
}

// Context for sharing drawer state
interface DrawerContextValue {
  side: string;
  size: string;
  snapPoints?: (string | number)[];
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

const useDrawer = () => {
  const context = React.useContext(DrawerContext);
  return context || { side: "bottom", size: "default" };
};

// Enhanced Drawer Root
const Drawer = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Root>,
  DrawerProps
>(
  (
    {
      shouldScaleBackground = true,
      side = "bottom",
      size = "default",
      blur = "none",
      snapPoints,
      fadeFromIndex,
      modal = true,
      dismissible = true,
      onClose,
      preventScrollRestoration = true,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({
        side,
        size,
        snapPoints,
      }),
      [side, size, snapPoints]
    );

    return (
      <DrawerContext.Provider value={contextValue}>
        <DrawerPrimitive.Root
          shouldScaleBackground={shouldScaleBackground}
          snapPoints={snapPoints}
          fadeFromIndex={fadeFromIndex}
          modal={modal}
          dismissible={dismissible}
          onClose={onClose}
          preventScrollRestoration={preventScrollRestoration}
          {...props}
        >
          {children}
        </DrawerPrimitive.Root>
      </DrawerContext.Provider>
    );
  }
);

Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

// Enhanced DrawerOverlay with blur effects
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & {
    blur?: VariantProps<typeof overlayVariants>["blur"];
  }
>(({ className, blur = "none", ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(overlayVariants({ blur }), className)}
    {...props}
  />
));

DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

// Enhanced DrawerContent with rich features
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      side = "bottom",
      size = "default",
      showHandle = true,
      handlePosition,
      showCloseButton = false,
      loading = false,
      scrollable = false,
      maxHeight,
      minHeight,
      ...props
    },
    ref
  ) => {
    const { side: contextSide } = useDrawer();
    const actualSide = side || contextSide;

    // Determine handle position based on drawer side
    const getHandlePosition = () => {
      if (handlePosition) return handlePosition;
      switch (actualSide) {
        case "top":
          return "bottom";
        case "bottom":
          return "top";
        case "left":
          return "right";
        case "right":
          return "left";
        default:
          return "top";
      }
    };

    const getHandleClasses = () => {
      const position = getHandlePosition();
      switch (position) {
        case "top":
          return "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted";
        case "bottom":
          return "mx-auto mb-4 h-2 w-[100px] rounded-full bg-muted";
        case "left":
          return "my-auto ml-4 w-2 h-[100px] rounded-full bg-muted";
        case "right":
          return "my-auto mr-4 w-2 h-[100px] rounded-full bg-muted";
        default:
          return "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted";
      }
    };

    const getBorderRadius = () => {
      switch (actualSide) {
        case "top":
          return "rounded-b-[10px]";
        case "bottom":
          return "rounded-t-[10px]";
        case "left":
          return "rounded-r-[10px]";
        case "right":
          return "rounded-l-[10px]";
        default:
          return "rounded-t-[10px]";
      }
    };

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            drawerVariants({ side: actualSide, size }),
            getBorderRadius(),
            actualSide === "bottom" && "mt-24",
            actualSide === "top" && "mb-24",
            className
          )}
          style={{
            maxHeight,
            minHeight,
            ...(scrollable ? { overflow: "hidden" } : {}),
          }}
          {...props}
        >
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-[inherit]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            </div>
          )}

          {/* Handle */}
          {showHandle && getHandlePosition() === "top" && (
            <div className={getHandleClasses()} />
          )}

          {/* Close button */}
          {showCloseButton && (
            <DrawerClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DrawerClose>
          )}

          {/* Scrollable content wrapper */}
          <div className={cn("flex-1", scrollable && "overflow-y-auto")}>
            {children}
          </div>

          {/* Handle for other positions */}
          {showHandle && getHandlePosition() !== "top" && (
            <div className={getHandleClasses()} />
          )}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  }
);

DrawerContent.displayName = "DrawerContent";

// Enhanced DrawerHeader with icons and actions
const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  (
    {
      className,
      icon: Icon,
      actions,
      subtitle,
      badge,
      showHandle = false,
      children,
      ...props
    },
    ref
  ) => {
    const { side } = useDrawer();

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-1.5 p-4",
          side === "bottom" ? "text-center sm:text-left" : "text-left",
          className
        )}
        {...props}
      >
        {/* Handle in header for bottom drawers */}
        {showHandle && side === "bottom" && (
          <div className="mx-auto mb-2 h-2 w-[100px] rounded-full bg-muted" />
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {Icon && (
              <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {children}
                {badge && <div className="flex-shrink-0">{badge}</div>}
              </div>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 ml-4">{actions}</div>
          )}
        </div>
      </div>
    );
  }
);

DrawerHeader.displayName = "DrawerHeader";

// Enhanced DrawerFooter with flexible layout
const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
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
          "flex gap-2 p-4",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          orientation === "horizontal"
            ? justifyClasses[justify]
            : "items-stretch",
          orientation === "vertical" && "space-y-2",
          sticky &&
            "sticky bottom-0 bg-background border-t -mx-4 -mb-4 px-4 pb-4",
          "mt-auto",
          className
        )}
        {...props}
      />
    );
  }
);

DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
>(({ className, as: Comp = "h2", ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    asChild
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    <Comp {...props} />
  </DrawerPrimitive.Title>
));

DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// Handle component for custom handle positioning
const DrawerHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ className, orientation = "horizontal", ...props }, ref) => {
  const { side } = useDrawer();

  // Auto-detect orientation based on drawer side
  const actualOrientation =
    orientation === "horizontal" || ["top", "bottom"].includes(side)
      ? "horizontal"
      : "vertical";

  return (
    <div
      ref={ref}
      className={cn(
        "flex-shrink-0 bg-muted rounded-full transition-colors hover:bg-muted/80",
        actualOrientation === "horizontal"
          ? "mx-auto h-2 w-[100px]"
          : "my-auto w-2 h-[100px]",
        className
      )}
      {...props}
    />
  );
});

DrawerHandle.displayName = "DrawerHandle";

// Snap point component for visual indicators
const DrawerSnapPoints = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    snapPoints: (string | number)[];
    currentIndex?: number;
  }
>(({ className, snapPoints, currentIndex = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-1 p-2", className)}
    {...props}
  >
    {snapPoints.map((_, index) => (
      <div
        key={index}
        className={cn(
          "w-2 h-2 rounded-full transition-colors",
          index === currentIndex ? "bg-primary" : "bg-muted"
        )}
      />
    ))}
  </div>
));

DrawerSnapPoints.displayName = "DrawerSnapPoints";

// Preset Drawer components for common use cases
const BottomSheet: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}> = ({ open, onOpenChange, title, description, children, snapPoints }) => (
  <Drawer open={open} onOpenChange={onOpenChange} snapPoints={snapPoints}>
    <DrawerContent>
      {(title || description) && (
        <DrawerHeader showHandle={!snapPoints}>
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
      )}
      {children}
    </DrawerContent>
  </Drawer>
);

const SideDrawer: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "left" | "right";
  size?: "sm" | "default" | "lg" | "xl" | "full";
  title?: string;
  children: React.ReactNode;
}> = ({
  open,
  onOpenChange,
  side = "left",
  size = "default",
  title,
  children,
}) => (
  <Drawer open={open} onOpenChange={onOpenChange} side={side} size={size}>
    <DrawerContent showHandle={false} showCloseButton>
      {title && (
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
      )}
      {children}
    </DrawerContent>
  </Drawer>
);

const ActionSheet: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  actions: Array<{
    label: string;
    icon?: React.ElementType;
    variant?: "default" | "destructive";
    onSelect: () => void;
  }>;
}> = ({ open, onOpenChange, title, actions }) => (
  <BottomSheet open={open} onOpenChange={onOpenChange} title={title}>
    <div className="p-4 space-y-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => {
            action.onSelect();
            onOpenChange?.(false);
          }}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
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
  </BottomSheet>
);

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerHandle,
  DrawerSnapPoints,
  BottomSheet,
  SideDrawer,
  ActionSheet,
  useDrawer,
  type DrawerProps,
  type DrawerContentProps,
  type DrawerHeaderProps,
  type DrawerFooterProps,
};
