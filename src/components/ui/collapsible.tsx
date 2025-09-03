import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Minus,
  MoreHorizontal,
  MoreVertical,
  ArrowDown,
  ArrowRight,
  RotateCcw,
  X,
  Info,
  AlertCircle,
  HelpCircle,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  Bookmark,
  Heart,
  MessageCircle,
  User,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Flag,
  Zap,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced collapsible variants
const collapsibleVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      card: "border rounded-lg bg-card",
      ghost: "bg-transparent",
      filled: "bg-muted/50 rounded-lg",
      outline: "border border-dashed rounded-lg",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const triggerVariants = cva(
  "flex w-full items-center justify-between transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "hover:bg-accent/50 p-2 rounded-md",
        button:
          "bg-background border hover:bg-accent px-4 py-2 rounded-md font-medium",
        ghost: "hover:bg-accent/30 p-2 rounded-md",
        minimal: "hover:opacity-75 py-1",
        card: "p-4 border-b hover:bg-accent/20",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

const contentVariants = cva("overflow-hidden transition-all duration-200", {
  variants: {
    variant: {
      default: "",
      padded: "p-4",
      indented: "pl-6 pr-2",
      card: "px-4 pb-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Enhanced Collapsible interfaces
interface CollapsibleProps
  extends React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>,
    VariantProps<typeof collapsibleVariants> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  badge?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  animate?: boolean;
  duration?: number;
  easing?: "linear" | "ease" | "easeIn" | "easeOut" | "easeInOut";
  startCollapsed?: boolean;
  persistState?: boolean;
  storageKey?: string;
  onToggle?: (isOpen: boolean) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
}

interface CollapsibleTriggerProps
  extends React.ComponentPropsWithoutRef<
      typeof CollapsiblePrimitive.CollapsibleTrigger
    >,
    VariantProps<typeof triggerVariants> {
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  showExpandIcon?: boolean;
  expandIcon?: React.ElementType;
  collapseIcon?: React.ElementType;
  rotateIcon?: boolean;
  loading?: boolean;
  badge?: React.ReactNode;
  description?: string;
}

interface CollapsibleContentProps
  extends React.ComponentPropsWithoutRef<
      typeof CollapsiblePrimitive.CollapsibleContent
    >,
    VariantProps<typeof contentVariants> {
  animate?: boolean;
  maxHeight?: string | number;
  scrollable?: boolean;
}

// Context for sharing state between components
interface CollapsibleContextValue {
  isOpen: boolean;
  toggle: () => void;
  disabled: boolean;
  loading: boolean;
  animate: boolean;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(
  null
);

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      "useCollapsible must be used within a Collapsible component"
    );
  }
  return context;
};

// Enhanced Collapsible Root
const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      icon: Icon,
      badge,
      loading = false,
      disabled = false,
      animate = false,
      duration = 200,
      easing = "easeOut",
      startCollapsed = true,
      persistState = false,
      storageKey,
      onToggle,
      children,
      trigger,
      triggerClassName,
      contentClassName,
      open: controlledOpen,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    // State management with persistence
    const getInitialState = () => {
      if (controlledOpen !== undefined) return controlledOpen;
      if (persistState && storageKey) {
        const stored = localStorage.getItem(storageKey);
        return stored !== null ? JSON.parse(stored) : !startCollapsed;
      }
      return !startCollapsed;
    };

    const [internalOpen, setInternalOpen] = React.useState(getInitialState);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const toggle = React.useCallback(() => {
      if (disabled || loading) return;

      const newOpen = !isOpen;

      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }

      // Persist state if enabled
      if (persistState && storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(newOpen));
      }

      onOpenChange?.(newOpen);
      onToggle?.(newOpen);
    }, [
      disabled,
      loading,
      isOpen,
      controlledOpen,
      onOpenChange,
      onToggle,
      persistState,
      storageKey,
    ]);

    const contextValue = React.useMemo(
      () => ({
        isOpen,
        toggle,
        disabled,
        loading,
        animate,
      }),
      [isOpen, toggle, disabled, loading, animate]
    );

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <CollapsiblePrimitive.Root
          ref={ref}
          className={cn(collapsibleVariants({ variant, size }), className)}
          open={isOpen}
          onOpenChange={onOpenChange || toggle}
          disabled={disabled}
          {...props}
        >
          {/* Default trigger if title is provided */}
          {title && !trigger && (
            <CollapsibleTrigger className={triggerClassName}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {Icon && (
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{title}</span>
                    {badge && <div className="flex-shrink-0">{badge}</div>}
                    {loading && (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                  </div>
                  {description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
          )}

          {/* Custom trigger */}
          {trigger}

          {/* Content */}
          <CollapsibleContent className={contentClassName}>
            {children}
          </CollapsibleContent>
        </CollapsiblePrimitive.Root>
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = "Collapsible";

// Enhanced Collapsible Trigger
const CollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(
  (
    {
      className,
      variant,
      disabled: propDisabled,
      icon: Icon,
      iconPosition = "left",
      showExpandIcon = true,
      expandIcon: ExpandIcon = ChevronDown,
      collapseIcon: CollapseIcon,
      rotateIcon = true,
      loading: propLoading,
      badge,
      description,
      children,
      ...props
    },
    ref
  ) => {
    const {
      isOpen,
      toggle,
      disabled: contextDisabled,
      loading: contextLoading,
    } = useCollapsible();

    const disabled = propDisabled || contextDisabled;
    const loading = propLoading || contextLoading;
    const ActualCollapseIcon = CollapseIcon || ExpandIcon;

    return (
      <CollapsiblePrimitive.CollapsibleTrigger
        ref={ref}
        className={cn(triggerVariants({ variant, disabled }), className)}
        disabled={disabled || loading}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-disabled={disabled || loading}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Left icon */}
          {Icon && iconPosition === "left" && (
            <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-2">
              {children && <span className="truncate">{children}</span>}
              {badge && <div className="flex-shrink-0">{badge}</div>}
              {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>

          {/* Right icon */}
          {Icon && iconPosition === "right" && (
            <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>

        {/* Expand/Collapse icon */}
        {showExpandIcon && (
          <div className="flex-shrink-0">
            {isOpen ? (
              <ActualCollapseIcon
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  rotateIcon && !CollapseIcon && "rotate-180"
                )}
              />
            ) : (
              <ExpandIcon className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
            )}
          </div>
        )}
      </CollapsiblePrimitive.CollapsibleTrigger>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

// Enhanced Collapsible Content
const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(
  (
    {
      className,
      variant,
      animate: propAnimate,
      maxHeight,
      scrollable = false,
      children,
      ...props
    },
    ref
  ) => {
    const { isOpen, animate: contextAnimate } = useCollapsible();
    const animate = propAnimate ?? contextAnimate;

    if (animate) {
      return (
        <CollapsiblePrimitive.CollapsibleContent
          ref={ref}
          className={cn(
            contentVariants({ variant }),
            scrollable && "overflow-y-auto",
            className
          )}
          style={{ maxHeight: maxHeight }}
          forceMount
          {...props}
        >
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                  opacity: { duration: 0.15 },
                }}
                style={{ overflow: "hidden" }}
              >
                <div className="pb-1">{children}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsiblePrimitive.CollapsibleContent>
      );
    }

    return (
      <CollapsiblePrimitive.CollapsibleContent
        ref={ref}
        className={cn(
          contentVariants({ variant }),
          scrollable && "overflow-y-auto",
          // Use CSS animations with Radix's data attributes
          "data-[state=open]:animate-in data-[state=open]:slide-down-1",
          "data-[state=closed]:animate-out data-[state=closed]:slide-up-1",
          className
        )}
        style={{ maxHeight: maxHeight }}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.CollapsibleContent>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";

// Collapsible Group for managing multiple related collapsibles
interface CollapsibleGroupProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
}

const CollapsibleGroup = React.forwardRef<
  HTMLDivElement,
  CollapsibleGroupProps
>(
  (
    {
      children,
      type = "multiple",
      defaultValue,
      value,
      onValueChange,
      className,
      spacing = "sm",
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(
      Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
        ? [defaultValue]
        : []
    );

    const currentValue = React.useMemo(() => {
      if (value !== undefined) {
        return Array.isArray(value) ? value : [value];
      }
      return internalValue;
    }, [value, internalValue]);

    const handleValueChange = React.useCallback(
      (itemValue: string, isOpen: boolean) => {
        let newValue: string[];

        if (type === "single") {
          newValue = isOpen ? [itemValue] : [];
        } else {
          newValue = isOpen
            ? [...currentValue, itemValue]
            : currentValue.filter((v) => v !== itemValue);
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }

        if (type === "single") {
          onValueChange?.(newValue[0] || "");
        } else {
          onValueChange?.(newValue);
        }
      },
      [type, currentValue, value, onValueChange]
    );

    const spacingClasses = {
      none: "space-y-0",
      sm: "space-y-1",
      md: "space-y-2",
      lg: "space-y-4",
    };

    return (
      <div ref={ref} className={cn(spacingClasses[spacing], className)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.type === Collapsible) {
            const itemValue = child.props.value || `item-${index}`;
            const isOpen = currentValue.includes(itemValue);

            return React.cloneElement(child, {
              open: isOpen,
              onOpenChange: (open: boolean) => {
                child.props.onOpenChange?.(open);
                handleValueChange(itemValue, open);
              },
            });
          }
          return child;
        })}
      </div>
    );
  }
);

CollapsibleGroup.displayName = "CollapsibleGroup";

// Preset Collapsible components
const FAQItem: React.FC<{
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ question, answer, defaultOpen = false }) => (
  <Collapsible variant="card" startCollapsed={!defaultOpen} animate>
    <CollapsibleTrigger>
      <span className="text-left font-medium">{question}</span>
    </CollapsibleTrigger>
    <CollapsibleContent variant="card">
      <div className="text-sm text-muted-foreground leading-relaxed">
        {answer}
      </div>
    </CollapsibleContent>
  </Collapsible>
);

const SettingsSection: React.FC<{
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, description, icon, children, defaultOpen = false }) => (
  <Collapsible
    variant="outline"
    title={title}
    description={description}
    icon={icon}
    startCollapsed={!defaultOpen}
    animate
  >
    <CollapsibleContent variant="padded">{children}</CollapsibleContent>
  </Collapsible>
);

const InfoPanel: React.FC<{
  title: string;
  type?: "info" | "warning" | "success" | "error";
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({ title, type = "info", children, dismissible = false, onDismiss }) => {
  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
    error: X,
  };

  const variants = {
    info: "border-blue-200 bg-blue-50",
    warning: "border-yellow-200 bg-yellow-50",
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
  };

  return (
    <Collapsible className={cn("border rounded-lg", variants[type])}>
      <CollapsibleTrigger variant="minimal">
        <div className="flex items-center gap-2 text-left">
          {React.createElement(icons[type], { className: "w-4 h-4" })}
          <span className="font-medium">{title}</span>
        </div>
        {dismissible && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="p-1 hover:bg-black/10 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent variant="padded">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  CollapsibleGroup,
  FAQItem,
  SettingsSection,
  InfoPanel,
  useCollapsible,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  type CollapsibleContentProps,
  type CollapsibleGroupProps,
};
