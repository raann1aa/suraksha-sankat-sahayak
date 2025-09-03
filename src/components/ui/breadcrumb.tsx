import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { FixedSizeList as List } from "react-window";
import {
  ChevronRight,
  MoreHorizontal,
  Home,
  ArrowRight,
  Slash,
  Dot,
  Copy,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ===========================
// Variants
// ===========================
const breadcrumbVariants = cva(
  "flex flex-wrap items-center gap-1.5 break-words text-sm transition-colors",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
        default: "text-sm gap-1.5",
        lg: "text-base gap-2",
      },
      variant: {
        default: "text-muted-foreground",
        solid: "text-foreground font-medium",
        ghost: "text-muted-foreground/70",
        outline: "border border-border rounded-md px-2 py-1",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

const separatorVariants = cva(
  "flex items-center justify-center text-muted-foreground/60",
  {
    variants: {
      variant: {
        chevron: "[&>svg]:size-3.5",
        arrow: "[&>svg]:size-3.5",
        slash: "[&>svg]:size-3.5",
        dot: "[&>svg]:size-2",
        pipe: "text-lg font-light",
        custom: "",
      },
      animate: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
      },
    },
    defaultVariants: {
      variant: "chevron",
      animate: "none",
    },
  }
);

// ===========================
// Interfaces
// ===========================
export interface BreadcrumbItem {
  id?: string;
  label: string;
  href?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  current?: boolean;
  tooltip?: string;
  metadata?: Record<string, any>;
}

export interface BreadcrumbProps
  extends React.ComponentPropsWithoutRef<"nav">,
    VariantProps<typeof breadcrumbVariants> {
  separator?: React.ReactNode;
  items?: BreadcrumbItem[];
  maxItems?: number;
  itemsBeforeCollapse?: number;
  itemsAfterCollapse?: number;
  showHome?: boolean;
  homeIcon?: React.ElementType;
  homeHref?: string;
  collapsible?: boolean;
  interactive?: boolean;
  showTooltips?: boolean;
  enableActions?: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  onEllipsisClick?: (collapsedItems: BreadcrumbItem[]) => void;
  customSeparator?: React.ElementType;
  animateTransitions?: boolean;
  responsive?: boolean;
  showIcons?: boolean;
}

// ===========================
// Breadcrumb Component
// ===========================
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      className,
      size,
      variant,
      separator,
      items = [],
      maxItems = 5,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 2,
      showHome = false,
      homeIcon: HomeIcon = Home,
      homeHref = "/",
      collapsible = true,
      interactive = false,
      showTooltips = false,
      enableActions = false,
      onItemClick,
      onEllipsisClick,
      customSeparator,
      animateTransitions = false,
      responsive = true,
      showIcons = false,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = React.useState<BreadcrumbItem[]>(
      []
    );
    const [windowWidth, setWindowWidth] = React.useState(0);

    // Responsive width
    React.useEffect(() => {
      if (!responsive) return;
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [responsive]);

    const responsiveMaxItems = React.useMemo(() => {
      if (!responsive) return maxItems;
      if (windowWidth < 640) return Math.max(2, Math.floor(maxItems / 2));
      if (windowWidth < 1024) return Math.max(3, Math.floor(maxItems * 0.75));
      return maxItems;
    }, [windowWidth, maxItems, responsive]);

    // Add Home
    const processedItems = React.useMemo(() => {
      const allItems = [...items];
      if (showHome && (!allItems.length || allItems[0].href !== homeHref)) {
        allItems.unshift({
          id: "home",
          label: "Home",
          href: homeHref,
          icon: HomeIcon,
        });
      }
      return allItems;
    }, [items, showHome, homeHref, HomeIcon]);

    // Collapsing logic
    const { visibleItems, collapsedItems, hasCollapsed } = React.useMemo(() => {
      if (!collapsible || processedItems.length <= responsiveMaxItems) {
        return {
          visibleItems: processedItems,
          collapsedItems: [],
          hasCollapsed: false,
        };
      }
      const beforeItems = processedItems.slice(0, itemsBeforeCollapse);
      const afterItems = processedItems.slice(-itemsAfterCollapse);
      const collapsedItems = processedItems.slice(
        itemsBeforeCollapse,
        -itemsAfterCollapse
      );
      return {
        visibleItems: [...beforeItems, ...afterItems],
        collapsedItems,
        hasCollapsed: true,
      };
    }, [
      processedItems,
      collapsible,
      responsiveMaxItems,
      itemsBeforeCollapse,
      itemsAfterCollapse,
    ]);

    const handleEllipsisClick = () => {
      if (expandedItems.length > 0) {
        setExpandedItems([]);
      } else {
        setExpandedItems(collapsedItems);
        onEllipsisClick?.(collapsedItems);
      }
    };

    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(breadcrumbVariants({ size, variant }), className)}
        {...props}
      >
        {children || (
          <BreadcrumbList>
            <AnimatePresence mode="popLayout">
              {/* Before collapse */}
              {visibleItems
                .slice(
                  0,
                  hasCollapsed ? itemsBeforeCollapse : visibleItems.length
                )
                .map((item, index) => {
                  const isCurrent = index === processedItems.length - 1;
                  return (
                    <motion.div
                      key={item.id || `item-${index}`}
                      initial={
                        animateTransitions ? { opacity: 0, x: -10 } : false
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <BreadcrumbItem>
                        {isCurrent ? (
                          <BreadcrumbPage>
                            <div className="flex items-center gap-1">
                              {showIcons && item.icon && (
                                <item.icon className="w-3 h-3" />
                              )}
                              <span className="truncate max-w-32">
                                {item.label}
                              </span>
                            </div>
                          </BreadcrumbPage>
                        ) : (
                          <EnhancedBreadcrumbLink
                            item={item}
                            index={index}
                            showIcon={showIcons}
                            showTooltip={showTooltips}
                            interactive={interactive}
                            enableActions={enableActions}
                            onClick={onItemClick}
                          />
                        )}
                      </BreadcrumbItem>
                      {(index < visibleItems.length - 1 || hasCollapsed) &&
                        !isCurrent && (
                          <BreadcrumbSeparator>
                            {customSeparator
                              ? React.createElement(customSeparator)
                              : separator}
                          </BreadcrumbSeparator>
                        )}
                    </motion.div>
                  );
                })}

              {/* Ellipsis */}
              {hasCollapsed && (
                <motion.div
                  initial={
                    animateTransitions ? { opacity: 0, scale: 0.8 } : false
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <BreadcrumbItem>
                    <EnhancedBreadcrumbEllipsis
                      collapsedItems={collapsedItems}
                      expandedItems={expandedItems}
                      onToggle={handleEllipsisClick}
                      interactive={interactive}
                      animateTransitions={animateTransitions}
                    />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    {customSeparator
                      ? React.createElement(customSeparator)
                      : separator}
                  </BreadcrumbSeparator>
                </motion.div>
              )}

              {/* Expanded items */}
              <AnimatePresence>
                {expandedItems.map((item, index) => (
                  <motion.div
                    key={`expanded-${item.id || index}`}
                    initial={{ opacity: 0, height: 0, scale: 0.8 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BreadcrumbItem>
                      <EnhancedBreadcrumbLink
                        item={item}
                        index={itemsBeforeCollapse + index}
                        showIcon={showIcons}
                        showTooltip={showTooltips}
                        interactive={interactive}
                        enableActions={enableActions}
                        onClick={onItemClick}
                      />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      {customSeparator
                        ? React.createElement(customSeparator)
                        : separator}
                    </BreadcrumbSeparator>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* After collapse items */}
              {hasCollapsed &&
                visibleItems.slice(-itemsAfterCollapse).map((item, index) => {
                  const actualIndex =
                    processedItems.length - itemsAfterCollapse + index;
                  const isCurrent = actualIndex === processedItems.length - 1;

                  return (
                    <motion.div
                      key={item.id || `after-${index}`}
                      initial={
                        animateTransitions ? { opacity: 0, x: 10 } : false
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <BreadcrumbItem>
                        {isCurrent ? (
                          <BreadcrumbPage>
                            <div className="flex items-center gap-1">
                              {showIcons && item.icon && (
                                <item.icon className="w-3 h-3" />
                              )}
                              <span className="truncate max-w-32">
                                {item.label}
                              </span>
                            </div>
                          </BreadcrumbPage>
                        ) : (
                          <EnhancedBreadcrumbLink
                            item={item}
                            index={actualIndex}
                            showIcon={showIcons}
                            showTooltip={showTooltips}
                            interactive={interactive}
                            enableActions={enableActions}
                            onClick={onItemClick}
                          />
                        )}
                      </BreadcrumbItem>
                      {index < itemsAfterCollapse - 1 && !isCurrent && (
                        <BreadcrumbSeparator>
                          {customSeparator
                            ? React.createElement(customSeparator)
                            : separator}
                        </BreadcrumbSeparator>
                      )}
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </BreadcrumbList>
        )}
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

// ===========================
// Sub Components
// ===========================
export const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol"> & {
    spacing?: "tight" | "normal" | "loose";
  }
>(({ className, spacing = "normal", ...props }, ref) => {
  const spacingClasses = {
    tight: "gap-1",
    normal: "gap-1.5 sm:gap-2.5",
    loose: "gap-3 sm:gap-4",
  };

  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-wrap items-center break-words text-sm text-muted-foreground",
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  );
});
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li"> & {
    highlight?: boolean;
  }
>(({ className, highlight, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5",
      highlight && "bg-accent/50 rounded px-1 py-0.5",
      className
    )}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

// ===========================
// Breadcrumb Page (Current page)
// ===========================
export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-medium text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

// ===========================
// Breadcrumb Link
// ===========================
interface EnhancedBreadcrumbLinkProps {
  item: BreadcrumbItem;
  index: number;
  isCurrent?: boolean;
  showIcon?: boolean;
  showTooltip?: boolean;
  interactive?: boolean;
  enableActions?: boolean;
  onClick?: (item: BreadcrumbItem, index: number) => void;
}

const EnhancedBreadcrumbLink: React.FC<EnhancedBreadcrumbLinkProps> = ({
  item,
  index,
  showIcon = false,
  showTooltip = false,
  interactive = false,
  enableActions = false,
  onClick,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(item, index);
  };

  const handleCopy = async () => {
    if (item.href) {
      try {
        await navigator.clipboard.writeText(window.location.origin + item.href);
      } catch (error) {
        console.error("Failed to copy:", error);
      }
    }
    setShowMenu(false);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = () => setShowMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  return (
    <BreadcrumbLink
      href={item.disabled ? undefined : item.href}
      className={cn(
        "relative group",
        interactive &&
          "hover:bg-accent/50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors",
        item.disabled && "pointer-events-none opacity-50"
      )}
      onClick={handleClick}
      title={showTooltip ? item.tooltip || item.label : undefined}
      onContextMenu={
        enableActions
          ? (e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }
          : undefined
      }
    >
      <div className="flex items-center gap-1">
        {showIcon && item.icon && (
          <item.icon className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="truncate max-w-32 sm:max-w-none">{item.label}</span>
      </div>

      {/* Actions Menu */}
      {enableActions && showMenu && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg z-50 min-w-32">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="w-full px-3 py-2 text-sm text-left hover:bg-accent/50 flex items-center gap-2 transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy Link
          </button>
          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-3 py-2 text-sm text-left hover:bg-accent/50 flex items-center gap-2 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <ExternalLink className="w-3 h-3" />
              Open in New Tab
            </a>
          )}
        </div>
      )}
    </BreadcrumbLink>
  );
};

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

// ===========================
// Separator
// ===========================
export const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> &
    VariantProps<typeof separatorVariants> & {
      icon?: React.ElementType;
    }
>(
  (
    { children, className, variant, animate, icon: CustomIcon, ...props },
    ref
  ) => {
    const getIcon = () => {
      if (CustomIcon) return CustomIcon;
      switch (variant) {
        case "arrow":
          return ArrowRight;
        case "slash":
          return Slash;
        case "dot":
          return Dot;
        case "pipe":
          return null;
        case "chevron":
        default:
          return ChevronRight;
      }
    };

    const Icon = getIcon();

    return (
      <li
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cn(separatorVariants({ variant, animate }), className)}
        {...props}
      >
        {children ??
          (variant === "pipe" ? (
            <span className="text-muted-foreground/40 mx-1">|</span>
          ) : Icon ? (
            <Icon />
          ) : null)}
      </li>
    );
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ===========================
// Ellipsis with virtualized list
// ===========================
interface EnhancedBreadcrumbEllipsisProps {
  collapsedItems: BreadcrumbItem[];
  expandedItems: BreadcrumbItem[];
  onToggle: () => void;
  interactive?: boolean;
  animateTransitions?: boolean;
  className?: string;
}

const EnhancedBreadcrumbEllipsis: React.FC<EnhancedBreadcrumbEllipsisProps> = ({
  collapsedItems,
  expandedItems,
  onToggle,
  interactive = false,
  animateTransitions = false,
  className,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const isExpanded = expandedItems.length > 0;

  const handleClick = () => {
    if (interactive) {
      setShowDropdown(!showDropdown);
    } else {
      onToggle();
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="relative">
      <span
        role="button"
        tabIndex={0}
        aria-expanded={interactive ? showDropdown : isExpanded}
        aria-label={`${collapsedItems.length} more items`}
        className={cn(
          "flex h-9 w-9 items-center justify-center cursor-pointer hover:bg-accent rounded-md transition-colors",
          className
        )}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">
          {isExpanded ? "Collapse" : "Expand"} {collapsedItems.length} items
        </span>
      </span>

      {/* Dropdown with virtualized list */}
      {interactive && showDropdown && collapsedItems.length > 0 && (
        <motion.div
          initial={
            animateTransitions ? { opacity: 0, y: -10, scale: 0.95 } : false
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg z-50 min-w-48 max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">
              Hidden Items ({collapsedItems.length})
            </span>
          </div>

          {collapsedItems.length <= 10 ? (
            // Render normally for small lists
            <div className="max-h-64 overflow-y-auto">
              {collapsedItems.map((item, index) => (
                <a
                  key={item.id || `collapsed-${index}`}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  {item.icon && <item.icon className="w-3 h-3 flex-shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          ) : (
            // Use virtualized list for large lists
            <List
              height={Math.min(collapsedItems.length * 35, 280)}
              itemCount={collapsedItems.length}
              itemSize={35}
              width="100%"
            >
              {({ index, style }) => {
                const item = collapsedItems[index];
                return (
                  <div style={style}>
                    <a
                      key={item.id || `collapsed-${index}`}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 transition-colors w-full h-full"
                      onClick={() => setShowDropdown(false)}
                    >
                      {item.icon && (
                        <item.icon className="w-3 h-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{item.label}</span>
                    </a>
                  </div>
                );
              }}
            </List>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ===========================
// Utility Hook
// ===========================
interface BreadcrumbBuilderProps {
  pathname: string;
  pathMapping?: Record<string, { label: string; icon?: React.ElementType }>;
  excludePaths?: string[];
  homeLabel?: string;
  transform?: (
    segment: string,
    index: number
  ) => { label: string; icon?: React.ElementType };
}

export const useBreadcrumbBuilder = ({
  pathname,
  pathMapping = {},
  excludePaths = [],
  homeLabel = "Home",
  transform,
}: BreadcrumbBuilderProps): BreadcrumbItem[] => {
  return React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    // Add home
    items.push({
      id: "home",
      label: homeLabel,
      href: "/",
      icon: Home,
    });

    // Process segments
    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");

      if (excludePaths.includes(path)) return;

      const mapped = pathMapping[path] || pathMapping[segment];
      const transformed = transform?.(segment, index);

      items.push({
        id: `segment-${index}`,
        label:
          mapped?.label ||
          transformed?.label ||
          segment.charAt(0).toUpperCase() + segment.slice(1),
        href: path,
        icon: mapped?.icon || transformed?.icon,
      });
    });

    return items;
  }, [pathname, pathMapping, excludePaths, homeLabel, transform]);
};

// ===========================
// Exports
// ===========================
export {
  BreadcrumbSeparator,
  useBreadcrumbBuilder,
  type BreadcrumbProps,
  type BreadcrumbItem,
};
