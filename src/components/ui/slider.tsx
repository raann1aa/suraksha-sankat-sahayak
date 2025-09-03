import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

// Enhanced types
interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "danger" | "warning" | "success" | "gradient";
  showValue?: boolean;
  showTicks?: boolean;
  tickMarks?: number[];
  formatValue?: (value: number) => string;
  unit?: string;
  showMinMax?: boolean;
  vertical?: boolean;
  inverted?: boolean;
  animated?: boolean;
  emergencyThresholds?: {
    warning?: number;
    danger?: number;
    critical?: number;
  };
  onThresholdCross?: (
    threshold: "warning" | "danger" | "critical",
    value: number
  ) => void;
  marks?: Array<{ value: number; label: string }>;
  tooltip?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      size = "md",
      variant = "default",
      showValue = false,
      showTicks = false,
      tickMarks = [],
      formatValue = (value) => value.toString(),
      unit = "",
      showMinMax = false,
      vertical = false,
      inverted = false,
      animated = false,
      emergencyThresholds,
      onThresholdCross,
      marks = [],
      tooltip = false,
      tooltipPosition = "top",
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(
      defaultValue || [0]
    );
    const [isDragging, setIsDragging] = React.useState(false);
    const [previousValue, setPreviousValue] = React.useState<number[]>([0]);

    const currentValue = value || internalValue;
    const primaryValue = currentValue[0];

    // Size variants
    const sizeClasses = {
      sm: {
        track: "h-1.5",
        thumb: "h-3 w-3",
        range: "h-1.5",
      },
      md: {
        track: "h-2",
        thumb: "h-5 w-5",
        range: "h-2",
      },
      lg: {
        track: "h-3",
        thumb: "h-6 w-6",
        range: "h-3",
      },
    };

    // Variant colors
    const variantClasses = {
      default: {
        track: "bg-secondary",
        range: "bg-primary",
        thumb: "border-primary bg-background",
      },
      danger: {
        track: "bg-red-100 dark:bg-red-950",
        range: "bg-red-500",
        thumb: "border-red-500 bg-background",
      },
      warning: {
        track: "bg-yellow-100 dark:bg-yellow-950",
        range: "bg-yellow-500",
        thumb: "border-yellow-500 bg-background",
      },
      success: {
        track: "bg-green-100 dark:bg-green-950",
        range: "bg-green-500",
        thumb: "border-green-500 bg-background",
      },
      gradient: {
        track: "bg-gradient-to-r from-green-200 via-yellow-200 to-red-200",
        range: "bg-gradient-to-r from-green-500 via-yellow-500 to-red-500",
        thumb: "border-primary bg-background",
      },
    };

    // Emergency threshold calculations
    const getThresholdColor = React.useCallback(
      (value: number) => {
        if (!emergencyThresholds) return variant;

        if (
          emergencyThresholds.critical &&
          value >= emergencyThresholds.critical
        ) {
          return "danger";
        }
        if (emergencyThresholds.danger && value >= emergencyThresholds.danger) {
          return "danger";
        }
        if (
          emergencyThresholds.warning &&
          value >= emergencyThresholds.warning
        ) {
          return "warning";
        }
        return "success";
      },
      [emergencyThresholds, variant]
    );

    const currentVariant = emergencyThresholds
      ? getThresholdColor(primaryValue)
      : variant;

    // Handle value changes and threshold crossing
    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);

        // Check threshold crossing
        if (emergencyThresholds && onThresholdCross) {
          const oldValue = previousValue[0];
          const currentVal = newValue[0];

          Object.entries(emergencyThresholds).forEach(
            ([threshold, thresholdValue]) => {
              if (
                thresholdValue &&
                oldValue < thresholdValue &&
                currentVal >= thresholdValue
              ) {
                onThresholdCross(
                  threshold as "warning" | "danger" | "critical",
                  currentVal
                );
              }
            }
          );
        }

        setPreviousValue(newValue);
      },
      [onValueChange, emergencyThresholds, onThresholdCross, previousValue]
    );

    // Calculate tick positions
    const getTickPositions = React.useCallback(() => {
      if (!showTicks || tickMarks.length === 0) return [];

      return tickMarks.map((tick) => ({
        value: tick,
        position: ((tick - min) / (max - min)) * 100,
      }));
    }, [showTicks, tickMarks, min, max]);

    // Calculate mark positions
    const getMarkPositions = React.useCallback(() => {
      return marks.map((mark) => ({
        ...mark,
        position: ((mark.value - min) / (max - min)) * 100,
      }));
    }, [marks, min, max]);

    return (
      <div className={cn("relative w-full", vertical && "h-full w-auto")}>
        {/* Min/Max labels */}
        {showMinMax && (
          <div
            className={cn(
              "flex justify-between text-xs text-muted-foreground mb-2",
              vertical &&
                "flex-col-reverse h-full w-8 absolute -left-8 items-center justify-between"
            )}
          >
            <span>
              {formatValue(min)}
              {unit}
            </span>
            <span>
              {formatValue(max)}
              {unit}
            </span>
          </div>
        )}

        {/* Current value display */}
        {showValue && (
          <div
            className={cn(
              "flex justify-center mb-2",
              vertical && "absolute -top-8 left-1/2 -translate-x-1/2"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium px-2 py-1 rounded bg-background border",
                currentVariant === "danger" &&
                  "text-red-600 border-red-200 bg-red-50",
                currentVariant === "warning" &&
                  "text-yellow-600 border-yellow-200 bg-yellow-50",
                currentVariant === "success" &&
                  "text-green-600 border-green-200 bg-green-50"
              )}
            >
              {formatValue(primaryValue)}
              {unit}
            </span>
          </div>
        )}

        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            vertical && "flex-col h-full w-auto",
            animated && "transition-all duration-200",
            className
          )}
          orientation={vertical ? "vertical" : "horizontal"}
          inverted={inverted}
          value={currentValue}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          min={min}
          max={max}
          step={step}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          {...props}
        >
          {/* Emergency threshold indicators */}
          {emergencyThresholds && (
            <>
              {Object.entries(emergencyThresholds).map(
                ([threshold, thresholdValue]) => {
                  if (!thresholdValue) return null;

                  const position = ((thresholdValue - min) / (max - min)) * 100;
                  const thresholdColors = {
                    warning: "bg-yellow-500",
                    danger: "bg-orange-500",
                    critical: "bg-red-500",
                  };

                  return (
                    <div
                      key={threshold}
                      className={cn(
                        "absolute z-10 w-0.5 bg-opacity-60",
                        thresholdColors[
                          threshold as keyof typeof thresholdColors
                        ],
                        vertical
                          ? "h-full left-1/2 -translate-x-1/2"
                          : "h-full top-0"
                      )}
                      style={{
                        [vertical ? "bottom" : "left"]: `${position}%`,
                      }}
                    />
                  );
                }
              )}
            </>
          )}

          {/* Tick marks */}
          {showTicks && (
            <>
              {getTickPositions().map((tick, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute w-0.5 h-2 bg-muted-foreground/50",
                    vertical ? "left-1/2 -translate-x-1/2 w-2 h-0.5" : "top-0"
                  )}
                  style={{
                    [vertical ? "bottom" : "left"]: `${tick.position}%`,
                  }}
                />
              ))}
            </>
          )}

          {/* Custom marks with labels */}
          {marks.length > 0 && (
            <>
              {getMarkPositions().map((mark, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute",
                    vertical ? "left-full ml-2" : "top-full mt-2"
                  )}
                  style={{
                    [vertical ? "bottom" : "left"]: `${mark.position}%`,
                    transform: vertical
                      ? "translateY(50%)"
                      : "translateX(-50%)",
                  }}
                >
                  <div
                    className={cn(
                      "w-1 h-4 bg-muted-foreground/50",
                      vertical ? "w-4 h-1" : ""
                    )}
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {mark.label}
                  </span>
                </div>
              ))}
            </>
          )}

          <SliderPrimitive.Track
            className={cn(
              "relative w-full grow overflow-hidden rounded-full",
              sizeClasses[size].track,
              variantClasses[currentVariant].track,
              vertical && "h-full w-2",
              animated && "transition-colors duration-200"
            )}
          >
            <SliderPrimitive.Range
              className={cn(
                "absolute",
                sizeClasses[size].range,
                variantClasses[currentVariant].range,
                animated && "transition-all duration-200",
                isDragging && "scale-105"
              )}
            />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb
            className={cn(
              "block rounded-full border-2 ring-offset-background transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              "hover:scale-110",
              sizeClasses[size].thumb,
              variantClasses[currentVariant].thumb,
              isDragging && "scale-125 shadow-lg",
              animated && "transition-transform duration-150"
            )}
          >
            {/* Tooltip */}
            {tooltip && isDragging && (
              <div
                className={cn(
                  "absolute z-20 px-2 py-1 text-xs bg-popover border border-border rounded-md shadow-md whitespace-nowrap",
                  {
                    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
                    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
                    left: "right-full mr-2 top-1/2 -translate-y-1/2",
                    right: "left-full ml-2 top-1/2 -translate-y-1/2",
                  }[tooltipPosition]
                )}
              >
                {formatValue(primaryValue)}
                {unit}
              </div>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>

        {/* Emergency status indicator */}
        {emergencyThresholds && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                currentVariant === "success" && "bg-green-500",
                currentVariant === "warning" && "bg-yellow-500 animate-pulse",
                currentVariant === "danger" && "bg-red-500 animate-pulse"
              )}
            />
            <span
              className={cn(
                "font-medium",
                currentVariant === "success" && "text-green-600",
                currentVariant === "warning" && "text-yellow-600",
                currentVariant === "danger" && "text-red-600"
              )}
            >
              {currentVariant === "success" && "Normal"}
              {currentVariant === "warning" && "Warning Level"}
              {currentVariant === "danger" && "Danger Level"}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

// Range Slider Component
const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps & {
    lowLabel?: string;
    highLabel?: string;
  }
>(
  (
    {
      lowLabel = "Min",
      highLabel = "Max",
      formatValue = (value) => value.toString(),
      unit = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {props.showValue && (
          <div className="flex justify-between text-sm">
            <span>
              {lowLabel}:{" "}
              {formatValue((props.value || props.defaultValue || [0, 100])[0])}
              {unit}
            </span>
            <span>
              {highLabel}:{" "}
              {formatValue((props.value || props.defaultValue || [0, 100])[1])}
              {unit}
            </span>
          </div>
        )}
        <Slider ref={ref} {...props} />
      </div>
    );
  }
);
RangeSlider.displayName = "RangeSlider";

// Emergency Severity Slider for Suraksha Sankat Sahayak
const EmergencySeveritySlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  Omit<SliderProps, "emergencyThresholds" | "variant"> & {
    onSeverityChange?: (
      severity: "low" | "medium" | "high" | "critical"
    ) => void;
  }
>(({ onSeverityChange, value, onValueChange, ...props }, ref) => {
  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      onValueChange?.(newValue);

      const severity = newValue[0];
      if (severity <= 25) onSeverityChange?.("low");
      else if (severity <= 50) onSeverityChange?.("medium");
      else if (severity <= 75) onSeverityChange?.("high");
      else onSeverityChange?.("critical");
    },
    [onValueChange, onSeverityChange]
  );

  return (
    <Slider
      ref={ref}
      variant="gradient"
      value={value}
      onValueChange={handleValueChange}
      emergencyThresholds={{
        warning: 30,
        danger: 60,
        critical: 80,
      }}
      marks={[
        { value: 12.5, label: "Low" },
        { value: 37.5, label: "Medium" },
        { value: 62.5, label: "High" },
        { value: 87.5, label: "Critical" },
      ]}
      showValue
      showTicks
      tickMarks={[25, 50, 75]}
      formatValue={(val) => {
        if (val <= 25) return "Low";
        if (val <= 50) return "Medium";
        if (val <= 75) return "High";
        return "Critical";
      }}
      {...props}
    />
  );
});
EmergencySeveritySlider.displayName = "EmergencySeveritySlider";

