import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  AlertTriangle,
  Bell,
  Activity,
  Shield,
  Users,
  MapPin,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced types
interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: "default" | "pills" | "underline" | "cards" | "emergency";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  lazy?: boolean;
  keepMounted?: boolean;
  scrollable?: boolean;
  addable?: boolean;
  closable?: boolean;
  onTabAdd?: () => void;
  onTabClose?: (value: string) => void;
  emergencyMode?: boolean;
}

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: "default" | "pills" | "underline" | "cards" | "emergency";
  size?: "sm" | "md" | "lg";
  scrollable?: boolean;
  addable?: boolean;
  onTabAdd?: () => void;
}

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
  badge?: string | number;
  closable?: boolean;
  disabled?: boolean;
  emergencyLevel?: "normal" | "warning" | "danger" | "critical";
  pulse?: boolean;
  onClose?: (value: string) => void;
  tooltip?: string;
  hidden?: boolean;
}

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  lazy?: boolean;
  keepMounted?: boolean;
  loading?: boolean;
  error?: string;
}

// Enhanced Tabs Root
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(
  (
    {
      variant = "default",
      size = "md",
      orientation = "horizontal",
      lazy = false,
      keepMounted = true,
      scrollable = false,
      addable = false,
      closable = false,
      onTabAdd,
      onTabClose,
      emergencyMode = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TabsPrimitive.Root
        ref={ref}
        orientation={orientation}
        className={cn(
          "w-full",
          orientation === "vertical" && "flex gap-4",
          emergencyMode &&
            "border-2 border-red-500 rounded-lg p-2 bg-red-50/50 dark:bg-red-950/20",
          className
        )}
        {...props}
      >
        <TabsContext.Provider
          value={{
            variant,
            size,
            orientation,
            lazy,
            keepMounted,
            scrollable,
            addable,
            closable,
            onTabAdd,
            onTabClose,
            emergencyMode,
          }}
        >
          {children}
        </TabsContext.Provider>
      </TabsPrimitive.Root>
    );
  }
);
Tabs.displayName = "Tabs";

// Context for sharing props
const TabsContext = React.createContext<{
  variant?: TabsProps["variant"];
  size?: TabsProps["size"];
  orientation?: TabsProps["orientation"];
  lazy?: boolean;
  keepMounted?: boolean;
  scrollable?: boolean;
  addable?: boolean;
  closable?: boolean;
  onTabAdd?: () => void;
  onTabClose?: (value: string) => void;
  emergencyMode?: boolean;
}>({});

const useTabsContext = () => React.useContext(TabsContext);

