import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps, cva } from "class-variance-authority";
import {
  AlertTriangle,
  Shield,
  Bell,
  Users,
  MapPin,
  Activity,
  Zap,
  Clock,
  Settings,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Enhanced toggle variants
const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground hover:bg-muted hover:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        emergency:
          "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 data-[state=on]:bg-red-500 data-[state=on]:text-white dark:bg-red-950 dark:text-red-200",
        warning:
          "border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 data-[state=on]:bg-yellow-500 data-[state=on]:text-white dark:bg-yellow-950 dark:text-yellow-200",
        success:
          "border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 data-[state=on]:bg-green-500 data-[state=on]:text-white dark:bg-green-950 dark:text-green-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        security:
          "border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 data-[state=on]:bg-orange-500 data-[state=on]:text-white dark:bg-orange-950 dark:text-orange-200",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced types
interface ToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
  exclusive?: boolean;
  allowEmpty?: boolean;
  emergencyMode?: boolean;
  showLabels?: boolean;
  iconPosition?: "left" | "right" | "top" | "bottom";
  onSelectionChange?: (values: string[]) => void;
}

interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof toggleVariants> {
  icon?: React.ReactNode;
  badge?: string | number;
  tooltip?: string;
  emergencyLevel?: "normal" | "warning" | "danger" | "critical";
  pulse?: boolean;
  disabled?: boolean;
  locked?: boolean;
  shortcut?: string;
  description?: string;
}

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical";
    spacing?: "none" | "sm" | "md" | "lg";
    emergencyMode?: boolean;
    showLabels?: boolean;
    iconPosition?: "left" | "right" | "top" | "bottom";
  }
>({
  size: "default",
  variant: "default",
});

