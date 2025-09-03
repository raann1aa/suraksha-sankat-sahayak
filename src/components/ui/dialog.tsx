import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  HelpCircle,
  Settings,
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  FileText,
  Image,
  Video,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  Archive,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Search,
  Filter,
  Plus,
  Minus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced dialog variants
const dialogVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200",
  {
    variants: {
      size: {
        sm: "max-w-sm p-4",
        default: "max-w-lg p-6",
        lg: "max-w-2xl p-6",
        xl: "max-w-4xl p-8",
        "2xl": "max-w-6xl p-8",
        full: "w-[95vw] h-[95vh] max-w-none p-6",
        auto: "max-w-fit p-6",
      },
      variant: {
        default: "rounded-lg",
        card: "rounded-xl border-2",
        minimal: "border-0 shadow-2xl rounded-lg",
        fullscreen: "w-screen h-screen max-w-none rounded-none p-0",
      },
      centered: {
        true: "items-center",
        false: "items-start pt-[10vh]",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      centered: true,
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
interface DialogProps
  extends React.ComponentProps<typeof DialogPrimitive.Root> {
  size?: VariantProps<typeof dialogVariants>["size"];
  variant?: VariantProps<typeof dialogVariants>["variant"];
  centered?: boolean;
  blur?: VariantProps<typeof overlayVariants>["blur"];
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  closeButtonPosition?: "inside" | "outside";
  modal?: boolean;
  preventScroll?: boolean;
  animate?: boolean;
  fullscreen?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    Pick<
      DialogProps,
      | "size"
      | "variant"
      | "centered"
      | "showCloseButton"
      | "closeButtonPosition"
      | "animate"
      | "fullscreen"
      | "resizable"
      | "draggable"
    > {
  loading?: boolean;
  maxHeight?: string;
  scrollable?: boolean;
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  actions?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
  orientation?: "horizontal" | "vertical";
  sticky?: boolean;
}

// Context for sharing dialog state
interface DialogContextValue {
  size: string;
  variant: string;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  return (
    context || {
      size: "default",
      variant: "default",
      fullscreen: false,
      setFullscreen: () => {},
    }
  );
};

// Enhanced Dialog Root
const Dialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Root>,
  DialogProps
>(
  (
    {
      size = "default",
      variant = "default",
      centered = true,
      blur = "none",
      closeOnOutsideClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      closeButtonPosition = "inside",
      modal = true,
      preventScroll = true,
      animate = false,
      fullscreen: propFullscreen = false,
      resizable = false,
      draggable = false,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    const [fullscreen, setFullscreen] = React.useState(propFullscreen);

    const contextValue = React.useMemo(
      () => ({
        size,
        variant,
        fullscreen,
        setFullscreen,
      }),
      [size, variant, fullscreen]
    );

    return (
      <DialogContext.Provider value={contextValue}>
        <DialogPrimitive.Root
          modal={modal}
          onOpenChange={onOpenChange}
          {...props}
        >
          {children}
        </DialogPrimitive.Root>
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = DialogPrimitive.Root.displayName;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

// Enhanced DialogOverlay with blur effects
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    blur?: VariantProps<typeof overlayVariants>["blur"];
    animate?: boolean;
  }
>(({ className, blur = "none", animate = false, ...props }, ref) => {
  const overlayContent = (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        overlayVariants({ blur }),
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {overlayContent}
      </motion.div>
    );
  }

  return overlayContent;
});

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Enhanced DialogContent with rich features
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = "default",
      variant = "default",
      centered = true,
      showCloseButton = true,
      closeButtonPosition = "inside",
      animate = false,
      fullscreen = false,
      loading = false,
      maxHeight,
      scrollable = false,
      resizable = false,
      draggable = false,
      ...props
    },
    ref
  ) => {
    const { fullscreen: contextFullscreen, setFullscreen } = useDialog();
    const isFullscreen = fullscreen || contextFullscreen;

    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });

    const contentRef = React.useRef<HTMLDivElement>(null);

    // Handle dragging
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (!draggable || isFullscreen) return;

        const rect = contentRef.current?.getBoundingClientRect();
        if (rect) {
          setIsDragging(true);
          setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      },
      [draggable, isFullscreen]
    );

    React.useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (contentRef.current) {
          const x = e.clientX - dragOffset.x;
          const y = e.clientY - dragOffset.y;
          contentRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, dragOffset]);

    const dialogContent = (
      <DialogPortal>
        <DialogOverlay animate={animate} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            dialogVariants({
              size: isFullscreen ? "full" : size,
              variant: isFullscreen ? "fullscreen" : variant,
              centered,
            }),
            scrollable && "overflow-hidden",
            draggable && !isFullscreen && "cursor-move",
            resizable && "resize",
            loading && "pointer-events-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
            className
          )}
          style={{
            maxHeight,
            ...(isDragging ? { transform: "none" } : {}),
          }}
          onMouseDown={handleMouseDown}
          {...props}
        >
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            </div>
          )}

          {/* Scrollable content wrapper */}
          <div className={cn("h-full", scrollable && "overflow-y-auto")}>
            {children}
          </div>

          {/* Close button */}
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                "absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                closeButtonPosition === "inside"
                  ? "right-4 top-4 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  : "right-[-12px] top-[-12px] bg-background border border-border shadow-md hover:bg-accent"
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}

          {/* Fullscreen toggle */}
          {!isFullscreen && (
            <button
              onClick={() => setFullscreen(true)}
              className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Maximize</span>
            </button>
          )}

          {isFullscreen && (
            <button
              onClick={() => setFullscreen(false)}
              className="absolute right-12 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </button>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {dialogContent}
        </motion.div>
      );
    }

    return dialogContent;
  }
);

