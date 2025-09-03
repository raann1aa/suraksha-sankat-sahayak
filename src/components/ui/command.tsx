import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowRight,
  Hash,
  Star,
  Clock,
  User,
  Settings,
  FileText,
  Folder,
  Plus,
  ChevronRight,
  Command as CommandIcon,
  Loader2,
  Filter,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Bookmark,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Tag,
  Flag,
  Heart,
  Eye,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Info,
  AlertCircle,
  CheckCircle,
  Home,
  Building,
  Users,
  Zap,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Enhanced command variants
const commandVariants = cva(
  "flex h-full w-full flex-col overflow-hidden bg-popover text-popover-foreground",
  {
    variants: {
      variant: {
        default: "rounded-md",
        dialog: "rounded-lg",
        popover: "rounded-md border shadow-md",
        inline: "rounded-none border-0",
      },
      size: {
        sm: "max-h-[200px]",
        default: "max-h-[400px]",
        lg: "max-h-[600px]",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const itemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground",
        ghost: "hover:bg-accent/50 data-[selected='true']:bg-accent/70",
        subtle: "data-[selected='true']:bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Enhanced interfaces
interface CommandItem {
  id: string;
  label: string;
  value: string;
  icon?: React.ElementType;
  shortcut?: string;
  description?: string;
  category?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
  href?: string;
  priority?: number;
}

interface CommandGroup {
  id: string;
  heading: string;
  items: CommandItem[];
  priority?: number;
  collapsible?: boolean;
}

interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
    VariantProps<typeof commandVariants> {
  loading?: boolean;
  placeholder?: string;
  emptyMessage?: string;
  shouldFilter?: boolean;
  filter?: (value: string, search: string) => number;
  onValueChange?: (value: string) => void;
  groups?: CommandGroup[];
  recentItems?: CommandItem[];
  showRecent?: boolean;
  showCategories?: boolean;
  maxRecent?: number;
  storageKey?: string;
}

interface CommandDialogProps extends DialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  commandProps?: Omit<CommandProps, "children">;
}

interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  loading?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
}

interface CommandListProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.List> {
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
    VariantProps<typeof itemVariants> {
  icon?: React.ElementType;
  shortcut?: string;
  description?: string;
  badge?: React.ReactNode;
  onSelect?: () => void;
  href?: string;
}

// Context for managing command state
interface CommandContextValue {
  addRecentItem: (item: CommandItem) => void;
  recentItems: CommandItem[];
  clearRecent: () => void;
}

const CommandContext = React.createContext<CommandContextValue | null>(null);

export const useCommand = () => {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within a Command component");
  }
  return context;
};

// Enhanced Command component
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      placeholder = "Type a command or search...",
      emptyMessage = "No results found.",
      shouldFilter = true,
      filter,
      onValueChange,
      groups = [],
      recentItems: propRecentItems = [],
      showRecent = true,
      showCategories = true,
      maxRecent = 5,
      storageKey = "command-recent",
      children,
      ...props
    },
    ref
  ) => {
    const [recentItems, setRecentItems] = React.useState<CommandItem[]>(() => {
      if (typeof window !== "undefined" && storageKey) {
        try {
          const stored = localStorage.getItem(storageKey);
          return stored ? JSON.parse(stored) : propRecentItems;
        } catch {
          return propRecentItems;
        }
      }
      return propRecentItems;
    });

    // Save recent items to localStorage
    React.useEffect(() => {
      if (typeof window !== "undefined" && storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(recentItems));
        } catch {
          // Ignore localStorage errors
        }
      }
    }, [recentItems, storageKey]);

    const addRecentItem = React.useCallback(
      (item: CommandItem) => {
        setRecentItems((prev) => {
          const filtered = prev.filter((i) => i.id !== item.id);
          return [item, ...filtered].slice(0, maxRecent);
        });
      },
      [maxRecent]
    );

    const clearRecent = React.useCallback(() => {
      setRecentItems([]);
    }, []);

    const contextValue = React.useMemo(
      () => ({
        addRecentItem,
        recentItems,
        clearRecent,
      }),
      [addRecentItem, recentItems, clearRecent]
    );

    return (
      <CommandContext.Provider value={contextValue}>
        <CommandPrimitive
          ref={ref}
          className={cn(commandVariants({ variant, size }), className)}
          shouldFilter={shouldFilter}
          filter={filter}
          onValueChange={onValueChange}
          {...props}
        >
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">
                Loading...
              </span>
            </div>
          )}
          {children}
        </CommandPrimitive>
      </CommandContext.Provider>
    );
  }
);

Command.displayName = CommandPrimitive.displayName;

