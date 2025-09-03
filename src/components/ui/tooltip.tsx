import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Shield,
  Zap,
  Clock,
  MapPin,
  Users,
  Bell,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Enhanced types
interface TooltipProviderProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider> {
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
  maxTooltips?: number;
  emergencyMode?: boolean;
}

interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
}

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  variant?: "default" | "info" | "warning" | "danger" | "success" | "emergency";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  closable?: boolean;
  persistent?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  showArrow?: boolean;
  emergencyLevel?: "normal" | "warning" | "danger" | "critical";
  priority?: "low" | "normal" | "high" | "urgent";
  category?: "help" | "warning" | "error" | "info" | "emergency" | "system";
  shortcut?: string;
  timestamp?: Date;
  location?: string;
  onClose?: () => void;
}

const TooltipProvider = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Provider>,
  TooltipProviderProps
>(
  (
    {
      delayDuration = 700,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      maxTooltips = 5,
      emergencyMode = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverableContent={disableHoverableContent}
        {...props}
      >
        <div
          data-tooltip-emergency={emergencyMode}
          data-max-tooltips={maxTooltips}
        >
          {children}
        </div>
      </TooltipPrimitive.Provider>
    );
  }
);
TooltipProvider.displayName = "TooltipProvider";

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Root>,
  TooltipProps
