import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Asterisk,
  HelpCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Star,
  Flag,
  Tag,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Lock,
  Key,
  Settings,
  Zap,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced label variants
const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors",
  {
    variants: {
      variant: {
        default: "text-sm text-foreground",
        large: "text-base text-foreground",
        small: "text-xs text-foreground",
        muted: "text-sm text-muted-foreground",
        subtle: "text-xs text-muted-foreground/70",
      },
      state: {
        default: "",
        error: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
        info: "text-blue-600",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      required: {
        true: "after:content-['*'] after:text-destructive after:ml-1",
        false: "",
      },
      optional: {
        true: "after:content-['(optional)'] after:text-muted-foreground after:ml-1 after:text-xs after:font-normal",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      weight: "medium",
      required: false,
      optional: false,
    },
  }
);

// Enhanced interfaces
interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  icon?: React.ElementType;
  tooltip?: string;
  description?: string;
  showTooltip?: boolean;
  onTooltipToggle?: (show: boolean) => void;
  asterisk?: boolean;
  requiredText?: string;
  optionalText?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

interface LabelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  spacing?: "tight" | "normal" | "loose";
  align?: "start" | "center" | "end";
}

interface LabelAsteriskProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "subtle" | "prominent";
}

interface LabelDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "small";
}

interface LabelTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

