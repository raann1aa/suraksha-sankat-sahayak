import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import {
  PanelLeft,
  Search,
  Settings,
  Bell,
  Shield,
  AlertTriangle,
  Lock,
  Unlock,
  Pin,
  PinOff,
  ChevronDown,
  ChevronRight,
  Users,
  Activity,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_WIDTH_WIDE = "20rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// Enhanced types
type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  isPinned: boolean;
  setPinned: (pinned: boolean) => void;
  isLocked: boolean;
  setLocked: (locked: boolean) => void;
  theme: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;
  width: "normal" | "wide";
  setWidth: (width: "normal" | "wide") => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

// Enhanced Provider with additional features
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultPinned?: boolean;
    defaultLocked?: boolean;
    defaultWidth?: "normal" | "wide";
    enablePersistence?: boolean;
    emergencyMode?: boolean;
    userRole?: "admin" | "operator" | "viewer";
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      defaultPinned = false,
      defaultLocked = false,
      defaultWidth = "normal",
      enablePersistence = true,
      emergencyMode = false,
      userRole = "viewer",
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [isPinned, setIsPinned] = React.useState(defaultPinned);
    const [isLocked, setIsLocked] = React.useState(defaultLocked);
    const [theme, setTheme] = React.useState<"light" | "dark" | "auto">("auto");
    const [width, setWidth] = React.useState<"normal" | "wide">(defaultWidth);

    // Load preferences from localStorage
    React.useEffect(() => {
      if (!enablePersistence) return;

      try {
        const saved = localStorage.getItem(
          `${SIDEBAR_COOKIE_NAME}-preferences`
        );
        if (saved) {
          const preferences = JSON.parse(saved);
          setIsPinned(preferences.pinned ?? defaultPinned);
          setIsLocked(preferences.locked ?? defaultLocked);
          setTheme(preferences.theme ?? "auto");
          setWidth(preferences.width ?? defaultWidth);
        }
      } catch (error) {
        console.warn("Failed to load sidebar preferences:", error);
      }
    }, [enablePersistence, defaultPinned, defaultLocked, defaultWidth]);

    // Save preferences to localStorage
    const savePreferences = React.useCallback(() => {
      if (!enablePersistence) return;

      try {
        const preferences = {
          pinned: isPinned,
          locked: isLocked,
          theme,
          width,
        };
        localStorage.setItem(
          `${SIDEBAR_COOKIE_NAME}-preferences`,
          JSON.stringify(preferences)
        );
      } catch (error) {
        console.warn("Failed to save sidebar preferences:", error);
      }
    }, [isPinned, isLocked, theme, width, enablePersistence]);

    React.useEffect(() => {
      savePreferences();
    }, [savePreferences]);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        // Prevent closing if locked
        if (isLocked && typeof value === "boolean" && !value) return;
        if (isLocked && typeof value === "function" && !value(open)) return;

        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        if (enablePersistence) {
          document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
      },
      [setOpenProp, open, isLocked, enablePersistence]
    );

    const setPinned = React.useCallback(
      (pinned: boolean) => {
        setIsPinned(pinned);
        if (pinned) {
          setOpen(true);
        }
      },
      [setOpen]
    );

    const setLocked = React.useCallback(
      (locked: boolean) => {
        setIsLocked(locked);
        if (locked) {
          setOpen(true);
        }
      },
      [setOpen]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    // Enhanced keyboard shortcuts
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.metaKey || event.ctrlKey) {
          switch (event.key) {
            case SIDEBAR_KEYBOARD_SHORTCUT:
              event.preventDefault();
              toggleSidebar();
              break;
            case "p":
              if (event.shiftKey) {
                event.preventDefault();
                setPinned(!isPinned);
              }
              break;
            case "l":
              if (event.shiftKey && userRole === "admin") {
                event.preventDefault();
                setLocked(!isLocked);
              }
              break;
          }
        }

        // Emergency mode shortcuts
        if (emergencyMode && event.key === "Escape") {
          setOpen(false);
          setOpenMobile(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
      toggleSidebar,
      isPinned,
      isLocked,
      setPinned,
      setLocked,
      userRole,
      emergencyMode,
      setOpen,
      setOpenMobile,
    ]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        isPinned,
        setPinned,
        isLocked,
        setLocked,
        theme,
        setTheme,
        width,
        setWidth,
      }),
      [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        isPinned,
        setPinned,
        isLocked,
        setLocked,
        theme,
        setTheme,
        width,
        setWidth,
      ]
    );

    const sidebarWidth = width === "wide" ? SIDEBAR_WIDTH_WIDE : SIDEBAR_WIDTH;

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": sidebarWidth,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              emergencyMode && "bg-red-50 dark:bg-red-950/20",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