// Volume/Intensity Slider with audio feedback
const VolumeSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  SliderProps & {
    muted?: boolean;
    onMuteToggle?: (muted: boolean) => void;
  }
>(({ muted = false, onMuteToggle, ...props }, ref) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onMuteToggle?.(!muted)}
        className="p-1 rounded hover:bg-muted"
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <Slider
        ref={ref}
        variant={muted ? "default" : "success"}
        disabled={muted}
        {...props}
      />
    </div>
  );
});
VolumeSlider.displayName = "VolumeSlider";

// Utility hook for slider state management
export const useSlider = (
  initialValue: number | number[] = 0,
  min: number = 0,
  max: number = 100
) => {
  const [value, setValue] = React.useState(
    Array.isArray(initialValue) ? initialValue : [initialValue]
  );

  const increment = React.useCallback(
    (step: number = 1) => {
      setValue((prev) => [Math.min(prev[0] + step, max)]);
    },
    [max]
  );

  const decrement = React.useCallback(
    (step: number = 1) => {
      setValue((prev) => [Math.max(prev[0] - step, min)]);
    },
    [min]
  );

  const reset = React.useCallback(() => {
    setValue(Array.isArray(initialValue) ? initialValue : [initialValue]);
  }, [initialValue]);

  const setToMin = React.useCallback(() => setValue([min]), [min]);
  const setToMax = React.useCallback(() => setValue([max]), [max]);

  return {
    value,
    setValue,
    increment,
    decrement,
    reset,
    setToMin,
    setToMax,
    percentage: (value[0] / (max - min)) * 100,
  };
};

export { Slider, RangeSlider, EmergencySeveritySlider, VolumeSlider };
