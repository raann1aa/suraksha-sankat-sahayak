import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Enhanced skeleton variants
const skeletonVariants = cva("animate-pulse rounded-md bg-muted", {
  variants: {
    variant: {
      default: "bg-muted",
      text: "bg-muted rounded-sm",
      circular: "rounded-full bg-muted",
      rectangular: "rounded-md bg-muted",
      wave: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-shimmer",
    },
    animation: {
      pulse: "animate-pulse",
      wave: "animate-shimmer",
      none: "",
    },
    size: {
      xs: "h-3",
      sm: "h-4",
      default: "h-5",
      lg: "h-6",
      xl: "h-8",
    },
  },
  defaultVariants: {
    variant: "default",
    animation: "pulse",
    size: "default",
  },
});

// Enhanced interfaces
interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  count?: number;
  loading?: boolean;
  animate?: boolean;
  duration?: number;
  screenReaderText?: string;
  "aria-label"?: string;
  "aria-busy"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
}

interface SkeletonTextProps extends Omit<SkeletonProps, "variant"> {
  lines?: number;
  lineHeight?: string | number;
  lastLineWidth?: string;
}

interface SkeletonCircleProps extends Omit<SkeletonProps, "variant"> {
  size?: string | number;
}

interface SkeletonCardProps {
  loading?: boolean;
  hasAvatar?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  lines?: number;
  className?: string;
}

// Add shimmer animation to global CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;

// Inject shimmer animation styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}

// Enhanced Skeleton component with comprehensive accessibility[362][363][364]
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "default",
      animation = "pulse",
      size = "default",
      width,
      height,
      count = 1,
      loading = true,
      animate = true,
      duration = 1.5,
      screenReaderText = "Loading content",
      "aria-label": ariaLabel,
      "aria-busy": ariaBusy = true,
      "aria-live": ariaLive = "polite",
      style,
      ...props
    },
    ref
  ) => {
    const skeletonStyle = React.useMemo(
      () => ({
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        animationDuration: `${duration}s`,
        ...style,
      }),
      [width, height, duration, style]
    );

    if (!loading) {
      return null;
    }

    // Single skeleton
    if (count === 1) {
      return (
        <div
          ref={ref}
          className={cn(
            skeletonVariants({
              variant,
              animation: animate ? animation : "none",
              size,
            }),
            className
          )}
          style={skeletonStyle}
          role="status"
          aria-label={ariaLabel || screenReaderText}
          aria-busy={ariaBusy}
          aria-live={ariaLive}
          {...props}
        >
          {/* Screen reader text */}
          <span className="sr-only">{screenReaderText}</span>
        </div>
      );
    }

    // Multiple skeletons
    return (
      <div
        ref={ref}
        role="status"
        aria-label={ariaLabel || `${screenReaderText} (${count} items)`}
        aria-busy={ariaBusy}
        aria-live={ariaLive}
        {...props}
      >
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className={cn(
              skeletonVariants({
                variant,
                animation: animate ? animation : "none",
                size,
              }),
              index > 0 && "mt-2",
              className
            )}
            style={skeletonStyle}
          />
        ))}
        <span className="sr-only">{screenReaderText}</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// SkeletonText for text content placeholders[367][370]
const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  (
    {
      lines = 3,
      lineHeight = "1rem",
      lastLineWidth = "60%",
      className,
      ...props
    },
    ref
  ) => {
    const lineStyle = React.useMemo(
      () => ({
        height: typeof lineHeight === "number" ? `${lineHeight}px` : lineHeight,
      }),
      [lineHeight]
    );

    return (
      <div ref={ref} className="space-y-2">
        {Array.from({ length: lines }, (_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className={cn("w-full", className)}
            style={{
              ...lineStyle,
              width: index === lines - 1 ? lastLineWidth : "100%",
            }}
            screenReaderText={`Loading text line ${index + 1} of ${lines}`}
            {...props}
          />
        ))}
      </div>
    );
  }
);

