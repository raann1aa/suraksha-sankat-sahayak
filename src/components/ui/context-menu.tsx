import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Circle,
  Copy,
  Edit,
  Trash2,
  Share2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Star,
  Heart,
  Bookmark,
  Flag,
  Tag,
  User,
  Settings,
  Info,
  AlertCircle,
  Plus,
  Minus,
  X,
  ExternalLink,
  RefreshCw,
  Archive,
  Lock,
  Unlock,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Home,
  Building,
  FileText,
  Folder,
  Image,
  Video,
  Music,
  Zap,
  Shield,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced context menu variants
const menuVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
  {
    variants: {
      variant: {
        default: "min-w-[8rem]",
        compact: "min-w-[6rem]",
        wide: "min-w-[12rem]",
        full: "w-full",
      },
      animation: {
        default:
          "animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        slide:
          "animate-in slide-in-from-top-2 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
interface ContextMenuAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "ghost";
  action: () => void | Promise<void>;
  submenu?: ContextMenuAction[];
}

interface ContextMenuProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root> {
  actions?: ContextMenuAction[];
  showShortcuts?: boolean;
  disabled?: boolean;
  onAction?: (actionId: string) => void;
}

interface ContextMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>,
    VariantProps<typeof menuVariants> {
  showAnimations?: boolean;
}

interface ContextMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    VariantProps<typeof itemVariants> {
  inset?: boolean;
  icon?: React.ElementType;
  shortcut?: string;
  badge?: React.ReactNode;
  loading?: boolean;
  confirmAction?: boolean;
  confirmMessage?: string;
}

// Enhanced ContextMenu Root
const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger> & {
    disabled?: boolean;
  }
>(({ className, disabled, children, ...props }, ref) => (
  <ContextMenuPrimitive.Trigger
    ref={ref}
    className={cn(disabled && "pointer-events-none opacity-50", className)}
    disabled={disabled}
    {...props}
  >
    {children}
  </ContextMenuPrimitive.Trigger>
));
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

// Enhanced ContextMenuSubTrigger with icons and badges
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
    icon?: React.ElementType;
    badge?: React.ReactNode;
  }
>(({ className, inset, icon: Icon, badge, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      itemVariants(),
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
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
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ContextMenuContentProps
>(({ className, variant, animation, showAnimations = true, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
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
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

// Enhanced ContextMenuContent with animations
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, variant, animation, showAnimations = true, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        menuVariants({ variant }),
        showAnimations && menuVariants({ animation }),
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

// Enhanced ContextMenuItem with rich content
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(
  (
    {
      className,
      variant,
      inset,
      icon: Icon,
      shortcut,
      badge,
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
      <ContextMenuPrimitive.Item
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
          <span className="flex-1 truncate">{children}</span>

          {/* Badge */}
          {badge && <div className="flex-shrink-0 ml-2">{badge}</div>}

          {/* Shortcut */}
          {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
        </div>
      </ContextMenuPrimitive.Item>
    );
  }
);
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

// Enhanced ContextMenuCheckboxItem
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
    icon?: React.ElementType;
    shortcut?: string;
  }
>(({ className, children, checked, icon: Icon, shortcut, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(itemVariants(), "pl-8 pr-2", className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>

    <div className="flex items-center gap-2 w-full">
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{children}</span>
      {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
    </div>
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName;

// Enhanced ContextMenuRadioItem
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    icon?: React.ElementType;
    shortcut?: string;
  }
>(({ className, children, icon: Icon, shortcut, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(itemVariants(), "pl-8 pr-2", className)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>

    <div className="flex items-center gap-2 w-full">
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1">{children}</span>
      {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
    </div>
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

// Enhanced ContextMenuLabel with icons
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
    icon?: React.ElementType;
  }
>(({ className, inset, icon: Icon, children, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </ContextMenuPrimitive.Label>
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

// Enhanced ContextMenuShortcut with better styling
const ContextMenuShortcut = React.forwardRef<
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
ContextMenuShortcut.displayName = "ContextMenuShortcut";

// Menu Builder Component for easier menu creation
interface ContextMenuBuilderProps {
  actions: ContextMenuAction[];
  showShortcuts?: boolean;
  onAction?: (actionId: string) => void;
}

const ContextMenuBuilder: React.FC<ContextMenuBuilderProps> = ({
  actions,
  showShortcuts = true,
  onAction,
}) => {
  const [loadingActions, setLoadingActions] = React.useState<Set<string>>(
    new Set()
  );

  const handleAction = async (action: ContextMenuAction) => {
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

  const renderActions = (actions: ContextMenuAction[]) => {
    return actions.map((action, index) => {
      const isLoading = loadingActions.has(action.id);

      if (action.submenu) {
        return (
          <ContextMenuSub key={action.id}>
            <ContextMenuSubTrigger
              icon={action.icon}
              disabled={action.disabled}
            >
              {action.label}
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              {renderActions(action.submenu)}
            </ContextMenuSubContent>
          </ContextMenuSub>
        );
      }

      return (
        <ContextMenuItem
          key={action.id}
          icon={action.icon}
          variant={action.variant}
          shortcut={showShortcuts ? action.shortcut : undefined}
          disabled={action.disabled || isLoading}
          loading={isLoading}
          onSelect={() => handleAction(action)}
        >
          {action.label}
        </ContextMenuItem>
      );
    });
  };

  return <>{renderActions(actions)}</>;
};

// Preset Context Menu configurations
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
  properties: {
    id: "properties",
    label: "Properties",
    icon: Settings,
    action: () => {
      // Handle properties logic
    },
  },
} as const satisfies Record<string, ContextMenuAction>;

// Preset Context Menu components
const FileContextMenu: React.FC<{
  children: React.ReactNode;
  fileName?: string;
  onAction?: (actionId: string) => void;
}> = ({ children, fileName, onAction }) => (
  <ContextMenu>
    <ContextMenuTrigger>{children}</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel icon={FileText}>{fileName || "File"}</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuBuilder
        actions={[
          commonActions.copy,
          commonActions.cut,
          commonActions.paste,
          { ...commonActions.rename, confirmAction: true },
          commonActions.share,
          commonActions.download,
          { ...commonActions.delete, confirmAction: true },
          commonActions.properties,
        ]}
        onAction={onAction}
      />
    </ContextMenuContent>
  </ContextMenu>
);

const TextContextMenu: React.FC<{
  children: React.ReactNode;
  hasSelection?: boolean;
  onAction?: (actionId: string) => void;
}> = ({ children, hasSelection = false, onAction }) => (
  <ContextMenu>
    <ContextMenuTrigger>{children}</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuBuilder
        actions={[
          { ...commonActions.copy, disabled: !hasSelection },
          { ...commonActions.cut, disabled: !hasSelection },
          commonActions.paste,
          {
            id: "select-all",
            label: "Select All",
            shortcut: "⌘A",
            action: () => {
              const range = document.createRange();
              range.selectNodeContents(document.body);
              window.getSelection()?.removeAllRanges();
              window.getSelection()?.addRange(range);
            },
          },
        ]}
        onAction={onAction}
      />
    </ContextMenuContent>
  </ContextMenu>
);

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
  ContextMenuBuilder,
  FileContextMenu,
  TextContextMenu,
  type ContextMenuAction,
  type ContextMenuProps,
  type ContextMenuItemProps,
};