// Enhanced TabsList with scrolling and variants
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, children, ...props }, ref) => {
  const context = useTabsContext();
  const variant = props.variant || context.variant || "default";
  const size = props.size || context.size || "md";
  const scrollable = props.scrollable || context.scrollable;
  const addable = props.addable || context.addable;
  const onTabAdd = props.onTabAdd || context.onTabAdd;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Check scroll capability
  const checkScroll = React.useCallback(() => {
    if (!scrollable || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  }, [scrollable]);

  React.useEffect(() => {
    checkScroll();
    if (scrollable && scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScroll);
      return () =>
        scrollContainerRef.current?.removeEventListener("scroll", checkScroll);
    }
  }, [checkScroll, scrollable]);

  // Scroll functions
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  // Variant styles
  const variantClasses = {
    default: "bg-muted text-muted-foreground rounded-md",
    pills: "bg-muted text-muted-foreground rounded-full",
    underline: "bg-transparent border-b border-border",
    cards: "bg-transparent gap-1",
    emergency:
      "bg-red-100 text-red-800 border-2 border-red-300 rounded-md dark:bg-red-950 dark:text-red-200",
  };

  // Size styles
  const sizeClasses = {
    sm: "h-8 p-0.5",
    md: "h-10 p-1",
    lg: "h-12 p-1.5",
  };

  return (
    <div className="relative flex items-center">
      {/* Left scroll button */}
      {scrollable && canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="absolute left-0 z-10 bg-background/80 backdrop-blur-sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className={cn(scrollable && "overflow-x-auto scrollbar-hide px-8")}
      >
        <TabsPrimitive.List
          ref={ref}
          className={cn(
            "inline-flex items-center justify-center",
            variantClasses[variant],
            sizeClasses[size],
            scrollable && "min-w-full w-max",
            context.orientation === "vertical" && "flex-col h-auto w-auto",
            className
          )}
          {...props}
        >
          {children}

          {/* Add tab button */}
          {addable && onTabAdd && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onTabAdd}
                  className={cn(
                    "inline-flex items-center justify-center rounded-sm px-2 py-1.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    sizeClasses[size]
                  )}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Add new tab</TooltipContent>
            </Tooltip>
          )}
        </TabsPrimitive.List>
      </div>

      {/* Right scroll button */}
      {scrollable && canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="absolute right-0 z-10 bg-background/80 backdrop-blur-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
TabsList.displayName = "TabsList";

// Enhanced TabsTrigger with icons, badges, and emergency features
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    {
      className,
      icon,
      badge,
      closable,
      emergencyLevel = "normal",
      pulse = false,
      onClose,
      tooltip,
      hidden = false,
      value,
      children,
      ...props
    },
    ref
  ) => {
    const context = useTabsContext();
    const variant = context.variant || "default";
    const size = context.size || "md";

    if (hidden) return null;

    // Emergency level styles
    const emergencyClasses = {
      normal: "",
      warning:
        "border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20",
      danger:
        "border-l-4 border-orange-500 bg-orange-50/50 dark:bg-orange-950/20",
      critical:
        "border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 animate-pulse",
    };

    // Variant-specific styles
    const variantClasses = {
      default:
        "rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      pills:
        "rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      underline:
        "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent",
      cards:
        "rounded-lg border border-border bg-background data-[state=active]:border-primary data-[state=active]:shadow-md",
      emergency:
        "rounded-sm border border-red-300 data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    };

    // Size styles
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClose && value) {
        onClose(value);
      } else if (context.onTabClose && value) {
        context.onTabClose(value);
      }
    };

    const trigger = (
      <TabsPrimitive.Trigger
        ref={ref}
        value={value}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative group",
          variantClasses[variant],
          sizeClasses[size],
          emergencyClasses[emergencyLevel],
          pulse && "animate-pulse",
          context.emergencyMode && "border border-red-300",
          className
        )}
        {...props}
      >
        {/* Icon */}
        {icon && <span className="mr-2">{icon}</span>}

        {/* Content */}
        <span className="flex items-center gap-2">
          {children}

          {/* Badge */}
          {badge && (
            <Badge
              variant={
                emergencyLevel === "critical" ? "destructive" : "secondary"
              }
              className={cn(
                "ml-1 h-4 px-1 text-xs",
                emergencyLevel === "warning" && "bg-yellow-500 text-white",
                emergencyLevel === "danger" && "bg-orange-500 text-white"
              )}
            >
              {badge}
            </Badge>
          )}
        </span>

        {/* Close button */}
        {(closable || context.closable) && (
          <button
            onClick={handleClose}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground rounded-sm p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Emergency indicator */}
        {emergencyLevel !== "normal" && (
          <div
            className={cn(
              "absolute -top-1 -right-1 w-2 h-2 rounded-full",
              emergencyLevel === "warning" && "bg-yellow-500",
              emergencyLevel === "danger" && "bg-orange-500",
              emergencyLevel === "critical" && "bg-red-500 animate-ping"
            )}
          />
        )}
      </TabsPrimitive.Trigger>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{trigger}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      );
    }

    return trigger;
  }
);
TabsTrigger.displayName = "TabsTrigger";

// Enhanced TabsContent with lazy loading and error states
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(
  (
    {
      className,
      lazy = false,
      keepMounted = true,
      loading = false,
      error,
      value,
      children,
      ...props
    },
    ref
  ) => {
    const context = useTabsContext();
    const [hasBeenActive, setHasBeenActive] = React.useState(!lazy);

    // Track if tab has been activated for lazy loading
    React.useEffect(() => {
      if (!hasBeenActive) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "data-state" &&
              (mutation.target as HTMLElement).getAttribute("data-state") ===
                "active"
            ) {
              setHasBeenActive(true);
              observer.disconnect();
            }
          });
        });

        const element = document.querySelector(`[data-value="${value}"]`);
        if (element) {
          observer.observe(element, { attributes: true });
        }

        return () => observer.disconnect();
      }
    }, [hasBeenActive, value]);

    const shouldRender = !lazy || hasBeenActive || keepMounted;

    return (
      <TabsPrimitive.Content
        ref={ref}
        value={value}
        className={cn(
          "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          context.emergencyMode &&
            "border border-red-200 rounded p-4 bg-red-50/25 dark:bg-red-950/10",
          className
        )}
        {...props}
      >
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 p-4 border border-destructive/50 rounded-md bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-destructive font-medium">Error:</span>
            <span className="text-destructive">{error}</span>
          </div>
        )}

        {/* Content */}
        {!loading && !error && shouldRender && children}
      </TabsPrimitive.Content>
    );
  }
);
TabsContent.displayName = "TabsContent";

