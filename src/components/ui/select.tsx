import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Plus,
  Minus,
  Star,
  Heart,
  User,
  Settings,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Flag,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced select variants
const selectVariants = cva(
  "flex items-center justify-between rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-2 border-input",
        filled: "border-transparent bg-muted",
        ghost: "border-transparent",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3 py-2",
        lg: "h-12 px-4 py-3",
      },
      state: {
        default: "",
        error: "border-destructive focus:ring-destructive",
        success: "border-green-500 focus:ring-green-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

// Enhanced interfaces
interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  options?: SelectOption[];
  onCreate?: (value: string) => void;
  onClear?: () => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled" | "ghost";
}

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectVariants> {
  icon?: React.ElementType;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

interface SelectContentProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  searchable?: boolean;
  searchPlaceholder?: string;
  onCreate?: (value: string) => void;
  createLabel?: string;
  emptyMessage?: string;
  maxHeight?: number;
}

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  icon?: React.ElementType;
  description?: string;
  badge?: React.ReactNode;
  indent?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  badge?: React.ReactNode;
  group?: string;
}

interface SelectLabelProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  icon?: React.ElementType;
}

// Context for sharing select state[326][329][334]
interface SelectContextValue {
  searchable: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  size: "sm" | "default" | "lg";
  multiple: boolean;
  selectedValues: string[];
  toggleValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  return context;
};

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

// Enhanced SelectTrigger with comprehensive accessibility[326][329][334]
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      children,
      variant = "default",
      size = "default",
      state = "default",
      icon: Icon,
      loading = false,
      clearable = false,
      onClear,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        selectVariants({ variant, size, state }),
        "[&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">{children}</div>
      </div>

      <div className="flex items-center gap-1 ml-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}

        {clearable && onClear && !loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  )
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));

SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));

SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

// Enhanced SelectContent with search functionality[328][331]
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      searchable = false,
      searchPlaceholder = "Search...",
      onCreate,
      createLabel = "Create",
      emptyMessage = "No results found.",
      maxHeight = 300,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const selectContext = useSelect();

    const contextValue = React.useMemo(
      () => ({
        searchable,
        searchTerm,
        setSearchTerm,
        size: "default" as const,
        multiple: false,
        selectedValues: [],
        toggleValue: () => {},
        ...selectContext,
      }),
      [searchable, searchTerm, selectContext]
    );

    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          style={{ maxHeight }}
          {...props}
        >
          <SelectContext.Provider value={contextValue}>
            {searchable && (
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
              className={cn(
                "p-1",
                position === "popper" &&
                  "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
              )}
            >
              {children}

              {/* Create new option */}
              {onCreate && searchTerm && (
                <SelectItem
                  value={`__create__${searchTerm}`}
                  onSelect={() => onCreate(searchTerm)}
                  className="text-primary"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {createLabel} "{searchTerm}"
                  </div>
                </SelectItem>
              )}

              {/* Empty message */}
              {React.Children.count(children) === 0 && searchTerm && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              )}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
          </SelectContext.Provider>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }
);

SelectContent.displayName = SelectPrimitive.Content.displayName;

// Enhanced SelectLabel with icons[329][338]
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, icon: Icon, children, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "flex items-center gap-2 py-1.5 pl-8 pr-2 text-sm font-semibold",
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {children}
  </SelectPrimitive.Label>
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

// Enhanced SelectItem with rich content[329][338]
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(
  (
    {
      className,
      children,
      icon: Icon,
      description,
      badge,
      indent = false,
      ...props
    },
    ref
  ) => {
    const selectContext = useSelect();
    const shouldShow =
      !selectContext?.searchable ||
      !selectContext.searchTerm ||
      children
        ?.toString()
        .toLowerCase()
        .includes(selectContext.searchTerm.toLowerCase());

    if (!shouldShow) return null;

    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          indent && "pl-12",
          className
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </span>

        <div className="flex items-center gap-2 w-full">
          {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <SelectPrimitive.ItemText className="truncate">
              {children}
            </SelectPrimitive.ItemText>
            {description && (
              <div className="text-xs text-muted-foreground truncate">
                {description}
              </div>
            )}
          </div>
          {badge && <div className="ml-auto">{badge}</div>}
        </div>
      </SelectPrimitive.Item>
    );
  }
);

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Enhanced Select component for complete functionality
const EnhancedSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  SelectProps
>(
  (
    {
      placeholder = "Select an option...",
      label,
      description,
      error,
      success = false,
      loading = false,
      searchable = false,
      clearable = false,
      options = [],
      onCreate,
      onClear,
      size = "default",
      variant = "default",
      children,
      value,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value);
    const id = React.useId();

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [onValueChange]
    );

    const handleClear = React.useCallback(() => {
      setInternalValue(undefined);
      onValueChange?.("");
      onClear?.();
    }, [onValueChange, onClear]);

    // Determine state
    const state = error ? "error" : success ? "success" : "default";

    // Group options by group property
    const groupedOptions = options.reduce((acc, option) => {
      const group = option.group || "default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {} as Record<string, SelectOption[]>);

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        {/* Description */}
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {/* Select */}
        <Select
          value={internalValue}
          onValueChange={handleValueChange}
          {...props}
        >
          <SelectTrigger
            id={id}
            variant={variant}
            size={size}
            state={state}
            loading={loading}
            clearable={clearable && !!internalValue}
            onClear={handleClear}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent searchable={searchable} onCreate={onCreate}>
            {options.length > 0
              ? Object.entries(groupedOptions).map(([group, groupOptions]) => (
                  <div key={group}>
                    {group !== "default" && <SelectLabel>{group}</SelectLabel>}
                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        icon={option.icon}
                        description={option.description}
                        badge={option.badge}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                    {group !== "default" && <SelectSeparator />}
                  </div>
                ))
              : children}
          </SelectContent>
        </Select>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {error}
          </p>
        )}

        {/* Success */}
        {success && !error && (
          <p className="text-sm text-green-600 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Selection confirmed
          </p>
        )}
      </div>
    );
  }
);

EnhancedSelect.displayName = "EnhancedSelect";

// Preset Select components for common use cases
const CountrySelect: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
}> = ({ value, onValueChange, placeholder = "Select country..." }) => (
  <EnhancedSelect
    value={value}
    onValueChange={onValueChange}
    placeholder={placeholder}
    searchable
    options={[
      { value: "us", label: "United States", icon: Flag },
      { value: "ca", label: "Canada", icon: Flag },
      { value: "uk", label: "United Kingdom", icon: Flag },
      { value: "de", label: "Germany", icon: Flag },
      { value: "fr", label: "France", icon: Flag },
    ]}
  />
);

const StatusSelect: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
}> = ({ value, onValueChange }) => (
  <EnhancedSelect
    value={value}
    onValueChange={onValueChange}
    placeholder="Select status..."
    options={[
      {
        value: "active",
        label: "Active",
        badge: <div className="w-2 h-2 bg-green-500 rounded-full" />,
      },
      {
        value: "inactive",
        label: "Inactive",
        badge: <div className="w-2 h-2 bg-gray-500 rounded-full" />,
      },
      {
        value: "pending",
        label: "Pending",
        badge: <div className="w-2 h-2 bg-yellow-500 rounded-full" />,
      },
    ]}
  />
);

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  EnhancedSelect,
  CountrySelect,
  StatusSelect,
  useSelect,
  type SelectProps,
  type SelectOption,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
};
