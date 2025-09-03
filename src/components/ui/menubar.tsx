import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Circle,
  ChevronDown,
  MoreHorizontal,
  Settings,
  User,
  FileText,
  Edit,
  Copy,
  Trash2,
  Share2,
  Download,
  Upload,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  Search,
  Filter,
  Plus,
  Minus,
  X,
  Home,
  Info,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Archive,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced menubar variants
const menubarVariants = cva(
  "flex items-center rounded-md border bg-background",
  {
    variants: {
      variant: {
        default: "p-1",
        compact: "p-0.5",
        spacious: "p-2",
        minimal: "border-0 bg-transparent p-1",
      },
      size: {
        sm: "h-8 space-x-0.5",
        default: "h-10 space-x-1",
        lg: "h-12 space-x-2",
      },
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col space-x-0 space-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      orientation: "horizontal",
    },
  }
);

const triggerVariants = cva(
  "flex cursor-default select-none items-center text-sm font-medium outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "rounded-sm px-3 py-1.5",
        pill: "rounded-full px-4 py-1.5",
        minimal: "px-2 py-1 hover:bg-accent/50",
        ghost: "px-3 py-1.5 hover:bg-accent/30",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const itemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "text-destructive focus:bg-destructive focus:text-destructive-foreground",
        ghost: "hover:bg-accent/50 focus:bg-accent/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Enhanced interfaces
interface MenubarAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "ghost";
  action: () => void | Promise<void>;
  submenu?: MenubarAction[];
  separator?: boolean;
}

interface MenubarProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>,
    VariantProps<typeof menubarVariants> {
  items?: Array<{
    label: string;
    trigger?: React.ReactNode;
    actions?: MenubarAction[];
    disabled?: boolean;
  }>;
  onAction?: (actionId: string, menuId: string) => void;
  showShortcuts?: boolean;
  loading?: boolean;
  sticky?: boolean;
}

interface MenubarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>,
    VariantProps<typeof triggerVariants> {
  icon?: React.ElementType;
  badge?: React.ReactNode;
  loading?: boolean;
}

interface MenubarItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>,
    VariantProps<typeof itemVariants> {
  inset?: boolean;
  icon?: React.ElementType;
  shortcut?: string;
  badge?: React.ReactNode;
  description?: string;
  loading?: boolean;
  confirmAction?: boolean;
  confirmMessage?: string;
  href?: string;
  target?: "_blank" | "_self";
}

// Context for sharing menubar state[258][263]
interface MenubarContextValue {
  onAction?: (actionId: string, menuId: string) => void;
  showShortcuts: boolean;
  loading: boolean;
}

const MenubarContext = React.createContext<MenubarContextValue>({
  showShortcuts: true,
  loading: false,
});

const useMenubar = () => {
  return React.useContext(MenubarContext);
};

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

// Enhanced Menubar with accessibility improvements[258][260]
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  MenubarProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      orientation = "horizontal",
      items,
      onAction,
      showShortcuts = true,
      loading = false,
      sticky = false,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({
        onAction,
        showShortcuts,
        loading,
      }),
      [onAction, showShortcuts, loading]
    );

    return (
      <MenubarContext.Provider value={contextValue}>
        <MenubarPrimitive.Root
          ref={ref}
          className={cn(
            menubarVariants({ variant, size, orientation }),
            sticky &&
              "sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            className
          )}
          orientation={orientation}
          {...props}
        >
          {items
            ? items.map((item, index) => (
                <MenubarMenu key={index}>
                  <MenubarTrigger disabled={item.disabled}>
                    {item.trigger || item.label}
                  </MenubarTrigger>
                  {item.actions && (
                    <MenubarContent>
                      <MenubarBuilder
                        actions={item.actions}
                        menuId={item.label}
                      />
                    </MenubarContent>
                  )}
                </MenubarMenu>
              ))
            : children}
        </MenubarPrimitive.Root>
      </MenubarContext.Provider>
    );
  }
);

Menubar.displayName = MenubarPrimitive.Root.displayName;

