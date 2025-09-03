import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

// Enhanced types
interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  className?: string;
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  variant?: "default" | "dashed" | "dotted" | "double" | "gradient" | "glow";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?:
    | "default"
    | "muted"
    | "primary"
    | "secondary"
    | "destructive"
    | "warning"
    | "success";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  withLabel?: boolean;
  label?: string;
  labelPosition?: "start" | "center" | "end";
  animated?: boolean;
  fade?: boolean;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant = "default",
      size = "sm",
      color = "default",
      spacing = "md",
      withLabel = false,
      label,
      labelPosition = "center",
      animated = false,
      fade = false,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      xs: orientation === "horizontal" ? "h-px" : "w-px",
      sm: orientation === "horizontal" ? "h-[1px]" : "w-[1px]",
      md: orientation === "horizontal" ? "h-[2px]" : "w-[2px]",
      lg: orientation === "horizontal" ? "h-[3px]" : "w-[3px]",
      xl: orientation === "horizontal" ? "h-1" : "w-1",
    };

    // Color variants
    const colorClasses = {
      default: "bg-border",
      muted: "bg-muted",
      primary: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      warning: "bg-yellow-500",
      success: "bg-green-500",
    };

    // Variant styles
    const variantClasses = {
      default: colorClasses[color],
      dashed: `border-dashed ${
        orientation === "horizontal" ? "border-t" : "border-l"
      } ${colorClasses[color].replace("bg-", "border-")}`,
      dotted: `border-dotted ${
        orientation === "horizontal" ? "border-t" : "border-l"
      } ${colorClasses[color].replace("bg-", "border-")}`,
      double: `border-double ${
        orientation === "horizontal" ? "border-t-[3px]" : "border-l-[3px]"
      } ${colorClasses[color].replace("bg-", "border-")}`,
      gradient:
        orientation === "horizontal"
          ? "bg-gradient-to-r from-transparent via-border to-transparent"
          : "bg-gradient-to-b from-transparent via-border to-transparent",
      glow: `${colorClasses[color]} shadow-[0_0_10px_rgba(59,130,246,0.5)]`,
    };

    // Spacing variants
    const spacingClasses = {
      none: orientation === "horizontal" ? "my-0" : "mx-0",
      xs: orientation === "horizontal" ? "my-1" : "mx-1",
      sm: orientation === "horizontal" ? "my-2" : "mx-2",
      md: orientation === "horizontal" ? "my-4" : "mx-4",
      lg: orientation === "horizontal" ? "my-6" : "mx-6",
      xl: orientation === "horizontal" ? "my-8" : "mx-8",
    };

    // Animation classes
    const animationClasses = animated ? "animate-pulse" : "";

    // Fade classes
    const fadeClasses = fade
      ? orientation === "horizontal"
        ? "bg-gradient-to-r from-transparent via-border to-transparent"
        : "bg-gradient-to-b from-transparent via-border to-transparent"
      : "";

    // If separator has a label, render with label container
    if (withLabel && label) {
      const labelPositionClasses = {
        start: orientation === "horizontal" ? "justify-start" : "items-start",
        center:
          orientation === "horizontal" ? "justify-center" : "items-center",
        end: orientation === "horizontal" ? "justify-end" : "items-end",
      };

      return (
        <div
          className={cn(
            "relative flex items-center",
            orientation === "horizontal" ? "w-full" : "h-full flex-col",
            spacingClasses[spacing],
            className
          )}
        >
          <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
              "shrink-0",
              orientation === "horizontal" ? "w-full" : "h-full",
              sizeClasses[size],
              variant === "dashed" ||
                variant === "dotted" ||
                variant === "double"
                ? "bg-transparent"
                : fade
                ? fadeClasses
                : variantClasses[variant],
              variant === "dashed" ||
                variant === "dotted" ||
                variant === "double"
                ? variantClasses[variant]
                : "",
              animationClasses
            )}
            {...props}
          />

          <div
            className={cn(
              "absolute bg-background px-2 text-xs font-medium text-muted-foreground",
              orientation === "horizontal"
                ? labelPositionClasses[labelPosition]
                : labelPositionClasses[labelPosition],
              orientation === "horizontal"
                ? "flex w-full"
                : "flex h-full flex-col"
            )}
          >
            <span className="bg-background px-2 py-1 rounded-sm">{label}</span>
          </div>
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "shrink-0",
          orientation === "horizontal" ? "w-full" : "h-full",
          sizeClasses[size],
          spacingClasses[spacing],
          variant === "dashed" || variant === "dotted" || variant === "double"
            ? "bg-transparent"
            : fade
            ? fadeClasses
            : variantClasses[variant],
          variant === "dashed" || variant === "dotted" || variant === "double"
            ? variantClasses[variant]
            : "",
          animationClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