SkeletonText.displayName = "SkeletonText";

// SkeletonCircle for avatar and circular content[370]
const SkeletonCircle = React.forwardRef<HTMLDivElement, SkeletonCircleProps>(
  ({ size = 40, className, ...props }, ref) => {
    const circleStyle = React.useMemo(() => {
      const sizeValue = typeof size === "number" ? `${size}px` : size;
      return {
        width: sizeValue,
        height: sizeValue,
      };
    }, [size]);

    return (
      <Skeleton
        ref={ref}
        variant="circular"
        className={className}
        style={circleStyle}
        screenReaderText="Loading avatar"
        {...props}
      />
    );
  }
);

SkeletonCircle.displayName = "SkeletonCircle";

// SkeletonCard for complete card layouts[362][372]
const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  (
    {
      loading = true,
      hasAvatar = true,
      hasTitle = true,
      hasDescription = true,
      lines = 2,
      className,
      ...props
    },
    ref
  ) => {
    if (!loading) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn("p-4 space-y-4", className)}
        role="status"
        aria-label="Loading card content"
        aria-busy="true"
        {...props}
      >
        {/* Header with avatar and title */}
        {(hasAvatar || hasTitle) && (
          <div className="flex items-start space-x-3">
            {hasAvatar && <SkeletonCircle size={40} />}
            <div className="flex-1 space-y-2">
              {hasTitle && (
                <Skeleton
                  variant="text"
                  className="h-4 w-3/4"
                  screenReaderText="Loading title"
                />
              )}
              {hasDescription && (
                <Skeleton
                  variant="text"
                  className="h-3 w-1/2"
                  screenReaderText="Loading subtitle"
                />
              )}
            </div>
          </div>
        )}

        {/* Content lines */}
        <SkeletonText lines={lines} screenReaderText="Loading card content" />

        {/* Footer actions */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton
            className="h-8 w-16"
            screenReaderText="Loading action button"
          />
          <Skeleton
            className="h-8 w-20"
            screenReaderText="Loading secondary action"
          />
        </div>

        <span className="sr-only">Loading card content</span>
      </div>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";

// SkeletonList for list layouts
const SkeletonList = React.forwardRef<
  HTMLDivElement,
  {
    items?: number;
    showAvatar?: boolean;
    className?: string;
  }
>(({ items = 5, showAvatar = false, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    role="status"
    aria-label={`Loading list with ${items} items`}
    aria-busy="true"
    {...props}
  >
    {Array.from({ length: items }, (_, index) => (
      <div key={index} className="flex items-center space-x-3">
        {showAvatar && <SkeletonCircle size={32} />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading list content</span>
  </div>
));

SkeletonList.displayName = "SkeletonList";

// SkeletonTable for table layouts
const SkeletonTable = React.forwardRef<
  HTMLDivElement,
  {
    rows?: number;
    columns?: number;
    showHeader?: boolean;
    className?: string;
  }
>(({ rows = 5, columns = 4, showHeader = true, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    role="status"
    aria-label={`Loading table with ${rows} rows and ${columns} columns`}
    aria-busy="true"
    {...props}
  >
    {/* Header */}
    {showHeader && (
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    )}

    {/* Rows */}
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>

    <span className="sr-only">Loading table content</span>
  </div>
));

SkeletonTable.displayName = "SkeletonTable";

// Utility hook for skeleton state management
export const useSkeletonState = (initialLoading = true) => {
  const [loading, setLoading] = React.useState(initialLoading);

  const startLoading = React.useCallback(() => setLoading(true), []);
  const stopLoading = React.useCallback(() => setLoading(false), []);
  const toggleLoading = React.useCallback(
    () => setLoading((prev) => !prev),
    []
  );

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
  };
};

export {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  type SkeletonProps,
  type SkeletonTextProps,
  type SkeletonCircleProps,
  type SkeletonCardProps,
};
