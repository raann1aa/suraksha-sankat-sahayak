import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Circle,
  MoreHorizontal,
  Settings,
  User,
  LogOut,
  Copy,
  Edit,
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
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  FileText,
  Image,
  Video,
  Archive,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced dropdown menu variants
const menuVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
  {
    variants: {
      variant: {
        default: "min-w-[8rem] p-1",
        compact: "min-w-[6rem] p-0.5",
        wide: "min-w-[12rem] p-1",
        full: "w-full p-1",
      },
      animation: {
        default:
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        slide:
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "default",
    },
  }
);

const itemVariants = cva(
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        destructive:
          "text-destructive focus:bg-destructive focus:text-destructive-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        ghost:
          "hover:bg-accent/50 focus:bg-accent/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Enhanced interfaces
interface DropdownMenuAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "ghost";
  action: () => void | Promise<void>;
  submenu?: DropdownMenuAction[];
}

interface DropdownMenuProps
  extends React.ComponentProps<typeof DropdownMenuPrimitive.Root> {
  actions?: DropdownMenuAction[];
  showShortcuts?: boolean;
  onAction?: (actionId: string) => void;
}

interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
    VariantProps<typeof menuVariants> {
  showAnimations?: boolean;
}

interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof itemVariants> {
  inset?: boolean;
  icon?: React.ElementType;
  shortcut?: string;
  badge?: React.ReactNode;
  description?: string;
  loading?: boolean;
  confirmAction?: boolean;
  confirmMessage?: string;
}

interface DropdownMenuTriggerProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> {
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  loading?: boolean;
}

// Enhanced DropdownMenu Root
const DropdownMenu = DropdownMenuPrimitive.Root;

// Enhanced DropdownMenuTrigger with variants
const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const triggerVariants = cva(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            outline:
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          },
          size: {
            sm: "h-9 px-3 py-2",
            default: "h-10 px-4 py-2",
            lg: "h-11 px-8",
            icon: "h-10 w-10",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      }
    );

    return (
      <DropdownMenuPrimitive.Trigger
        ref={ref}
        className={cn(triggerVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  }
);

DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Enhanced DropdownMenuSubTrigger with icons and badges
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    icon?: React.ElementType;
    badge?: React.ReactNode;
  }
>(({ className, inset, icon: Icon, badge, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      itemVariants(),
      "focus:bg-accent data-[state=open]:bg-accent",
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
  </DropdownMenuPrimitive.SubTrigger>
));

DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuContentProps
>(({ className, variant, animation, showAnimations = true, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      menuVariants({ variant }),
      showAnimations && menuVariants({ animation }),
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));

DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

// Enhanced DropdownMenuContent with animations
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      variant = "default",
      animation = "default",
      showAnimations = true,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          menuVariants({ variant }),
          showAnimations && menuVariants({ animation }),
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);

DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Enhanced DropdownMenuItem with rich content
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
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
      children,
      onSelect,
      ...props
    },
    ref
  ) => {
    const [showConfirm, setShowConfirm] = React.useState(false);

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

        onSelect?.(event);
        setShowConfirm(false);
      },
      [confirmAction, showConfirm, loading, onSelect]
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
      <DropdownMenuPrimitive.Item
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
            <div className="truncate">{children}</div>
            {description && (
              <div className="text-xs text-muted-foreground truncate">
                {description}
              </div>
            )}
          </div>

          {/* Badge */}
          {badge && <div className="flex-shrink-0 ml-2">{badge}</div>}

          {/* Shortcut */}
          {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
        </div>
      </DropdownMenuPrimitive.Item>
    );
  }
);

DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Enhanced DropdownMenuCheckboxItem
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
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
  ) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(itemVariants(), "pl-8 pr-2", className)}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
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
        {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
      </div>
    </DropdownMenuPrimitive.CheckboxItem>
  )
);

DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

// Enhanced DropdownMenuRadioItem
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    icon?: React.ElementType;
    shortcut?: string;
    description?: string;
  }
>(
  (
    { className, children, icon: Icon, shortcut, description, ...props },
    ref
  ) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(itemVariants(), "pl-8 pr-2", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
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
        {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
      </div>
    </DropdownMenuPrimitive.RadioItem>
  )
);

DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Enhanced DropdownMenuLabel with icons
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
    icon?: React.ElementType;
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
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
  </DropdownMenuPrimitive.Label>
));

DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Enhanced DropdownMenuShortcut
const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// Menu Builder Component for easier menu creation
interface DropdownMenuBuilderProps {
  actions: DropdownMenuAction[];
  showShortcuts?: boolean;
  onAction?: (actionId: string) => void;
}

const DropdownMenuBuilder: React.FC<DropdownMenuBuilderProps> = ({
  actions,
  showShortcuts = true,
  onAction,
}) => {
  const [loadingActions, setLoadingActions] = React.useState<Set<string>>(
    new Set()
  );

  const handleAction = async (action: DropdownMenuAction) => {
    if (action.disabled) return;

    setLoadingActions((prev) => new Set(prev).add(action.id));

    try {
      await action.action();
      onAction?.(action.id);
    } finally {
      setLoadingActions((prev) => {
        const next = new Set(prev);
        next.delete(action.id);
        return next;
      });
    }
  };

  const renderActions = (actions: DropdownMenuAction[]) => {
    return actions.map((action, index) => {
      const isLoading = loadingActions.has(action.id);

      if (action.submenu) {
        return (
          <DropdownMenuSub key={action.id}>
            <DropdownMenuSubTrigger
              icon={action.icon}
              disabled={action.disabled}
            >
              {action.label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {renderActions(action.submenu)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        );
      }

      return (
        <DropdownMenuItem
          key={action.id}
          icon={action.icon}
          variant={action.variant}
          shortcut={showShortcuts ? action.shortcut : undefined}
          disabled={action.disabled || isLoading}
          loading={isLoading}
          onSelect={() => handleAction(action)}
        >
          {action.label}
        </DropdownMenuItem>
      );
    });
  };

  return <>{renderActions(actions)}</>;
};

// Preset dropdown menu configurations
export const commonActions = {
  copy: {
    id: "copy",
    label: "Copy",
    icon: Copy,
    shortcut: "⌘C",
    action: () =>
      navigator.clipboard.writeText(window.getSelection()?.toString() || ""),
  },
  cut: {
    id: "cut",
    label: "Cut",
    icon: Edit,
    shortcut: "⌘X",
    action: () => {
      const text = window.getSelection()?.toString() || "";
      navigator.clipboard.writeText(text);
    },
  },
  paste: {
    id: "paste",
    label: "Paste",
    icon: Plus,
    shortcut: "⌘V",
    action: async () => {
      const text = await navigator.clipboard.readText();
      // Handle paste logic
    },
  },
  delete: {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    variant: "destructive" as const,
    action: () => {
      // Handle delete logic
    },
  },
  rename: {
    id: "rename",
    label: "Rename",
    icon: Edit,
    shortcut: "F2",
    action: () => {
      // Handle rename logic
    },
  },
  share: {
    id: "share",
    label: "Share",
    icon: Share2,
    action: () => {
      // Handle share logic
    },
  },
  download: {
    id: "download",
    label: "Download",
    icon: Download,
    action: () => {
      // Handle download logic
    },
  },
  settings: {
    id: "settings",
    label: "Settings",
    icon: Settings,
    action: () => {
      // Handle settings logic
    },
  },
} as const satisfies Record<string, DropdownMenuAction>;

// Preset DropdownMenu components
const UserDropdownMenu: React.FC<{
  user: { name: string; email: string; avatar?: string };
  onAction?: (actionId: string) => void;
}> = ({ user, onAction }) => (
  <DropdownMenu>
    <DropdownMenuTrigger variant="ghost" size="icon">
      <User className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent variant="wide" align="end">
      <DropdownMenuLabel icon={User}>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem icon={Settings}>Settings</DropdownMenuItem>
        <DropdownMenuItem icon={User}>Profile</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        icon={LogOut}
        variant="destructive"
        onSelect={() => onAction?.("logout")}
      >
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ActionDropdownMenu: React.FC<{
  actions: DropdownMenuAction[];
  onAction?: (actionId: string) => void;
}> = ({ actions, onAction }) => (
  <DropdownMenu>
    <DropdownMenuTrigger variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuBuilder actions={actions} onAction={onAction} />
    </DropdownMenuContent>
  </DropdownMenu>
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuBuilder,
  UserDropdownMenu,
  ActionDropdownMenu,
  type DropdownMenuAction,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
};
