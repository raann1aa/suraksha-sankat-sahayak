import {
  GripVertical,
  Maximize2,
  Minimize2,
  RotateCcw,
  Lock,
  Unlock,
} from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced types
interface ResizablePanelGroupProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelGroup> {
  className?: string;
  onLayoutChange?: (sizes: number[]) => void;
  storageKey?: string;
  autoSaveLayout?: boolean;
}

interface ResizablePanelProps
  extends React.ComponentProps<typeof ResizablePrimitive.Panel> {
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  minSizePercent?: number;
  maxSizePercent?: number;
  onCollapse?: (collapsed: boolean) => void;
  onResize?: (size: number) => void;
}

interface ResizableHandleProps
  extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "thick" | "minimal" | "dashed";
  showTooltip?: boolean;
  tooltipText?: string;
}

// Enhanced Panel Group with layout persistence and callbacks
const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  ResizablePanelGroupProps
>(
  (
    {
      className,
      onLayoutChange,
      storageKey,
      autoSaveLayout = false,
      children,
      ...props
    },
    ref
  ) => {
    const [layout, setLayout] = React.useState<number[]>([]);

    // Load saved layout on mount
    React.useEffect(() => {
      if (storageKey && autoSaveLayout) {
        const savedLayout = localStorage.getItem(
          `resizable-layout-${storageKey}`
        );
        if (savedLayout) {
          try {
            const parsedLayout = JSON.parse(savedLayout);
            setLayout(parsedLayout);
          } catch (error) {
            console.warn("Failed to parse saved layout:", error);
          }
        }
      }
    }, [storageKey, autoSaveLayout]);

    // Handle layout changes
    const handleLayoutChange = React.useCallback(
      (sizes: number[]) => {
        setLayout(sizes);
        onLayoutChange?.(sizes);

        // Auto-save layout
        if (storageKey && autoSaveLayout) {
          localStorage.setItem(
            `resizable-layout-${storageKey}`,
            JSON.stringify(sizes)
          );
        }
      },
      [onLayoutChange, storageKey, autoSaveLayout]
    );

    return (
      <ResizablePrimitive.PanelGroup
        ref={ref}
        className={cn(
          "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
          "transition-all duration-200 ease-in-out",
          className
        )}
        onLayout={handleLayoutChange}
        {...props}
      >
        {children}
      </ResizablePrimitive.PanelGroup>
    );
  }
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// Enhanced Panel with collapse functionality
const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  ResizablePanelProps
>(
  (
    {
      className,
      collapsible = false,
      defaultCollapsed = false,
      minSizePercent,
      maxSizePercent,
      onCollapse,
      onResize,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
    const panelRef = React.useRef<any>(null);

    // Handle collapse toggle
    const toggleCollapse = React.useCallback(() => {
      if (!collapsible) return;

      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onCollapse?.(newCollapsed);

      if (panelRef.current) {
        if (newCollapsed) {
          panelRef.current.collapse();
        } else {
          panelRef.current.expand();
        }
      }
    }, [isCollapsed, collapsible, onCollapse]);

    return (
      <ResizablePrimitive.Panel
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "relative transition-all duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isCollapsed && "opacity-50",
          className
        )}
        collapsible={collapsible}
        defaultSize={defaultCollapsed ? 0 : undefined}
        minSize={minSizePercent}
        maxSize={maxSizePercent}
        onResize={onResize}
        {...props}
      >
        {/* Collapse toggle button */}
        {collapsible && (
          <button
            onClick={toggleCollapse}
            className={cn(
              "absolute top-2 right-2 z-10 p-1 rounded-md",
              "bg-background/80 hover:bg-background border border-border",
              "transition-all duration-200 hover:scale-105",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <Minimize2 className="h-3 w-3" />
            )}
          </button>
        )}

        <div className={cn("h-full w-full", isCollapsed && "hidden")}>
          {children}
        </div>
      </ResizablePrimitive.Panel>
    );
  }
);
ResizablePanel.displayName = "ResizablePanel";

// Enhanced Handle with variants and interactions
const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  ResizableHandleProps
>(
  (
    {
      withHandle = true,
      className,
      disabled = false,
      variant = "default",
      showTooltip = false,
      tooltipText,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isLocked, setIsLocked] = React.useState(disabled);

    // Variant styles
    const variantClasses = {
      default: "w-px bg-border",
      thick: "w-1 bg-border rounded-full",
      minimal: "w-px bg-transparent hover:bg-border",
      dashed: "w-px bg-transparent border-l-2 border-dashed border-border",
    };

    const handleClasses = {
      default: "h-4 w-3 rounded-sm border bg-border",
      thick: "h-6 w-4 rounded-md border bg-background shadow-sm",
      minimal: "h-3 w-2 rounded-sm bg-muted",
      dashed:
        "h-4 w-3 rounded-sm border-2 border-dashed border-border bg-background",
    };

    return (
      <div className="relative group">
        <ResizablePrimitive.PanelResizeHandle
          ref={ref}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200",
            "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
            "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1",
            "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2",
            "data-[panel-group-direction=vertical]:after:translate-x-0",
            "[&[data-panel-group-direction=vertical]>div]:rotate-90",
            variantClasses[variant],
            isDragging && "bg-primary/50",
            isHovered && !disabled && "bg-primary/20",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
          disabled={disabled || isLocked}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          {...props}
        >
          {withHandle && (
            <div
              className={cn(
                "z-10 flex items-center justify-center transition-all duration-200",
                "hover:bg-primary/10 hover:scale-110",
                handleClasses[variant],
                isDragging && "bg-primary/20 scale-110",
                disabled && "cursor-not-allowed"
              )}
            >
              {isLocked ? (
                <Lock className="h-2.5 w-2.5 text-muted-foreground" />
              ) : (
                <GripVertical
                  className={cn(
                    "h-2.5 w-2.5 transition-colors duration-200",
                    isDragging && "text-primary",
                    isHovered && "text-primary/70"
                  )}
                />
              )}
            </div>
          )}
        </ResizablePrimitive.PanelResizeHandle>

        {/* Lock/Unlock button */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "bg-background border border-border rounded-full p-1",
            "hover:bg-muted z-20 shadow-sm",
            "data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:left-1/2"
          )}
          aria-label={isLocked ? "Unlock resizer" : "Lock resizer"}
        >
          {isLocked ? (
            <Unlock className="h-2 w-2" />
          ) : (
            <Lock className="h-2 w-2" />
          )}
        </button>

        {/* Tooltip */}
        {showTooltip && tooltipText && isHovered && (
          <div
            className={cn(
              "absolute z-30 px-2 py-1 text-xs bg-popover border border-border rounded-md shadow-md",
              "top-full left-1/2 -translate-x-1/2 mt-2",
              "data-[panel-group-direction=vertical]:left-full data-[panel-group-direction=vertical]:top-1/2",
              "data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-2"
            )}
          >
            {tooltipText}
          </div>
        )}
      </div>
    );
  }
);
ResizableHandle.displayName = "ResizableHandle";

// Utility hook for resizable panel management
export const useResizablePanel = (initialSize?: number) => {
  const [size, setSize] = React.useState(initialSize || 50);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  const resetSize = React.useCallback(() => {
    setSize(initialSize || 50);
    setIsCollapsed(false);
  }, [initialSize]);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    size,
    setSize,
    isCollapsed,
    setIsCollapsed,
    isResizing,
    setIsResizing,
    resetSize,
    toggleCollapse,
  };
};

// Reset layout utility
export const resetResizableLayout = (storageKey: string) => {
  localStorage.removeItem(`resizable-layout-${storageKey}`);
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