// Enhanced MenubarTrigger with icons and badges
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  MenubarTriggerProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      icon: Icon,
      badge,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const { loading: contextLoading } = useMenubar();
    const isLoading = loading || contextLoading;

    return (
      <MenubarPrimitive.Trigger
        ref={ref}
        className={cn(triggerVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        <div className="flex items-center gap-2">
          {/* Loading or Icon */}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : Icon ? (
            <Icon className="h-4 w-4" />
          ) : null}

          {/* Content */}
          <span className="flex-1">{children}</span>

          {/* Badge */}
          {badge && <div className="ml-2">{badge}</div>}
        </div>
      </MenubarPrimitive.Trigger>
    );
  }
);

MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
    icon?: React.ElementType;
    badge?: React.ReactNode;
  }
>(({ className, inset, icon: Icon, badge, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2 flex-1">
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{children}</span>
      {badge && <div className="ml-auto">{badge}</div>}
    </div>
    <ChevronRight className="ml-2 h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));

MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
);

MenubarContent.displayName = MenubarPrimitive.Content.displayName;

// Enhanced MenubarItem with rich content and confirmation
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  MenubarItemProps
>(
  (
    {
      className,
      variant,
      inset,
      icon: Icon,
      shortcut,
      badge,
      description,
      loading = false,
      confirmAction = false,
      confirmMessage = "Are you sure?",
      href,
      target = "_self",
      children,
      onSelect,
      ...props
    },
    ref
  ) => {
    const [showConfirm, setShowConfirm] = React.useState(false);
    const { showShortcuts } = useMenubar();

    const handleSelect = React.useCallback(
      (event: Event) => {
        if (confirmAction && !showConfirm) {
          event.preventDefault();
          setShowConfirm(true);
          return;
        }

        if (loading) {
          event.preventDefault();
          return;
        }

        // Handle navigation
        if (href) {
          if (target === "_blank") {
            window.open(href, "_blank");
          } else {
            window.location.href = href;
          }
        }

        onSelect?.(event);
        setShowConfirm(false);
      },
      [confirmAction, showConfirm, loading, href, target, onSelect]
    );

    const handleConfirmCancel = () => {
      setShowConfirm(false);
    };

    if (showConfirm) {
      return (
        <div className="px-2 py-1.5 text-sm">
          <p className="text-xs text-muted-foreground mb-2">{confirmMessage}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onSelect?.(new Event("select"));
                setShowConfirm(false);
              }}
              className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Confirm
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <MenubarPrimitive.Item
        ref={ref}
        className={cn(
          itemVariants({ variant }),
          inset && "pl-8",
          loading && "opacity-50 pointer-events-none",
          className
        )}
        onSelect={handleSelect}
        {...props}
      >
        <div className="flex items-center gap-2 w-full">
          {/* Icon or loading spinner */}
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : Icon ? (
            <Icon className="h-4 w-4 flex-shrink-0" />
          ) : inset ? (
            <div className="w-4 h-4" />
          ) : null}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate">{children}</span>
              {badge && <div className="flex-shrink-0">{badge}</div>}
              {href && <ExternalLink className="h-3 w-3 opacity-50" />}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground truncate">
                {description}
              </div>
            )}
          </div>

          {/* Shortcut */}
          {shortcut && showShortcuts && (
            <MenubarShortcut>{shortcut}</MenubarShortcut>
          )}
        </div>
      </MenubarPrimitive.Item>
    );
  }
);

MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> & {
    icon?: React.ElementType;
    shortcut?: string;
    description?: string;
  }
>(
  (
    {
      className,
      children,
      checked,
      icon: Icon,
      shortcut,
      description,
      ...props
    },
    ref
  ) => {
    const { showShortcuts } = useMenubar();

    return (
      <MenubarPrimitive.CheckboxItem
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        checked={checked}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </MenubarPrimitive.ItemIndicator>
        </span>

        <div className="flex items-center gap-2 w-full">
          {Icon && <Icon className="h-4 w-4" />}
          <div className="flex-1 min-w-0">
            <div className="truncate">{children}</div>
            {description && (
              <div className="text-xs text-muted-foreground truncate">
                {description}
              </div>
            )}
          </div>
          {shortcut && showShortcuts && (
            <MenubarShortcut>{shortcut}</MenubarShortcut>
          )}
        </div>
      </MenubarPrimitive.CheckboxItem>
    );
  }
);

MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> & {
    icon?: React.ElementType;
    shortcut?: string;
    description?: string;
  }
>(
  (
    { className, children, icon: Icon, shortcut, description, ...props },
    ref
  ) => {
    const { showShortcuts } = useMenubar();

    return (
      <MenubarPrimitive.RadioItem
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <Circle className="h-2 w-2 fill-current" />
          </MenubarPrimitive.ItemIndicator>
        </span>

        <div className="flex items-center gap-2 w-full">
          {Icon && <Icon className="h-4 w-4" />}
          <div className="flex-1 min-w-0">
            <div className="truncate">{children}</div>
            {description && (
              <div className="text-xs text-muted-foreground truncate">
                {description}
              </div>
            )}
          </div>
          {shortcut && showShortcuts && (
            <MenubarShortcut>{shortcut}</MenubarShortcut>
          )}
        </div>
      </MenubarPrimitive.RadioItem>
    );
  }
);

MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
    icon?: React.ElementType;
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </MenubarPrimitive.Label>
));

MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground opacity-60",
        className
      )}
      {...props}
    />
  );
});

MenubarShortcut.displayName = "MenubarShortcut";

// Menu Builder Component
interface MenubarBuilderProps {
  actions: MenubarAction[];
  menuId: string;
}

const MenubarBuilder: React.FC<MenubarBuilderProps> = ({ actions, menuId }) => {
  const [loadingActions, setLoadingActions] = React.useState<Set<string>>(
    new Set()
  );
  const { onAction } = useMenubar();

  const handleAction = async (action: MenubarAction) => {
    if (action.disabled) return;

    setLoadingActions((prev) => new Set(prev).add(action.id));

    try {
      await action.action();
      onAction?.(action.id, menuId);
    } finally {
      setLoadingActions((prev) => {
        const next = new Set(prev);
        next.delete(action.id);
        return next;
      });
    }
  };

  const renderActions = (actions: MenubarAction[]) => {
    return actions.map((action, index) => {
      const isLoading = loadingActions.has(action.id);

      // Render separator
      if (action.separator) {
        return <MenubarSeparator key={`sep-${index}`} />;
      }

      // Render submenu
      if (action.submenu) {
        return (
          <MenubarSub key={action.id}>
            <MenubarSubTrigger icon={action.icon} disabled={action.disabled}>
              {action.label}
            </MenubarSubTrigger>
            <MenubarSubContent>
              {renderActions(action.submenu)}
            </MenubarSubContent>
          </MenubarSub>
        );
      }

      // Render regular item
      return (
        <MenubarItem
          key={action.id}
          icon={action.icon}
          variant={action.variant}
          shortcut={action.shortcut}
          disabled={action.disabled || isLoading}
          loading={isLoading}
          onSelect={() => handleAction(action)}
        >
          {action.label}
        </MenubarItem>
      );
    });
  };

  return <>{renderActions(actions)}</>;
};

// Preset Menubar components for common use cases
const ApplicationMenubar: React.FC<{
  appName?: string;
  onAction?: (actionId: string, menuId: string) => void;
}> = ({ appName = "Application", onAction }) => (
  <Menubar onAction={onAction}>
    <MenubarMenu>
      <MenubarTrigger>{appName}</MenubarTrigger>
      <MenubarContent>
        <MenubarItem icon={Settings}>Preferences</MenubarItem>
        <MenubarSeparator />
        <MenubarItem icon={HelpCircle}>About {appName}</MenubarItem>
        <MenubarItem icon={X}>Quit</MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem icon={Plus} shortcut="⌘N">
          New
        </MenubarItem>
        <MenubarItem icon={FileText} shortcut="⌘O">
          Open
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem icon={Download} shortcut="⌘S">
          Save
        </MenubarItem>
        <MenubarItem icon={Upload}>Save As...</MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem icon={Copy} shortcut="⌘C">
          Copy
        </MenubarItem>
        <MenubarItem icon={Edit} shortcut="⌘V">
          Paste
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem icon={Search} shortcut="⌘F">
          Find
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
  MenubarBuilder,
  ApplicationMenubar,
  useMenubar,
  type MenubarProps,
  type MenubarAction,
  type MenubarTriggerProps,
  type MenubarItemProps,
};