// Specialized separator variants for common use cases
const SectionSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  SeparatorProps & { title?: string }
>(({ title, ...props }, ref) => (
  <Separator
    ref={ref}
    variant="gradient"
    size="md"
    spacing="lg"
    withLabel={!!title}
    label={title}
    labelPosition="center"
    {...props}
  />
));
SectionSeparator.displayName = "SectionSeparator";

const DividerWithIcon = React.forwardRef<
  React.ElementRef<typeof Separator>,
  SeparatorProps & {
    icon?: React.ReactNode;
    iconClassName?: string;
  }
>(
  (
    { icon, iconClassName, className, orientation = "horizontal", ...props },
    ref
  ) => (
    <div
      className={cn(
        "relative flex items-center",
        orientation === "horizontal" ? "w-full" : "h-full flex-col",
        className
      )}
    >
      <Separator
        ref={ref}
        orientation={orientation}
        variant="gradient"
        {...props}
      />
      {icon && (
        <div
          className={cn(
            "absolute bg-background p-2 rounded-full border",
            orientation === "horizontal"
              ? "left-1/2 -translate-x-1/2"
              : "top-1/2 -translate-y-1/2",
            iconClassName
          )}
        >
          {icon}
        </div>
      )}
    </div>
  )
);
DividerWithIcon.displayName = "DividerWithIcon";

const EmergencySeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  SeparatorProps & { urgency?: "low" | "medium" | "high" | "critical" }
>(({ urgency = "medium", ...props }, ref) => {
  const urgencyConfig = {
    low: {
      color: "success" as const,
      variant: "default" as const,
      animated: false,
    },
    medium: {
      color: "warning" as const,
      variant: "default" as const,
      animated: false,
    },
    high: {
      color: "destructive" as const,
      variant: "glow" as const,
      animated: true,
    },
    critical: {
      color: "destructive" as const,
      variant: "glow" as const,
      animated: true,
    },
  };

  return (
    <Separator
      ref={ref}
      size="md"
      spacing="md"
      {...urgencyConfig[urgency]}
      {...props}
    />
  );
});
EmergencySeparator.displayName = "EmergencySeparator";

// Utility hook for dynamic separators
export const useSeparator = (options?: {
  variant?: SeparatorProps["variant"];
  color?: SeparatorProps["color"];
  animated?: boolean;
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [variant, setVariant] = React.useState(options?.variant || "default");
  const [color, setColor] = React.useState(options?.color || "default");
  const [animated, setAnimated] = React.useState(options?.animated || false);

  const toggleVisibility = React.useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const updateStyle = React.useCallback(
    (newOptions: {
      variant?: SeparatorProps["variant"];
      color?: SeparatorProps["color"];
      animated?: boolean;
    }) => {
      if (newOptions.variant) setVariant(newOptions.variant);
      if (newOptions.color) setColor(newOptions.color);
      if (newOptions.animated !== undefined) setAnimated(newOptions.animated);
    },
    []
  );

  return {
    isVisible,
    variant,
    color,
    animated,
    toggleVisibility,
    updateStyle,
    setIsVisible,
    setVariant,
    setColor,
    setAnimated,
  };
};

export { Separator, SectionSeparator, DividerWithIcon, EmergencySeparator };