// Enhanced Command Dialog with keyboard shortcuts
const CommandDialog = ({
  children,
  trigger,
  commandProps,
  ...props
}: CommandDialogProps) => {
  const [open, setOpen] = React.useState(false);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-muted/50 hover:bg-muted border rounded-md transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      )}
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-[650px]">
        <Command
          variant="dialog"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          {...commandProps}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced Command Input with clear functionality
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(
  (
    {
      className,
      loading = false,
      showClearButton = true,
      onClear,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const handleClear = () => {
      onValueChange?.("");
      onClear?.();
    };

    return (
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandPrimitive.Input
          ref={ref}
          value={value}
          onValueChange={onValueChange}
          className={cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />

        {/* Loading or Clear button */}
        <div className="flex items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin opacity-50" />}
          {showClearButton && value && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-sm opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

// Enhanced Command List with states
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, emptyState, loadingState, children, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[300px] overflow-y-auto overflow-x-hidden p-1",
      className
    )}
    {...props}
  >
    {children}
  </CommandPrimitive.List>
));

CommandList.displayName = CommandPrimitive.List.displayName;

// Enhanced Command Empty with custom content
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> & {
    icon?: React.ElementType;
    title?: string;
    description?: string;
  }
>(
  (
    {
      className,
      icon: Icon = Search,
      title = "No results found",
      description = "Try searching for something else",
      children,
      ...props
    },
    ref
  ) => (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn("py-8 text-center", className)}
      {...props}
    >
      {children || (
        <div className="flex flex-col items-center gap-2">
          <Icon className="h-8 w-8 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      )}
    </CommandPrimitive.Empty>
  )
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// Enhanced Command Group with collapsible functionality
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> & {
    collapsible?: boolean;
    defaultCollapsed?: boolean;
  }
>(
  (
    {
      className,
      collapsible = false,
      defaultCollapsed = false,
      children,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

    if (collapsible) {
      return (
        <CommandPrimitive.Group
          ref={ref}
          className={cn(
            "overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
            className
          )}
          {...props}
        >
          <div
            className="flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-accent/50 rounded-sm"
            onClick={() => setCollapsed(!collapsed)}
          >
            <span>{props.heading}</span>
            <ChevronRight
              className={cn(
                "h-3 w-3 transition-transform",
                !collapsed && "rotate-90"
              )}
            />
          </div>

          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          )}
        </CommandPrimitive.Group>
      );
    }

    return (
      <CommandPrimitive.Group
        ref={ref}
        className={cn(
          "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </CommandPrimitive.Group>
    );
  }
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border my-1", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// Enhanced Command Item with rich content
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(
  (
    {
      className,
      variant,
      icon: Icon,
      shortcut,
      description,
      badge,
      onSelect,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const { addRecentItem } = useCommand();

    const handleSelect = () => {
      // Add to recent items
      if (typeof children === "string") {
        addRecentItem({
          id: props.value || children,
          label: children,
          value: props.value || children,
          icon: Icon,
        });
      }

      // Handle navigation
      if (href) {
        window.open(href, "_blank");
      }

      onSelect?.();
    };

    return (
      <CommandPrimitive.Item
        ref={ref}
        className={cn(itemVariants({ variant }), "group", className)}
        onSelect={handleSelect}
        data-disabled={props.disabled}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground group-data-[selected='true']:text-accent-foreground" />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate">{children}</span>
              {badge && <div className="flex-shrink-0">{badge}</div>}
              {href && <ExternalLink className="h-3 w-3 opacity-50" />}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>

          {/* Shortcut */}
          {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
        </div>
      </CommandPrimitive.Item>
    );
  }
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

// Enhanced Command Shortcut
const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground opacity-60 group-data-[selected='true']:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
CommandShortcut.displayName = "CommandShortcut";

// Recent Items Component
const CommandRecent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    max?: number;
    showClear?: boolean;
  }
>(({ className, max = 5, showClear = true, ...props }, ref) => {
  const { recentItems, clearRecent } = useCommand();

  if (recentItems.length === 0) return null;

  const displayItems = recentItems.slice(0, max);

  return (
    <CommandGroup heading="Recent">
      <div ref={ref} className={className} {...props}>
        {displayItems.map((item) => (
          <CommandItem
            key={item.id}
            value={item.value}
            icon={item.icon || Clock}
            onSelect={item.onSelect}
            href={item.href}
          >
            {item.label}
          </CommandItem>
        ))}

        {showClear && recentItems.length > 0 && (
          <>
            <CommandSeparator />
            <CommandItem
              value="clear-recent"
              icon={X}
              onSelect={clearRecent}
              className="text-muted-foreground"
            >
              Clear recent
            </CommandItem>
          </>
        )}
      </div>
    </CommandGroup>
  );
});

CommandRecent.displayName = "CommandRecent";

// Preset Command components for common use cases
const QuickSearch: React.FC<{
  placeholder?: string;
  items: CommandItem[];
  onItemSelect?: (item: CommandItem) => void;
}> = ({ placeholder = "Quick search...", items, onItemSelect }) => (
  <Command className="rounded-lg border shadow-md">
    <CommandInput placeholder={placeholder} />
    <CommandList>
      <CommandEmpty />
      <CommandGroup>
        {items.map((item) => (
          <CommandItem
            key={item.id}
            value={item.value}
            icon={item.icon}
            shortcut={item.shortcut}
            description={item.description}
            onSelect={() => onItemSelect?.(item)}
          >
            {item.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

const NavigationPalette: React.FC<{
  pages: Array<{ name: string; href: string; icon?: React.ElementType }>;
}> = ({ pages }) => (
  <CommandDialog>
    <CommandInput placeholder="Go to page..." />
    <CommandList>
      <CommandEmpty />
      <CommandRecent />
      <CommandGroup heading="Pages">
        {pages.map((page) => (
          <CommandItem
            key={page.href}
            value={page.name}
            icon={page.icon || FileText}
            href={page.href}
          >
            {page.name}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </CommandDialog>
);

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandRecent,
  QuickSearch,
  NavigationPalette,
  useCommand,
  type CommandProps,
  type CommandItem as CommandItemType,
  type CommandGroup as CommandGroupType,
};
