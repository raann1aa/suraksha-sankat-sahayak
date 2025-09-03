import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced types
interface ScrollAreaProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  className?: string;
  viewportClassName?: string;
  scrollHideDelay?: number;
  type?: "auto" | "always" | "scroll" | "hover";
  dir?: "ltr" | "rtl";
  scrollbarSize?: "sm" | "md" | "lg";
  showScrollButtons?: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onScrollPositionChange?: (position: { x: number; y: number }) => void;
  scrollToTopOnMount?: boolean;
  fadeEdges?: boolean;
  maxHeight?: string | number;
  virtualScrolling?: boolean;
  itemHeight?: number;
}

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<
    typeof ScrollAreaPrimitive.ScrollAreaScrollbar
  > {
  className?: string;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "modern" | "rounded";
  showButtons?: boolean;
}

// Enhanced ScrollArea with advanced features
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(
  (
    {
      className,
      viewportClassName,
      children,
      scrollHideDelay = 600,
      type = "hover",
      dir = "ltr",
      scrollbarSize = "md",
      showScrollButtons = false,
      onScroll,
      onScrollPositionChange,
      scrollToTopOnMount = false,
      fadeEdges = false,
      maxHeight,
      virtualScrolling = false,
      itemHeight = 50,
      ...props
    },
    ref
  ) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 });
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [canScrollUp, setCanScrollUp] = React.useState(false);
    const [canScrollDown, setCanScrollDown] = React.useState(false);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    // Scroll to top on mount
    React.useEffect(() => {
      if (scrollToTopOnMount && viewportRef.current) {
        viewportRef.current.scrollTop = 0;
      }
    }, [scrollToTopOnMount]);

    // Handle scroll events
    const handleScroll = React.useCallback(
      (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;
        const {
          scrollTop,
          scrollLeft,
          scrollHeight,
          scrollWidth,
          clientHeight,
          clientWidth,
        } = target;

        const newPosition = { x: scrollLeft, y: scrollTop };
        setScrollPosition(newPosition);
        onScrollPositionChange?.(newPosition);
        onScroll?.(event);

        // Update scroll button states
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop < scrollHeight - clientHeight);
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth);

        // Track scrolling state
        setIsScrolling(true);
        const timer = setTimeout(() => setIsScrolling(false), 150);
        return () => clearTimeout(timer);
      },
      [onScroll, onScrollPositionChange]
    );

    // Scroll functions
    const scrollToTop = React.useCallback(() => {
      viewportRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const scrollToBottom = React.useCallback(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, []);

    const scrollToLeft = React.useCallback(() => {
      viewportRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    }, []);

    const scrollToRight = React.useCallback(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollTo({
          left: viewportRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, []);

    const scrollBy = React.useCallback((deltaX: number, deltaY: number) => {
      viewportRef.current?.scrollBy({
        left: deltaX,
        top: deltaY,
        behavior: "smooth",
      });
    }, []);

    // Expose scroll methods via ref
    React.useImperativeHandle(
      ref,
      () => ({
        scrollToTop,
        scrollToBottom,
        scrollToLeft,
        scrollToRight,
        scrollBy,
        scrollTo: (x: number, y: number) => {
          viewportRef.current?.scrollTo({
            left: x,
            top: y,
            behavior: "smooth",
          });
        },
        getScrollPosition: () => scrollPosition,
        viewport: viewportRef.current,
      }),
      [
        scrollToTop,
        scrollToBottom,
        scrollToLeft,
        scrollToRight,
        scrollBy,
        scrollPosition,
      ]
    );

    return (
      <div className="relative">
        <ScrollAreaPrimitive.Root
          className={cn(
            "relative overflow-hidden",
            maxHeight &&
              `max-h-[${
                typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight
              }]`,
            className
          )}
          type={type}
          scrollHideDelay={scrollHideDelay}
          dir={dir}
          {...props}
        >
          <ScrollAreaPrimitive.Viewport
            ref={viewportRef}
            className={cn(
              "h-full w-full rounded-[inherit]",
              "scroll-smooth",
              fadeEdges && [
                "relative",
                "before:absolute before:top-0 before:left-0 before:right-0 before:h-4 before:bg-gradient-to-b before:from-background before:to-transparent before:z-10 before:pointer-events-none",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-4 after:bg-gradient-to-t after:from-background after:to-transparent after:z-10 after:pointer-events-none",
              ],
              viewportClassName
            )}
            onScroll={handleScroll}
          >
            {children}
          </ScrollAreaPrimitive.Viewport>

          <ScrollBar
            size={scrollbarSize}
            showButtons={showScrollButtons}
            orientation="vertical"
          />
          <ScrollBar
            size={scrollbarSize}
            showButtons={showScrollButtons}
            orientation="horizontal"
          />
          <ScrollAreaPrimitive.Corner />
        </ScrollAreaPrimitive.Root>

        {/* Floating scroll buttons */}
        {showScrollButtons && (
          <>
            {/* Vertical scroll buttons */}
            <button
              onClick={scrollToTop}
              disabled={!canScrollUp}
              className={cn(
                "absolute top-2 right-2 z-20 p-1 rounded-full bg-background/80 border border-border shadow-sm",
                "transition-all duration-200 hover:bg-background hover:scale-105",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-3 w-3" />
            </button>

            <button
              onClick={scrollToBottom}
              disabled={!canScrollDown}
              className={cn(
                "absolute bottom-2 right-2 z-20 p-1 rounded-full bg-background/80 border border-border shadow-sm",
                "transition-all duration-200 hover:bg-background hover:scale-105",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Scroll to bottom"
            >
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Horizontal scroll buttons */}
            <button
              onClick={scrollToLeft}
              disabled={!canScrollLeft}
              className={cn(
                "absolute top-1/2 left-2 -translate-y-1/2 z-20 p-1 rounded-full bg-background/80 border border-border shadow-sm",
                "transition-all duration-200 hover:bg-background hover:scale-105",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Scroll to left"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>

            <button
              onClick={scrollToRight}
              disabled={!canScrollRight}
              className={cn(
                "absolute top-1/2 right-8 -translate-y-1/2 z-20 p-1 rounded-full bg-background/80 border border-border shadow-sm",
                "transition-all duration-200 hover:bg-background hover:scale-105",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              aria-label="Scroll to right"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}

        {/* Scroll progress indicator */}
        {isScrolling && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted z-20">
            <div
              className="h-full bg-primary transition-all duration-150"
              style={{
                width: viewportRef.current
                  ? `${
                      (scrollPosition.y /
                        (viewportRef.current.scrollHeight -
                          viewportRef.current.clientHeight)) *
                      100
                    }%`
                  : "0%",
              }}
            />
          </div>
        )}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

// Enhanced ScrollBar with variants and sizes
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(
  (
    {
      className,
      orientation = "vertical",
      size = "md",
      variant = "default",
      showButtons = false,
      ...props
    },
    ref
  ) => {
    // Size variants
    const sizeClasses = {
      sm: orientation === "vertical" ? "w-1.5" : "h-1.5",
      md: orientation === "vertical" ? "w-2.5" : "h-2.5",
      lg: orientation === "vertical" ? "w-3.5" : "h-3.5",
    };

    // Variant styles
    const variantClasses = {
      default: "bg-border",
      minimal: "bg-transparent hover:bg-muted/50",
      modern: "bg-gradient-to-r from-muted to-border rounded-full",
      rounded: "bg-muted rounded-full",
    };

    const thumbVariantClasses = {
      default: "bg-border hover:bg-border/80",
      minimal: "bg-muted hover:bg-muted-foreground/50",
      modern: "bg-gradient-to-r from-primary/50 to-primary rounded-full",
      rounded:
        "bg-muted-foreground/50 hover:bg-muted-foreground/70 rounded-full",
    };

    return (
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
          "flex touch-none select-none transition-all duration-200 hover:bg-muted/20",
          orientation === "vertical" && [
            "h-full border-l border-l-transparent p-[1px]",
            sizeClasses[size],
          ],
          orientation === "horizontal" && [
            "flex-col border-t border-t-transparent p-[1px]",
            sizeClasses[size],
          ],
          className
        )}
        {...props}
      >
        <ScrollAreaPrimitive.ScrollAreaThumb
          className={cn(
            "relative flex-1 transition-all duration-200",
            variantClasses[variant],
            thumbVariantClasses[variant]
          )}
        />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
  }
);
ScrollBar.displayName = "ScrollBar";

// Utility hook for scroll area management
export const useScrollArea = () => {
  const scrollAreaRef = React.useRef<any>(null);
  const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 });
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [isAtBottom, setIsAtBottom] = React.useState(false);

  const scrollTo = React.useCallback((x: number, y: number) => {
    scrollAreaRef.current?.scrollTo(x, y);
  }, []);

  const scrollToTop = React.useCallback(() => {
    scrollAreaRef.current?.scrollToTop();
  }, []);

  const scrollToBottom = React.useCallback(() => {
    scrollAreaRef.current?.scrollToBottom();
  }, []);

  const handleScrollPositionChange = React.useCallback(
    (position: { x: number; y: number }) => {
      setScrollPosition(position);
      setIsAtTop(position.y === 0);
      // Note: isAtBottom calculation would need viewport height info
    },
    []
  );

  return {
    scrollAreaRef,
    scrollPosition,
    isAtTop,
    isAtBottom,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    handleScrollPositionChange,
  };
};

// Virtual scrolling component for large lists
export const VirtualScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  ScrollAreaProps & {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    itemHeight: number;
    overscan?: number;
  }
>(
  (
    { items, renderItem, itemHeight, overscan = 5, className, ...props },
    ref
  ) => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const containerHeight = 400; // This should be configurable

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    return (
      <ScrollArea
        ref={ref}
        className={cn("h-96", className)}
        onScrollPositionChange={({ y }) => setScrollTop(y)}
        {...props}
      >
        <div
          style={{ height: items.length * itemHeight, position: "relative" }}
        >
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) =>
              renderItem(item, startIndex + index)
            )}
          </div>
        </div>
      </ScrollArea>
    );
  }
);
VirtualScrollArea.displayName = "VirtualScrollArea";

export { ScrollArea, ScrollBar };