DialogContent.displayName = DialogPrimitive.Content.displayName;

// Enhanced DialogHeader with icons and actions
const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  (
    { className, icon: Icon, actions, subtitle, badge, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    >
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
  )
);

DialogHeader.displayName = "DialogHeader";

// Enhanced DialogFooter with flexible layout
const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
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
          orientation === "horizontal" ? "flex-row" : "flex-col",
          orientation === "horizontal"
            ? justifyClasses[justify]
            : "items-stretch",
          orientation === "vertical" && "space-y-2",
          sticky &&
            "sticky bottom-0 bg-background border-t pt-4 -mx-6 px-6 -mb-6",
          orientation === "horizontal" &&
            "flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
          className
        )}
        {...props}
      />
    );
  }
);

DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  }
>(({ className, as: Comp = "h2", ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    asChild
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    <Comp {...props} />
  </DialogPrimitive.Title>
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Preset Dialog components for common use cases
const AlertDialog: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  type?: "info" | "warning" | "error" | "success";
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}> = ({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: XCircle,
    success: CheckCircle,
  };

  const Icon = icons[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader icon={Icon}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {onCancel && (
            <DialogClose asChild>
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded hover:bg-muted/80"
              >
                {cancelText}
              </button>
            </DialogClose>
          )}
          <DialogClose asChild>
            <button
              onClick={onConfirm}
              className={cn(
                "px-4 py-2 text-sm rounded font-medium",
                type === "error"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {confirmText}
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ConfirmDialog: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  destructive?: boolean;
}> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  destructive = false,
}) => (
  <AlertDialog
    open={open}
    onOpenChange={onOpenChange}
    title={title}
    description={description}
    type={destructive ? "error" : "info"}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText={destructive ? "Delete" : "Confirm"}
    cancelText="Cancel"
  />
);

const LoadingDialog: React.FC<{
  open?: boolean;
  title?: string;
  description?: string;
}> = ({
  open,
  title = "Loading...",
  description = "Please wait while we process your request.",
}) => (
  <Dialog open={open}>
    <DialogContent size="sm" showCloseButton={false}>
      <div className="flex items-center gap-4 py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  AlertDialog,
  ConfirmDialog,
  LoadingDialog,
  useDialog,
  type DialogProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
};
