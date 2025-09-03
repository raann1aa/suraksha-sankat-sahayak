import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Download,
  Share2,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Filter,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Target,
  Users,
  DollarSign,
  Percent,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

// Enhanced chart variants
const chartContainerVariants = cva("flex justify-center text-xs relative", {
  variants: {
    variant: {
      default: "aspect-video",
      square: "aspect-square",
      tall: "aspect-[3/4]",
      wide: "aspect-[16/9]",
      ultrawide: "aspect-[21/9]",
      custom: "",
    },
    padding: {
      none: "p-0",
      sm: "p-2",
      default: "p-4",
      lg: "p-6",
    },
    border: {
      none: "",
      default: "border rounded-lg",
      thick: "border-2 rounded-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
    border: "none",
  },
});

// Enhanced Chart interfaces
export interface ChartDataPoint {
  [key: string]: any;
  timestamp?: string | Date;
  category?: string;
  value?: number;
}

export interface ChartMetrics {
  total?: number;
  average?: number;
  change?: number;
  changePercent?: number;
  trend?: "up" | "down" | "stable";
  peak?: number;
  lowest?: number;
}

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    description?: string;
    unit?: string;
    format?: (value: any) => string;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

interface ChartContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof chartContainerVariants> {
  config: ChartConfig;
  data?: ChartDataPoint[];
  title?: string;
  description?: string;
  metrics?: ChartMetrics;
  loading?: boolean;
  error?: string | Error;
  showControls?: boolean;
  showMetrics?: boolean;
  showLegend?: boolean;
  exportable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  onExport?: (format: "png" | "svg" | "pdf") => void;
  height?: number | string;
  width?: number | string;
  animate?: boolean;
  interactive?: boolean;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}

type ChartContextProps = {
  config: ChartConfig;
  data: ChartDataPoint[];
  metrics?: ChartMetrics;
  loading: boolean;
  error?: string | Error;
  interactive: boolean;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

// Enhanced Chart Header
const ChartHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    showControls?: boolean;
    onRefresh?: () => void;
    onExport?: (format: "png" | "svg" | "pdf") => void;
  }
>(
  (
    {
      className,
      title,
      description,
      showControls = false,
      onRefresh,
      onExport,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between mb-4", className)}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>

      {showControls && (
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh chart</span>
            </Button>
          )}

          {onExport && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport("png")}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Export chart</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
);

ChartHeader.displayName = "ChartHeader";

// Chart Metrics Display
const ChartMetrics = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    metrics: ChartMetrics;
  }
>(({ className, metrics, ...props }, ref) => {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatValue = (value?: number) => {
    if (value === undefined) return "--";
    return value.toLocaleString();
  };

  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", className)}
      {...props}
    >
      {metrics.total !== undefined && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Total</p>
          <div className="flex items-center gap-1">
            <p className="text-lg font-semibold">
              {formatValue(metrics.total)}
            </p>
          </div>
        </div>
      )}

      {metrics.average !== undefined && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Average</p>
          <p className="text-lg font-semibold">
            {formatValue(metrics.average)}
          </p>
        </div>
      )}

      {(metrics.change !== undefined ||
        metrics.changePercent !== undefined) && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Change</p>
          <div className="flex items-center gap-1">
            {getTrendIcon(metrics.trend)}
            <p className="text-lg font-semibold">
              {metrics.changePercent !== undefined
                ? `${metrics.changePercent > 0 ? "+" : ""}${
                    metrics.changePercent
                  }%`
                : formatValue(metrics.change)}
            </p>
          </div>
        </div>
      )}

      {(metrics.peak !== undefined || metrics.lowest !== undefined) && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Range</p>
          <p className="text-sm">
            {formatValue(metrics.lowest)} - {formatValue(metrics.peak)}
          </p>
        </div>
      )}
    </div>
  );
});