// Enhanced Sidebar with security and emergency features
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset" | "emergency";
    collapsible?: "offcanvas" | "icon" | "none";
    showHeader?: boolean;
    showFooter?: boolean;
    emergencyMode?: boolean;
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      showHeader = true,
      showFooter = true,
      emergencyMode = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const {
      isMobile,
      state,
      openMobile,
      setOpenMobile,
      isPinned,
      isLocked,
      width,
    } = useSidebar();

    const sidebarWidth = width === "wide" ? SIDEBAR_WIDTH_WIDE : SIDEBAR_WIDTH;

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full flex-col bg-sidebar text-sidebar-foreground",
            `w-[${sidebarWidth}]`,
            emergencyMode &&
              "border-2 border-red-500 bg-red-50 dark:bg-red-950/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className={cn(
              "w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
              emergencyMode && "border-l-4 border-red-500"
            )}
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        data-pinned={isPinned}
        data-locked={isLocked}
        data-width={width}
      >
        <div
          className={cn(
            "duration-200 relative h-svh bg-transparent transition-[width] ease-linear",
            `w-[${sidebarWidth}]`,
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-linear md:flex",
            `w-[${sidebarWidth}]`,
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            emergencyMode && "border-r-4 border-red-500",
            isPinned && "z-50",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col bg-sidebar",
              variant === "floating" &&
                "rounded-lg border border-sidebar-border shadow",
              variant === "emergency" &&
                "bg-red-50 border-2 border-red-200 dark:bg-red-950/20 dark:border-red-800",
              emergencyMode && "bg-red-50 dark:bg-red-950/20"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

// Enhanced Header with controls
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showControls?: boolean;
    title?: string;
    subtitle?: string;
    avatar?: React.ReactNode;
    emergencyStatus?: "normal" | "warning" | "critical";
  }
>(
  (
    {
      className,
      showControls = true,
      title,
      subtitle,
      avatar,
      emergencyStatus = "normal",
      children,
      ...props
    },
    ref
  ) => {
    const { isPinned, setPinned, isLocked, setLocked, width, setWidth, state } =
      useSidebar();

    const statusColors = {
      normal: "bg-green-500",
      warning: "bg-yellow-500",
      critical: "bg-red-500",
    };

    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn(
          "flex flex-col gap-2 p-2 border-b border-sidebar-border",
          className
        )}
        {...props}
      >
        {(title || subtitle || avatar) && (
          <div className="flex items-center gap-2">
            {avatar}
            <div className="flex-1 min-w-0">
              {title && (
                <div className="font-semibold text-sm truncate group-data-[collapsible=icon]:hidden">
                  {title}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-muted-foreground truncate group-data-[collapsible=icon]:hidden">
                  {subtitle}
                </div>
              )}
            </div>
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                statusColors[emergencyStatus]
              )}
            />
          </div>
        )}

        {showControls && state === "expanded" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPinned(!isPinned)}
                    className="h-6 w-6 p-0"
                  >
                    {isPinned ? (
                      <Pin className="h-3 w-3" />
                    ) : (
                      <PinOff className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPinned ? "Unpin sidebar" : "Pin sidebar"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocked(!isLocked)}
                    className="h-6 w-6 p-0"
                  >
                    {isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isLocked ? "Unlock sidebar" : "Lock sidebar"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setWidth(width === "normal" ? "wide" : "normal")
                    }
                    className="h-6 w-6 p-0"
                  >
                    <PanelLeft className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {width === "normal" ? "Wide sidebar" : "Normal sidebar"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {children}
      </div>
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

// Enhanced Menu Button with emergency indicators
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
    badge?: string | number;
    emergencyLevel?: "normal" | "warning" | "critical";
    pulse?: boolean;
    rightSlot?: React.ReactNode;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      badge,
      emergencyLevel = "normal",
      pulse = false,
      rightSlot,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();

    const emergencyClasses = {
      normal: "",
      warning: "border-l-2 border-yellow-500",
      critical: "border-l-2 border-red-500 bg-red-50/50 dark:bg-red-950/20",
    };

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        data-emergency={emergencyLevel}
        className={cn(
          sidebarMenuButtonVariants({ variant, size }),
          emergencyClasses[emergencyLevel],
          pulse && "animate-pulse",
          "relative",
          className
        )}
        {...props}
      >
        {children}

        {badge && (
          <Badge
            variant="secondary"
            className={cn(
              "ml-auto h-5 px-1 text-xs",
              emergencyLevel === "critical" && "bg-red-500 text-white",
              emergencyLevel === "warning" && "bg-yellow-500 text-white"
            )}
          >
            {badge}
          </Badge>
        )}

        {rightSlot}
      </Comp>
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = { children: tooltip };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

// Emergency-specific components for Suraksha Sankat Sahayak
const EmergencyStatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    status: "safe" | "warning" | "danger" | "critical";
    count?: number;
  }
>(({ status, count, className, ...props }, ref) => {
  const statusConfig = {
    safe: { color: "bg-green-500", icon: Shield },
    warning: { color: "bg-yellow-500", icon: AlertTriangle },
    danger: { color: "bg-orange-500", icon: AlertTriangle },
    critical: { color: "bg-red-500", icon: AlertTriangle },
  };

  const { color, icon: Icon } = statusConfig[status];

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border",
        status === "critical" &&
          "animate-pulse bg-red-50 border-red-200 dark:bg-red-950/20",
        className
      )}
      {...props}
    >
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium capitalize">{status}</span>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {count}
        </Badge>
      )}
    </div>
  );
});
EmergencyStatusIndicator.displayName = "EmergencyStatusIndicator";

const QuickActionPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    actions?: Array<{
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
      variant?: "default" | "destructive";
    }>;
  }
>(({ actions = [], className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-2 gap-2 p-2", className)}
      {...props}
    >
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "outline"}
          size="sm"
          onClick={action.onClick}
          className="flex items-center gap-1 text-xs"
        >
          {action.icon}
          <span className="group-data-[collapsible=icon]:hidden">
            {action.label}
          </span>
        </Button>
      ))}
    </div>
  );
});
QuickActionPanel.displayName = "QuickActionPanel";

// Re-export enhanced components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  EmergencyStatusIndicator,
  QuickActionPanel,
};