>(({ delayDuration, disableHoverableContent, children, ...props }, ref) => {
  return (
    <TooltipPrimitive.Root
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    >
      {children}
    </TooltipPrimitive.Root>
  );
});
Tooltip.displayName = "Tooltip";

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      variant = "default",
      size = "md",
      icon,
      title,
      description,
      actions,
      closable = false,
      persistent = false,
      maxWidth = "sm",
      showArrow = true,
      emergencyLevel = "normal",
      priority = "normal",
      category = "info",
      shortcut,
      timestamp,
      location,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(true);

    // Variant styles
    const variantClasses = {
      default: "bg-popover text-popover-foreground border",
      info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950 dark:text-blue-100 dark:border-blue-800",
      warning:
        "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-100 dark:border-yellow-800",
      danger:
        "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-100 dark:border-red-800",
      success:
        "bg-green-50 text-green-900 border-green-200 dark:bg-green-950 dark:text-green-100 dark:border-green-800",
      emergency:
        "bg-red-100 text-red-900 border-red-300 shadow-red-500/25 shadow-lg dark:bg-red-900 dark:text-red-100 dark:border-red-700",
    };

    // Size styles
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    // Max width styles
    const maxWidthClasses = {
      xs: "max-w-xs",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      none: "max-w-none",
    };

    // Emergency level styling
    const emergencyClasses = {
      normal: "",
      warning: "ring-2 ring-yellow-500/50",
      danger: "ring-2 ring-orange-500/50",
      critical: "ring-4 ring-red-500/75 animate-pulse",
    };

    // Priority styling
    const priorityClasses = {
      low: "",
      normal: "",
      high: "shadow-lg",
      urgent: "shadow-xl ring-2 ring-red-500/50",
    };

    // Get appropriate icon
    const getIcon = () => {
      if (icon) return icon;

      const iconMap = {
        help: <HelpCircle className="h-4 w-4" />,
        warning: <AlertTriangle className="h-4 w-4" />,
        error: <AlertCircle className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        emergency: <Zap className="h-4 w-4" />,
        system: <Settings className="h-4 w-4" />,
      };

      return iconMap[category];
    };

    // Format timestamp
    const formatTimestamp = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date);
    };

    const handleClose = () => {
      setIsOpen(false);
      onClose?.();
    };

    if (!isOpen && closable) return null;

    return (
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          variantClasses[variant],
          sizeClasses[size],
          maxWidthClasses[maxWidth],
          emergencyClasses[emergencyLevel],
          priorityClasses[priority],
          persistent && "duration-0",
          className
        )}
        {...props}
      >
        {/* Arrow */}
        {showArrow && <TooltipPrimitive.Arrow className="fill-current" />}

        <div className="relative">
          {/* Close button */}
          {closable && (
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 p-1 rounded-sm hover:bg-black/10 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}

          {/* Header */}
          {(title || getIcon()) && (
            <div className="flex items-start gap-2 mb-2">
              {getIcon() && (
                <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
              )}
              {title && (
                <div className="font-semibold leading-tight">{title}</div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            {description && (
              <div className="text-sm leading-relaxed opacity-90">
                {description}
              </div>
            )}

            {children && <div className="text-sm">{children}</div>}
          </div>

          {/* Metadata */}
          {(shortcut || timestamp || location) && (
            <div className="mt-3 pt-2 border-t border-current/10 space-y-1">
              {shortcut && (
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <span>Shortcut:</span>
                  <kbd className="px-1 py-0.5 bg-black/10 rounded border text-xs">
                    {shortcut}
                  </kbd>
                </div>
              )}

              {timestamp && (
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(timestamp)}
                </div>
              )}

              {location && (
                <div className="flex items-center gap-1 text-xs opacity-75">
                  <MapPin className="h-3 w-3" />
                  {location}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {actions && (
            <div className="mt-3 pt-2 border-t border-current/10 flex gap-2">
              {actions}
            </div>
          )}

          {/* Emergency indicator */}
          {emergencyLevel !== "normal" && (
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </div>
      </TooltipPrimitive.Content>
    );
  }
);
TooltipContent.displayName = "TooltipContent";

// Emergency Tooltip for critical alerts
const EmergencyTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  TooltipProps & {
    emergencyType?:
      | "fire"
      | "medical"
      | "security"
      | "natural_disaster"
      | "technical";
    severity?: "low" | "medium" | "high" | "critical";
    responseTime?: number;
    assignedTeam?: string;
    location?: string;
    instructions?: string;
    onAcknowledge?: () => void;
    onDispatch?: () => void;
  }
>(
  (
    {
      emergencyType = "security",
      severity = "medium",
      responseTime,
      assignedTeam,
      location,
      instructions,
      onAcknowledge,
      onDispatch,
      children,
      ...props
    },
    ref
  ) => {
    const emergencyIcons = {
      fire: <Zap className="h-5 w-5 text-red-600" />,
      medical: <AlertCircle className="h-5 w-5 text-blue-600" />,
      security: <Shield className="h-5 w-5 text-yellow-600" />,
      natural_disaster: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      technical: <Settings className="h-5 w-5 text-purple-600" />,
    };

    const severityVariants = {
      low: "warning" as const,
      medium: "warning" as const,
      high: "danger" as const,
      critical: "emergency" as const,
    };

    const severityLevels = {
      low: "warning" as const,
      medium: "warning" as const,
      high: "danger" as const,
      critical: "critical" as const,
    };

    return (
      <Tooltip {...props}>
        {children}
        <TooltipContent
          variant={severityVariants[severity]}
          emergencyLevel={severityLevels[severity]}
          size="lg"
          maxWidth="md"
          persistent
          closable
          icon={emergencyIcons[emergencyType]}
          title={`${emergencyType.toUpperCase()} EMERGENCY`}
          description={instructions}
          location={location}
          timestamp={new Date()}
          actions={
            <div className="flex gap-2">
              {onAcknowledge && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  Acknowledge
                </Button>
              )}
              {onDispatch && (
                <Button size="sm" variant="destructive" onClick={onDispatch}>
                  Dispatch Team
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-2">
            {assignedTeam && (
              <div className="flex items-center gap-1 text-xs">
                <Users className="h-3 w-3" />
                <span className="font-medium">Team:</span>
                <Badge variant="secondary">{assignedTeam}</Badge>
              </div>
            )}

            {responseTime && (
              <div className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                <span className="font-medium">ETA:</span>
                <Badge variant="outline">{responseTime} min</Badge>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }
);
EmergencyTooltip.displayName = "EmergencyTooltip";

// Help Tooltip with rich content
const HelpTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  TooltipProps & {
    title?: string;
    description?: string;
    shortcut?: string;
    learnMoreUrl?: string;
    onLearnMore?: () => void;
  }
>(
  (
    {
      title = "Help",
      description,
      shortcut,
      learnMoreUrl,
      onLearnMore,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <Tooltip delayDuration={300} {...props}>
        {children}
        <TooltipContent
          variant="info"
          size="md"
          maxWidth="sm"
          icon={<HelpCircle className="h-4 w-4" />}
          title={title}
          description={description}
          shortcut={shortcut}
          actions={
            (learnMoreUrl || onLearnMore) && (
              <Button size="sm" variant="ghost" onClick={onLearnMore}>
                Learn More
              </Button>
            )
          }
        />
      </Tooltip>
    );
  }
);
HelpTooltip.displayName = "HelpTooltip";

// Status Tooltip for system monitoring
const StatusTooltip = React.forwardRef<
  React.ElementRef<typeof Tooltip>,
  TooltipProps & {
    status: "online" | "offline" | "warning" | "error" | "maintenance";
    systemName: string;
    lastUpdate?: Date;
    uptime?: string;
    details?: string;
    onRestart?: () => void;
    onMaintenance?: () => void;
  }
>(
  (
    {
      status,
      systemName,
      lastUpdate,
      uptime,
      details,
      onRestart,
      onMaintenance,
      children,
      ...props
    },
    ref
  ) => {
    const statusConfig = {
      online: {
        variant: "success" as const,
        icon: <CheckCircle className="h-4 w-4" />,
        text: "Online",
      },
      offline: {
        variant: "danger" as const,
        icon: <AlertCircle className="h-4 w-4" />,
        text: "Offline",
      },
      warning: {
        variant: "warning" as const,
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Warning",
      },
      error: {
        variant: "danger" as const,
        icon: <AlertCircle className="h-4 w-4" />,
        text: "Error",
      },
      maintenance: {
        variant: "info" as const,
        icon: <Settings className="h-4 w-4" />,
        text: "Maintenance",
      },
    };

    const config = statusConfig[status];

    return (
      <Tooltip {...props}>
        {children}
        <TooltipContent
          variant={config.variant}
          size="md"
          maxWidth="sm"
          icon={config.icon}
          title={`${systemName} - ${config.text}`}
          description={details}
          timestamp={lastUpdate}
          actions={
            <div className="flex gap-2">
              {onRestart && status === "offline" && (
                <Button size="sm" variant="outline" onClick={onRestart}>
                  Restart
                </Button>
              )}
              {onMaintenance && (
                <Button size="sm" variant="ghost" onClick={onMaintenance}>
                  Maintenance
                </Button>
              )}
            </div>
          }
        >
          {uptime && <div className="text-xs opacity-75">Uptime: {uptime}</div>}
        </TooltipContent>
      </Tooltip>
    );
  }
);
StatusTooltip.displayName = "StatusTooltip";

// Utility hook for tooltip management
export const useTooltip = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const show = React.useCallback((x?: number, y?: number) => {
    if (x !== undefined && y !== undefined) {
      setPosition({ x, y });
    }
    setIsOpen(true);
  }, []);

  const hide = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    position,
    show,
    hide,
    toggle,
    setPosition,
  };
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  EmergencyTooltip,
  HelpTooltip,
  StatusTooltip,
};
