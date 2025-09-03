import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  animated?: boolean;
  striped?: boolean;
  formatLabel?: (value: number, max: number) => string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      showLabel = false,
      label,
      size = "md",
      variant = "default",
      animated = false,
      striped = false,
      formatLabel,
      ...props
    },
    ref
  ) => {
    // Ensure value is within bounds
    const normalizedValue = Math.min(Math.max(value, 0), max);
    const percentage = (normalizedValue / max) * 100;

    // Size variants
    const sizeClasses = {
      sm: "h-2",
      md: "h-4",
      lg: "h-6",
    };

    // Color variants
    const variantClasses = {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      danger: "bg-red-500",
    };

    // Generate label text
    const getLabelText = () => {
      if (label) return label;
      if (formatLabel) return formatLabel(normalizedValue, max);
      return `${Math.round(percentage)}%`;
    };

    return (
      <div className="w-full space-y-2">
        {showLabel && (
          <div className="flex justify-between items-center text-sm font-medium">
            <span>{getLabelText()}</span>
            <span className="text-muted-foreground">
              {normalizedValue}/{max}
            </span>
          </div>
        )}

        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-secondary",
            sizeClasses[size],
            className
          )}
          value={normalizedValue}
          max={max}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full flex-1 transition-all duration-500 ease-out",
              variantClasses[variant],
              {
                "animate-pulse": animated,
                "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] animate-[shimmer_2s_infinite]":
                  striped,
              }
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
              width: "100%",
            }}
          />

          {/* Glow effect for enhanced visual appeal */}
          {percentage > 0 && (
            <div
              className={cn(
                "absolute top-0 left-0 h-full rounded-full opacity-50 blur-sm",
                variantClasses[variant]
              )}
              style={{
                width: `${percentage}%`,
                transform: "none",
              }}
            />
          )}
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = "Progress";

// Utility hook for progress state management
export const useProgress = (initialValue = 0, max = 100) => {
  const [value, setValue] = React.useState(initialValue);

  const increment = React.useCallback(
    (amount = 1) => {
      setValue((prev) => Math.min(prev + amount, max));
    },
    [max]
  );

  const decrement = React.useCallback((amount = 1) => {
    setValue((prev) => Math.max(prev - amount, 0));
  }, []);

  const reset = React.useCallback(() => {
    setValue(0);
  }, []);

  const setProgress = React.useCallback(
    (newValue: number) => {
      setValue(Math.min(Math.max(newValue, 0), max));
    },
    [max]
  );

  const isComplete = value >= max;
  const percentage = (value / max) * 100;

  return {
    value,
    setValue: setProgress,
    increment,
    decrement,
    reset,
    isComplete,
    percentage,
  };
};

export { Progress };