// Enhanced Label component with rich features[245][256]
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(
  (
    {
      className,
      variant = "default",
      state = "default",
      weight = "medium",
      required: propRequired = false,
      optional: propOptional = false,
      icon: Icon,
      tooltip,
      description,
      showTooltip = false,
      onTooltipToggle,
      asterisk = false,
      requiredText = "*",
      optionalText = "(optional)",
      htmlFor,
      children,
      ...props
    },
    ref
  ) => {
    const [tooltipVisible, setTooltipVisible] = React.useState(showTooltip);

    // Handle tooltip visibility
    const handleTooltipToggle = React.useCallback(
      (show: boolean) => {
        setTooltipVisible(show);
        onTooltipToggle?.(show);
      },
      [onTooltipToggle]
    );

    // Determine if we should show required or optional indicators
    const showRequired = propRequired || asterisk;
    const showOptional = propOptional && !showRequired;

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <LabelPrimitive.Root
            ref={ref}
            htmlFor={htmlFor}
            className={cn(
              labelVariants({
                variant,
                state,
                weight,
                required: false, // We handle this manually for more control
                optional: false,
              }),
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-2">
              {/* Icon */}
              {Icon && (
                <Icon
                  className={cn(
                    "flex-shrink-0",
                    variant === "small" || variant === "subtle"
                      ? "h-3 w-3"
                      : "h-4 w-4"
                  )}
                />
              )}

              {/* Label Text */}
              <span className="flex items-center">
                {children}

                {/* Required Indicator */}
                {showRequired && (
                  <span
                    className="text-destructive ml-1"
                    aria-label="required field"
                    title="This field is required"
                  >
                    {requiredText}
                  </span>
                )}

                {/* Optional Indicator */}
                {showOptional && (
                  <span
                    className="text-muted-foreground ml-1 text-xs font-normal"
                    aria-label="optional field"
                  >
                    {optionalText}
                  </span>
                )}
              </span>
            </div>
          </LabelPrimitive.Root>

          {/* Tooltip */}
          {tooltip && (
            <div className="relative">
              <button
                type="button"
                onClick={() => handleTooltipToggle(!tooltipVisible)}
                onMouseEnter={() => handleTooltipToggle(true)}
                onMouseLeave={() => handleTooltipToggle(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Show help"
                aria-describedby={
                  tooltipVisible ? `${htmlFor}-tooltip` : undefined
                }
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              {tooltipVisible && (
                <div
                  id={`${htmlFor}-tooltip`}
                  role="tooltip"
                  className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 z-50"
                >
                  <div className="bg-popover text-popover-foreground text-sm rounded-md p-2 shadow-md border max-w-xs whitespace-pre-wrap">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <LabelDescription id={`${htmlFor}-description`} variant="muted">
            {description}
          </LabelDescription>
        )}
      </div>
    );
  }
);

Label.displayName = LabelPrimitive.Root.displayName;

// Label Asterisk component for required fields
const LabelAsterisk = React.forwardRef<HTMLSpanElement, LabelAsteriskProps>(
  ({ className, variant = "default", children = "*", ...props }, ref) => {
    const asteriskVariants = cva("", {
      variants: {
        variant: {
          default: "text-destructive",
          subtle: "text-destructive/70",
          prominent: "text-destructive font-bold",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    });

    return (
      <span
        ref={ref}
        className={cn(asteriskVariants({ variant }), "ml-1", className)}
        aria-label="required"
        {...props}
      >
        {children}
      </span>
    );
  }
);

LabelAsterisk.displayName = "LabelAsterisk";

// Label Description component
const LabelDescription = React.forwardRef<
  HTMLParagraphElement,
  LabelDescriptionProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const descriptionVariants = cva("leading-relaxed", {
    variants: {
      variant: {
        default: "text-sm text-muted-foreground",
        muted: "text-xs text-muted-foreground/70",
        small: "text-xs text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  return (
    <p
      ref={ref}
      className={cn(descriptionVariants({ variant }), className)}
      {...props}
    >
      {children}
    </p>
  );
});

LabelDescription.displayName = "LabelDescription";

// Label Group for organizing multiple labels
const LabelGroup = React.forwardRef<HTMLDivElement, LabelGroupProps>(
  (
    {
      className,
      orientation = "vertical",
      spacing = "normal",
      align = "start",
      children,
      ...props
    },
    ref
  ) => {
    const groupVariants = cva("flex", {
      variants: {
        orientation: {
          vertical: "flex-col",
          horizontal: "flex-row flex-wrap",
        },
        spacing: {
          tight: "",
          normal: "",
          loose: "",
        },
        align: {
          start: "items-start",
          center: "items-center",
          end: "items-end",
        },
      },
      compoundVariants: [
        {
          orientation: "vertical",
          spacing: "tight",
          class: "gap-1",
        },
        {
          orientation: "vertical",
          spacing: "normal",
          class: "gap-2",
        },
        {
          orientation: "vertical",
          spacing: "loose",
          class: "gap-4",
        },
        {
          orientation: "horizontal",
          spacing: "tight",
          class: "gap-2",
        },
        {
          orientation: "horizontal",
          spacing: "normal",
          class: "gap-4",
        },
        {
          orientation: "horizontal",
          spacing: "loose",
          class: "gap-6",
        },
      ],
      defaultVariants: {
        orientation: "vertical",
        spacing: "normal",
        align: "start",
      },
    });

    return (
      <div
        ref={ref}
        className={cn(
          groupVariants({ orientation, spacing, align }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LabelGroup.displayName = "LabelGroup";

// Label with Tooltip component
const LabelTooltip: React.FC<LabelTooltipProps> = ({
  content,
  children,
  side = "top",
  align = "center",
}) => {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-popover-foreground bg-popover border rounded shadow-md whitespace-nowrap",
            side === "top" && "bottom-full mb-2",
            side === "bottom" && "top-full mt-2",
            side === "left" && "right-full mr-2",
            side === "right" && "left-full ml-2",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            align === "end" && "right-0"
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Preset Label components for common use cases
const FieldLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  icon?: React.ElementType;
}> = ({ htmlFor, children, required, optional, tooltip, icon }) => (
  <Label
    htmlFor={htmlFor}
    required={required}
    optional={optional}
    tooltip={tooltip}
    icon={icon}
  >
    {children}
  </Label>
);

const SectionLabel: React.FC<{
  children: React.ReactNode;
  description?: string;
  icon?: React.ElementType;
}> = ({ children, description, icon }) => (
  <Label
    variant="large"
    weight="semibold"
    icon={icon}
    description={description}
  >
    {children}
  </Label>
);

const StatusLabel: React.FC<{
  children: React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}> = ({ children, status }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <Label variant="small" state={status} icon={icons[status]}>
      {children}
    </Label>
  );
};

export {
  Label,
  LabelAsterisk,
  LabelDescription,
  LabelGroup,
  LabelTooltip,
  FieldLabel,
  SectionLabel,
  StatusLabel,
  labelVariants,
  type LabelProps,
  type LabelGroupProps,
  type LabelAsteriskProps,
  type LabelDescriptionProps,
  type LabelTooltipProps,
};
