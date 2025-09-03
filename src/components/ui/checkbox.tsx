import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Minus,
  X,
  Circle,
  Square,
  Heart,
  Star,
  Plus,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Users,
  User,
  Settings,
  Bell,
  BellOff,
  Home,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Flag,
  Bookmark,
  Tag,
  Filter,
  Search,
  Download,
  Upload,
  Save,
  Edit,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced checkbox variants
const checkboxVariants = cva(
  "peer shrink-0 border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        secondary:
          "border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground",
        destructive:
          "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
        success:
          "border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white",
        warning:
          "border-yellow-500 data-[state=checked]:bg-yellow-500 data-[state=checked]:text-white",
        info: "border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white",
        outline:
          "border-border data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
        ghost:
          "border-transparent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
      },
      size: {
        sm: "h-3 w-3 rounded-sm",
        default: "h-4 w-4 rounded-sm",
        lg: "h-5 w-5 rounded-md",
        xl: "h-6 w-6 rounded-md",
      },
      shape: {
        square: "rounded-sm",
        rounded: "rounded-md",
        circle: "rounded-full",
      },
      animation: {
        none: "",
        scale:
          "data-[state=checked]:animate-in data-[state=checked]:zoom-in-50",
        bounce: "data-[state=checked]:animate-bounce",
        pulse: "data-[state=checked]:animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "square",
      animation: "scale",
    },
  }
);

const indicatorVariants = cva(
  "flex items-center justify-center text-current transition-all duration-200",
  {
    variants: {
      animation: {
        none: "",
        scale:
          "data-[state=checked]:animate-in data-[state=checked]:zoom-in-50 data-[state=unchecked]:animate-out data-[state=unchecked]:zoom-out-50",
        fade: "data-[state=checked]:animate-in data-[state=checked]:fade-in data-[state=unchecked]:animate-out data-[state=unchecked]:fade-out",
        slide:
          "data-[state=checked]:animate-in data-[state=checked]:slide-in-from-top-1 data-[state=unchecked]:animate-out data-[state=unchecked]:slide-out-to-top-1",
      },
    },
    defaultVariants: {
      animation: "scale",
    },
  }
);

// Enhanced Checkbox interfaces
interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  indeterminate?: boolean;
  icon?: React.ElementType;
  checkedIcon?: React.ElementType;
  indeterminateIcon?: React.ElementType;
  loading?: boolean;
  readOnly?: boolean;
  labelPosition?: "left" | "right";
  showRequired?: boolean;
  tooltip?: string;
  animate?: boolean;
  ripple?: boolean;
  group?: string;
  value?: string | number;
  onLabelClick?: () => void;
}