ChartMetrics.displayName = "ChartMetrics";

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (
    {
      id,
      className,
      children,
      config,
      data = [],
      title,
      description,
      metrics,
      loading = false,
      error,
      showControls = false,
      showMetrics = false,
      showLegend = false,
      exportable = false,
      refreshable = false,
      onRefresh,
      onExport,
      height,
      width,
      animate = false,
      interactive = true,
      variant,
      padding,
      border,
      ...props
    },
    ref
  ) => {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Loading state
    if (loading) {
      return (
        <div
          className={cn(
            chartContainerVariants({ variant, padding, border }),
            className
          )}
        >
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        </div>
      );
    }

    // Error state
    if (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      return (
        <div
          className={cn(
            chartContainerVariants({ variant, padding, border }),
            className
          )}
        >
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-sm font-medium">Failed to load chart</p>
                <p className="text-xs text-muted-foreground">{errorMessage}</p>
              </div>
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Empty state
    if (data.length === 0) {
      return (
        <div
          className={cn(
            chartContainerVariants({ variant, padding, border }),
            className
          )}
        >
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-center">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">No data available</p>
                <p className="text-xs text-muted-foreground">
                  Data will appear here when available
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const containerContent = (
      <ChartContext.Provider
        value={{ config, data, metrics, loading, error, interactive }}
      >
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            chartContainerVariants({ variant, padding, border }),
            // Enhanced Recharts styling
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-none",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-radial-bar-background-sector]:fill-muted",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-sector]:outline-none",
            "[&_.recharts-surface]:outline-none",
            // Focus styles for accessibility
            "[&_.recharts-layer:focus]:ring-2",
            "[&_.recharts-layer:focus]:ring-ring",
            "[&_.recharts-layer:focus]:ring-offset-2",
            className
          )}
          style={{
            height: height || "100%",
            width: width || "100%",
          }}
          {...props}
        >
          {/* Chart Header */}
          {(title || description || showControls) && (
            <ChartHeader
              title={title}
              description={description}
              showControls={showControls}
              onRefresh={refreshable ? onRefresh : undefined}
              onExport={exportable ? onExport : undefined}
            />
          )}

          {/* Chart Metrics */}
          {showMetrics && metrics && <ChartMetrics metrics={metrics} />}

          <ChartStyle id={chartId} config={config} />

          <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {containerContent}
        </motion.div>
      );
    }

    return containerContent;
  }
);

ChartContainer.displayName = "Chart";

// Enhanced ChartStyle with better CSS generation
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

// Enhanced Tooltip with better accessibility
const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: "line" | "dot" | "dashed";
      nameKey?: string;
      labelKey?: string;
      showIcon?: boolean;
      animated?: boolean;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      showIcon = true,
      animated = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>;
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== "dot";

    const tooltipContent = (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        role="tooltip"
        aria-live="polite"
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {showIcon && itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                          aria-hidden="true"
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                        {itemConfig?.description && (
                          <span className="text-xs text-muted-foreground/70">
                            {itemConfig.description}
                          </span>
                        )}
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {itemConfig?.format
                            ? itemConfig.format(item.value)
                            : typeof item.value === "number"
                            ? item.value.toLocaleString()
                            : item.value}
                          {itemConfig?.unit && (
                            <span className="text-muted-foreground ml-1">
                              {itemConfig.unit}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );

    if (animated) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            {tooltipContent}
          </motion.div>
        </AnimatePresence>
      );
    }

    return tooltipContent;
  }
);
ChartTooltipContent.displayName = "ChartTooltip";

// Enhanced Legend with better accessibility
const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean;
      nameKey?: string;
      interactive?: boolean;
      onToggle?: (dataKey: string) => void;
      hiddenItems?: Set<string>;
    }
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
      interactive = false,
      onToggle,
      hiddenItems = new Set(),
    },
    ref
  ) => {
    const { config } = useChart();

    if (!payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4 flex-wrap",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        role="group"
        aria-label="Chart legend"
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const isHidden = hiddenItems.has(key);

          return (
            <button
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground",
                interactive &&
                  "hover:bg-accent/50 px-2 py-1 rounded-sm transition-colors",
                isHidden && "opacity-50"
              )}
              onClick={interactive ? () => onToggle?.(key) : undefined}
              disabled={!interactive}
              aria-pressed={interactive ? !isHidden : undefined}
              aria-label={`${isHidden ? "Show" : "Hide"} ${
                itemConfig?.label || item.value
              }`}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: isHidden ? "#ccc" : item.color,
                  }}
                  aria-hidden="true"
                />
              )}
              <span className="text-sm">{itemConfig?.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";

// Utility function with enhanced payload handling
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

// Preset chart configurations for common use cases
export const chartPresets = {
  sales: {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
      unit: "$",
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    profit: {
      label: "Profit",
      color: "hsl(var(--chart-2))",
      unit: "$",
      format: (v: number) => `$${v.toLocaleString()}`,
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--chart-3))",
      format: (v: number) => v.toLocaleString(),
    },
  },
  analytics: {
    users: { label: "Users", color: "hsl(var(--chart-1))", icon: Users },
    sessions: { label: "Sessions", color: "hsl(var(--chart-2))" },
    pageviews: { label: "Page Views", color: "hsl(var(--chart-3))" },
    bounceRate: {
      label: "Bounce Rate",
      color: "hsl(var(--chart-4))",
      unit: "%",
      format: (v: number) => `${v}%`,
    },
  },
  performance: {
    cpu: {
      label: "CPU Usage",
      color: "hsl(var(--chart-1))",
      unit: "%",
      format: (v: number) => `${v}%`,
    },
    memory: { label: "Memory Usage", color: "hsl(var(--chart-2))", unit: "GB" },
    network: { label: "Network", color: "hsl(var(--chart-3))", unit: "MB/s" },
  },
} as const;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartHeader,
  ChartMetrics,
  useChart,
  type ChartConfig,
  type ChartContainerProps,
  type ChartDataPoint,
  type ChartMetrics as ChartMetricsType,
};