// Emergency Dashboard Tabs for Suraksha Sankat Sahayak
const EmergencyTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  TabsProps & {
    activeEmergencies?: number;
    responseTeams?: number;
    systemAlerts?: number;
  }
>(
  (
    { activeEmergencies = 0, responseTeams = 0, systemAlerts = 0, ...props },
    ref
  ) => {
    return (
      <Tabs ref={ref} variant="emergency" emergencyMode {...props}>
        <TabsList>
          <TabsTrigger
            value="overview"
            icon={<Activity className="h-4 w-4" />}
            tooltip="Emergency Overview"
          >
            Overview
          </TabsTrigger>

          <TabsTrigger
            value="active"
            icon={<AlertTriangle className="h-4 w-4" />}
            badge={activeEmergencies}
            emergencyLevel={activeEmergencies > 0 ? "critical" : "normal"}
            pulse={activeEmergencies > 0}
            tooltip="Active Emergencies"
          >
            Active Emergencies
          </TabsTrigger>

          <TabsTrigger
            value="teams"
            icon={<Users className="h-4 w-4" />}
            badge={responseTeams}
            emergencyLevel={responseTeams < 3 ? "warning" : "normal"}
            tooltip="Response Teams"
          >
            Response Teams
          </TabsTrigger>

          <TabsTrigger
            value="map"
            icon={<MapPin className="h-4 w-4" />}
            tooltip="Emergency Map"
          >
            Map View
          </TabsTrigger>

          <TabsTrigger
            value="alerts"
            icon={<Bell className="h-4 w-4" />}
            badge={systemAlerts}
            emergencyLevel={systemAlerts > 5 ? "danger" : "warning"}
            tooltip="System Alerts"
          >
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" lazy>
          <EmergencyOverview />
        </TabsContent>

        <TabsContent value="active" keepMounted>
          <ActiveEmergencies />
        </TabsContent>

        <TabsContent value="teams" lazy>
          <ResponseTeams />
        </TabsContent>

        <TabsContent value="map" lazy>
          <EmergencyMap />
        </TabsContent>

        <TabsContent value="alerts" lazy>
          <SystemAlerts />
        </TabsContent>
      </Tabs>
    );
  }
);
EmergencyTabs.displayName = "EmergencyTabs";

// Utility hook for managing dynamic tabs
export const useTabs = (
  initialTabs: Array<{ id: string; label: string; closable?: boolean }> = []
) => {
  const [tabs, setTabs] = React.useState(initialTabs);
  const [activeTab, setActiveTab] = React.useState(initialTabs[0]?.id);

  const addTab = React.useCallback(
    (tab: { id: string; label: string; closable?: boolean }) => {
      setTabs((prev) => [...prev, tab]);
      setActiveTab(tab.id);
    },
    []
  );

  const closeTab = React.useCallback(
    (id: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== id);
        if (activeTab === id && newTabs.length > 0) {
          setActiveTab(newTabs[0].id);
        }
        return newTabs;
      });
    },
    [activeTab]
  );

  const moveTab = React.useCallback((fromIndex: number, toIndex: number) => {
    setTabs((prev) => {
      const newTabs = [...prev];
      const [removed] = newTabs.splice(fromIndex, 1);
      newTabs.splice(toIndex, 0, removed);
      return newTabs;
    });
  }, []);

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    closeTab,
    moveTab,
  };
};

// Placeholder components (you would implement these)
const EmergencyOverview = () => <div>Emergency Overview Content</div>;
const ActiveEmergencies = () => <div>Active Emergencies Content</div>;
const ResponseTeams = () => <div>Response Teams Content</div>;
const EmergencyMap = () => <div>Emergency Map Content</div>;
const SystemAlerts = () => <div>System Alerts Content</div>;

export { Tabs, TabsList, TabsTrigger, TabsContent, EmergencyTabs };