interface CheckboxGroupProps {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  spacing?: "tight" | "normal" | "loose";
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  onValueChange?: (value: (string | number)[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  description?: string;
  className?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      variant,
      size,
      shape,
      animation,
      label,
      description,
      error,
      helperText,
      required = false,
      indeterminate = false,
      icon,
      checkedIcon,
      indeterminateIcon,
      loading = false,
      readOnly = false,
      labelPosition = "right",
      showRequired = true,
      tooltip,
      animate = false,
      ripple = false,
      group,
      value,
      onLabelClick,
      children,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [ripples, setRipples] = React.useState<
      Array<{ id: number; x: number; y: number }>
    >([]);
    const checkboxRef = React.useRef<HTMLButtonElement>(null);

    // Handle indeterminate state
    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Handle ripple effect
    const createRipple = React.useCallback(
      (event: React.MouseEvent) => {
        if (!ripple || !checkboxRef.current) return;

        const rect = checkboxRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newRipple = {
          id: Date.now(),
          x,
          y,
        };

        setRipples((prev) => [...prev, newRipple]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 600);
      },
      [ripple]
    );

    // Handle label click
    const handleLabelClick = React.useCallback(() => {
      if (readOnly || loading) return;
      onLabelClick?.();
      if (!readOnly && !loading) {
        onCheckedChange?.(!checked);
      }
    }, [readOnly, loading, onLabelClick, checked, onCheckedChange]);

    // Get the appropriate icon
    const getIcon = () => {
      if (loading) {
        return (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-3 h-3" />
        );
      }

      if (indeterminate && indeterminateIcon) {
        return React.createElement(indeterminateIcon, { className: "h-3 w-3" });
      }

      if (indeterminate) {
        return <Minus className="h-3 w-3" />;
      }

      if (checked && checkedIcon) {
        return React.createElement(checkedIcon, { className: "h-3 w-3" });
      }

      if (icon) {
        return React.createElement(icon, { className: "h-3 w-3" });
      }

      return <Check className="h-3 w-3" />;
    };

    const checkboxElement = (
      <div className="relative">
        <CheckboxPrimitive.Root
          ref={ref}
          className={cn(
            checkboxVariants({ variant, size, shape, animation }),
            error && "border-destructive focus-visible:ring-destructive",
            readOnly && "cursor-default",
            className
          )}
          checked={indeterminate ? "indeterminate" : checked}
          onCheckedChange={readOnly || loading ? undefined : onCheckedChange}
          disabled={props.disabled || loading}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${props.id}-error`
              : helperText
              ? `${props.id}-helper`
              : undefined
          }
          aria-required={required}
          title={tooltip}
          onMouseDown={(e) => {
            setIsPressed(true);
            if (ripple) createRipple(e);
          }}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          {...props}
        >
          {/* Ripple effects */}
          {ripple &&
            ripples.map((ripple) => (
              <div
                key={ripple.id}
                className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none"
              >
                <div
                  className="absolute bg-current opacity-20 rounded-full animate-ping"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              </div>
            ))}

          <CheckboxPrimitive.Indicator
            className={cn(indicatorVariants({ animation }))}
            forceMount={animate}
          >
            <AnimatePresence mode="wait">
              {(checked || indeterminate) && (
                <motion.div
                  key={indeterminate ? "indeterminate" : "checked"}
                  initial={animate ? { scale: 0, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {getIcon()}
                </motion.div>
              )}
            </AnimatePresence>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </div>
    );

    // If no label, return just the checkbox
    if (!label && !description && !error && !helperText) {
      return checkboxElement;
    }

    // Return checkbox with label and additional elements
    return (
      <div className="grid gap-2">
        <div
          className={cn(
            "flex items-start gap-2",
            labelPosition === "left" && "flex-row-reverse"
          )}
        >
          {checkboxElement}

          {(label || description) && (
            <div className="grid gap-1.5 leading-none">
              {label && (
                <label
                  htmlFor={props.id}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                    error && "text-destructive"
                  )}
                  onClick={handleLabelClick}
                >
                  {label}
                  {required && showRequired && (
                    <span
                      className="text-destructive ml-1"
                      aria-label="required"
                    >
                      *
                    </span>
                  )}
                </label>
              )}

              {description && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-xs text-destructive flex items-center gap-1"
            role="alert"
          >
            <AlertTriangle className="h-3 w-3" />
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={`${props.id}-helper`}
            className="text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Checkbox Group component
const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      children,
      orientation = "vertical",
      spacing = "normal",
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      readOnly = false,
      required = false,
      error,
      label,
      description,
      className,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<
      (string | number)[]
    >(value || defaultValue || []);

    const currentValue = value || internalValue;

    const handleValueChange = React.useCallback(
      (checkboxValue: string | number, checked: boolean) => {
        if (readOnly || disabled) return;

        const newValue = checked
          ? [...currentValue, checkboxValue]
          : currentValue.filter((v) => v !== checkboxValue);

        if (!value) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [currentValue, value, readOnly, disabled, onValueChange]
    );

    const spacingClasses = {
      tight: orientation === "horizontal" ? "gap-2" : "gap-1",
      normal: orientation === "horizontal" ? "gap-4" : "gap-2",
      loose: orientation === "horizontal" ? "gap-6" : "gap-4",
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {/* Group label and description */}
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <div className="text-sm font-medium leading-none">
                {label}
                {required && (
                  <span className="text-destructive ml-1" aria-label="required">
                    *
                  </span>
                )}
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {/* Checkbox items */}
        <div
          className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
            spacingClasses[spacing]
          )}
          role="group"
          aria-required={required}
          aria-invalid={!!error}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === Checkbox) {
              const checkboxValue = child.props.value;
              const isChecked = checkboxValue
                ? currentValue.includes(checkboxValue)
                : false;

              return React.cloneElement(child, {
                checked: isChecked,
                disabled: disabled || child.props.disabled,
                readOnly: readOnly || child.props.readOnly,
                onCheckedChange: (checked: boolean) => {
                  child.props.onCheckedChange?.(checked);
                  if (checkboxValue) {
                    handleValueChange(checkboxValue, checked);
                  }
                },
              });
            }
            return child;
          })}
        </div>

        {/* Group error message */}
        {error && (
          <p
            className="text-xs text-destructive flex items-center gap-1"
            role="alert"
          >
            <AlertTriangle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

// Preset checkbox components
const ToggleCheckbox: React.FC<Omit<CheckboxProps, "icon">> = (props) => (
  <Checkbox
    shape="rounded"
    checkedIcon={Check}
    indeterminateIcon={Minus}
    {...props}
  />
);

const HeartCheckbox: React.FC<Omit<CheckboxProps, "icon">> = (props) => (
  <Checkbox
    variant="destructive"
    shape="circle"
    icon={Heart}
    checkedIcon={Heart}
    {...props}
  />
);

const StarCheckbox: React.FC<Omit<CheckboxProps, "icon">> = (props) => (
  <Checkbox
    variant="warning"
    shape="circle"
    icon={Star}
    checkedIcon={Star}
    {...props}
  />
);

const SecurityCheckbox: React.FC<Omit<CheckboxProps, "icon">> = (props) => (
  <Checkbox variant="success" icon={Shield} checkedIcon={Shield} {...props} />
);

// Custom hook for checkbox groups
export const useCheckboxGroup = (initialValue: (string | number)[] = []) => {
  const [value, setValue] = React.useState<(string | number)[]>(initialValue);

  const toggle = React.useCallback((item: string | number) => {
    setValue((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  }, []);

  const add = React.useCallback((item: string | number) => {
    setValue((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);

  const remove = React.useCallback((item: string | number) => {
    setValue((prev) => prev.filter((v) => v !== item));
  }, []);

  const clear = React.useCallback(() => {
    setValue([]);
  }, []);

  const selectAll = React.useCallback((items: (string | number)[]) => {
    setValue(items);
  }, []);

  return {
    value,
    setValue,
    toggle,
    add,
    remove,
    clear,
    selectAll,
    isSelected: React.useCallback(
      (item: string | number) => value.includes(item),
      [value]
    ),
    selectedCount: value.length,
    isEmpty: value.length === 0,
  };
};

export {
  Checkbox,
  CheckboxGroup,
  ToggleCheckbox,
  HeartCheckbox,
  StarCheckbox,
  SecurityCheckbox,
  useCheckboxGroup,
  type CheckboxProps,
  type CheckboxGroupProps,
};