// Enhanced ToggleGroup with advanced features
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(
  (
    {
      className,
      variant,
      size,
      orientation = "horizontal",
      spacing = "sm",
      exclusive = false,
      allowEmpty = true,
      emergencyMode = false,
      showLabels = false,
      iconPosition = "left",
      onSelectionChange,
      children,
      ...props
    },
    ref
  ) => {
    const [selection, setSelection] = React.useState<string[]>([]);

    // Handle selection changes
    const handleValueChange = React.useCallback(
      (value: string | string[]) => {
        const newSelection = Array.isArray(value) ? value : [value];
        setSelection(newSelection);
        onSelectionChange?.(newSelection);
      },
      [onSelectionChange]
    );

    // Spacing classes
    const spacingClasses = {
      none: "gap-0",
      sm: "gap-1",
      md: "gap-2",
      lg: "gap-4",
    };

    return (
      <TooltipProvider>
        <ToggleGroupPrimitive.Root
          ref={ref}
          type={exclusive ? "single" : "multiple"}
          className={cn(
            "flex items-center justify-center",
            orientation === "vertical" && "flex-col",
            spacingClasses[spacing],
            emergencyMode &&
              "p-2 border-2 border-red-500 rounded-lg bg-red-50/50 dark:bg-red-950/20",
            className
          )}
          onValueChange={handleValueChange}
          {...props}
        >
          <ToggleGroupContext.Provider
            value={{
              variant,
              size,
              orientation,
              spacing,
              emergencyMode,
              showLabels,
              iconPosition,
            }}
          >
            {children}
          </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive.Root>
      </TooltipProvider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

// Enhanced ToggleGroupItem with emergency features
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(
  (
    {
      className,
      children,
      variant,
      size,
      icon,
      badge,
      tooltip,
      emergencyLevel = "normal",
      pulse = false,
      disabled = false,
      locked = false,
      shortcut,
      description,
      value,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ToggleGroupContext);
    const [isPressed, setIsPressed] = React.useState(false);

    // Emergency level styling
    const emergencyClasses = {
      normal: "",
      warning: "ring-2 ring-yellow-500/50",
      danger: "ring-2 ring-orange-500/50",
      critical: "ring-4 ring-red-500/75 animate-pulse",
    };

    // Keyboard shortcuts
    React.useEffect(() => {
      if (!shortcut) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === shortcut.toLowerCase()
        ) {
          event.preventDefault();
          const element = document.querySelector(
            `[data-value="${value}"]`
          ) as HTMLElement;
          element?.click();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [shortcut, value]);

    const effectiveVariant = context.variant || variant;
    const effectiveSize = context.size || size;

    // Get emergency variant if emergency level is set
    const getVariantFromEmergencyLevel = () => {
      switch (emergencyLevel) {
        case "critical":
          return "emergency";
        case "danger":
          return "emergency";
        case "warning":
          return "warning";
        default:
          return effectiveVariant;
      }
    };

    const finalVariant =
      emergencyLevel !== "normal"
        ? getVariantFromEmergencyLevel()
        : effectiveVariant;

    const toggleItem = (
      <ToggleGroupPrimitive.Item
        ref={ref}
        value={value}
        disabled={disabled || locked}
        className={cn(
          toggleVariants({ variant: finalVariant, size: effectiveSize }),
          emergencyClasses[emergencyLevel],
          pulse && "animate-pulse",
          locked && "cursor-not-allowed opacity-60",
          context.orientation === "vertical" &&
            context.showLabels &&
            "flex-col gap-1 h-auto py-2",
          context.iconPosition === "top" && "flex-col gap-1",
          context.iconPosition === "bottom" && "flex-col-reverse gap-1",
          context.iconPosition === "right" && "flex-row-reverse",
          isPressed && "scale-95",
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span
            className={cn(
              "flex items-center justify-center",
              (context.iconPosition === "left" ||
                context.iconPosition === "right") &&
                children &&
                "mr-2",
              context.iconPosition === "right" && children && "mr-0 ml-2"
            )}
          >
            {icon}
          </span>
        )}

        {/* Content */}
        <span className="flex items-center justify-center gap-1">
          {children}

          {/* Badge */}
          {badge && (
            <Badge
              variant={
                emergencyLevel === "critical"
                  ? "destructive"
                  : emergencyLevel === "danger"
                  ? "destructive"
                  : emergencyLevel === "warning"
                  ? "secondary"
                  : "secondary"
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

        {/* Locked indicator */}
        {locked && <Lock className="h-3 w-3 ml-1 opacity-60" />}

        {/* Shortcut indicator */}
        {shortcut && (
          <kbd className="ml-2 px-1 py-0.5 text-xs bg-muted rounded border border-border">
            {shortcut}
          </kbd>
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
      </ToggleGroupPrimitive.Item>
    );

    // Wrap with tooltip if provided
    if (tooltip || description) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{toggleItem}</TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {tooltip && <div className="font-medium">{tooltip}</div>}
              {description && (
                <div className="text-xs opacity-75">{description}</div>
              )}
              {shortcut && (
                <div className="text-xs opacity-75">
                  Shortcut: Ctrl+{shortcut}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }

    return toggleItem;
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

// Emergency Control Panel for Suraksha Sankat Sahayak
const EmergencyControlToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroup>,
  ToggleGroupProps & {
    activeEmergencies?: number;
    systemStatus?: "operational" | "warning" | "critical";
    onEmergencyToggle?: (system: string, enabled: boolean) => void;
  }
>(
  (
    {
      activeEmergencies = 0,
      systemStatus = "operational",
      onEmergencyToggle,
      ...props
    },
    ref
  ) => {
    const [activeSystems, setActiveSystems] = React.useState<string[]>([]);

    const handleSelectionChange = React.useCallback(
      (values: string[]) => {
        setActiveSystems(values);

        // Notify about specific system changes
        values.forEach((system) => {
          if (!activeSystems.includes(system)) {
            onEmergencyToggle?.(system, true);
          }
        });

        activeSystems.forEach((system) => {
          if (!values.includes(system)) {
            onEmergencyToggle?.(system, false);
          }
        });
      },
      [activeSystems, onEmergencyToggle]
    );

    return (
      <ToggleGroup
        ref={ref}
        variant="emergency"
        size="lg"
        emergencyMode={systemStatus === "critical"}
        onSelectionChange={handleSelectionChange}
        {...props}
      >
        <ToggleGroupItem
          value="alerts"
          icon={<Bell className="h-5 w-5" />}
          badge={activeEmergencies}
          emergencyLevel={activeEmergencies > 0 ? "critical" : "normal"}
          pulse={activeEmergencies > 0}
          tooltip="Emergency Alert System"
          description="Broadcast emergency notifications"
          shortcut="A"
        >
          Alert System
        </ToggleGroupItem>

        <ToggleGroupItem
          value="sirens"
          icon={<Volume2 className="h-5 w-5" />}
          emergencyLevel={systemStatus === "critical" ? "critical" : "normal"}
          tooltip="Emergency Sirens"
          description="Activate emergency warning sirens"
          shortcut="S"
        >
          Sirens
        </ToggleGroupItem>

        <ToggleGroupItem
          value="lockdown"
          icon={<Lock className="h-5 w-5" />}
          emergencyLevel="danger"
          tooltip="Security Lockdown"
          description="Initiate facility lockdown protocol"
          shortcut="L"
        >
          Lockdown
        </ToggleGroupItem>

        <ToggleGroupItem
          value="teams"
          icon={<Users className="h-5 w-5" />}
          tooltip="Response Teams"
          description="Deploy emergency response teams"
          shortcut="T"
        >
          Response Teams
        </ToggleGroupItem>

        <ToggleGroupItem
          value="communications"
          icon={<Activity className="h-5 w-5" />}
          emergencyLevel={systemStatus === "warning" ? "warning" : "normal"}
          tooltip="Emergency Communications"
          description="Emergency communication channels"
          shortcut="C"
        >
          Communications
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
);
EmergencyControlToggleGroup.displayName = "EmergencyControlToggleGroup";

// View Mode Toggle Group
const ViewModeToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroup>,
  ToggleGroupProps & {
    defaultMode?: "map" | "list" | "grid";
    onModeChange?: (mode: string) => void;
  }
>(({ defaultMode = "map", onModeChange, ...props }, ref) => {
  const handleSelectionChange = React.useCallback(
    (values: string[]) => {
      if (values.length > 0) {
        onModeChange?.(values[0]);
      }
    },
    [onModeChange]
  );

  return (
    <ToggleGroup
      ref={ref}
      type="single"
      defaultValue={defaultMode}
      exclusive
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      <ToggleGroupItem
        value="map"
        icon={<MapPin className="h-4 w-4" />}
        tooltip="Map View"
        shortcut="M"
      >
        Map
      </ToggleGroupItem>

      <ToggleGroupItem
        value="list"
        icon={<Activity className="h-4 w-4" />}
        tooltip="List View"
        shortcut="L"
      >
        List
      </ToggleGroupItem>

      <ToggleGroupItem
        value="grid"
        icon={<Settings className="h-4 w-4" />}
        tooltip="Grid View"
        shortcut="G"
      >
        Grid
      </ToggleGroupItem>
    </ToggleGroup>
  );
});
ViewModeToggleGroup.displayName = "ViewModeToggleGroup";

// Utility hook for toggle group state management
export const useToggleGroup = (
  initialValues: string[] = [],
  exclusive = false
) => {
  const [selected, setSelected] = React.useState<string[]>(initialValues);

  const toggle = React.useCallback(
    (value: string) => {
      setSelected((prev) => {
        if (exclusive) {
          return prev.includes(value) ? [] : [value];
        } else {
          return prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value];
        }
      });
    },
    [exclusive]
  );

  const selectOnly = React.useCallback((value: string) => {
    setSelected([value]);
  }, []);

  const selectAll = React.useCallback(
    (values: string[]) => {
      setSelected(exclusive ? [values[0]] : values);
    },
    [exclusive]
  );

  const clear = React.useCallback(() => {
    setSelected([]);
  }, []);

  const isSelected = React.useCallback(
    (value: string) => {
      return selected.includes(value);
    },
    [selected]
  );

  return {
    selected,
    toggle,
    selectOnly,
    selectAll,
    clear,
    isSelected,
    hasSelection: selected.length > 0,
    count: selected.length,
  };
};

export {
  ToggleGroup,
  ToggleGroupItem,
  EmergencyControlToggleGroup,
  ViewModeToggleGroup,
  toggleVariants,
};
