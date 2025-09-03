import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Circle,
  Dot,
  Check,
  X,
  Star,
  Heart,
  Square,
  Triangle,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Settings,
  User,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Flag,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced radio group variants
const radioGroupVariants = cva("grid", {
  variants: {
    orientation: {
      vertical: "gap-2",
      horizontal: "grid-flow-col gap-4",
    },
    size: {
      sm: "gap-1.5",
      default: "gap-2",
      lg: "gap-3",
    },
    variant: {
      default: "",
      card: "gap-1",
      minimal: "gap-1",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "default",
    variant: "default",
  },
});

const radioItemVariants = cva(
  "rounded-full border text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default: "aspect-square border-primary",
        card: "sr-only peer",
        button:
          "rounded-md px-3 py-2 border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Enhanced interfaces
interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    VariantProps<typeof radioGroupVariants> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  options?: RadioOption[];
  onValueChange?: (value: string) => void;
}

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {
  label?: string;
  description?: string;
  icon?: React.ElementType;
  indicator?: React.ElementType;
  badge?: React.ReactNode;
  animate?: boolean;
}

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  badge?: React.ReactNode;
}

interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  className?: string;
}

// Context for sharing radio group state[309][311]
interface RadioGroupContextValue {
  size: "sm" | "default" | "lg" | "xl";
  variant: "default" | "card" | "button";
  animate: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({
  size: "default",
  variant: "default",
  animate: false,
});

const useRadioGroup = () => {
  return React.useContext(RadioGroupContext);
};

// Enhanced RadioGroup with comprehensive accessibility[309][311][314]
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      orientation = "vertical",
      size = "default",
      variant = "default",
      label,
      description,
      error,
      required = false,
      options,
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({
        size,
        variant,
        animate: true,
      }),
      [size, variant]
    );

    const groupId = React.useId();
    const descriptionId = `${groupId}-description`;
    const errorId = `${groupId}-error`;

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div className="space-y-2">
          {/* Label */}
          {label && (
            <div className="flex items-center gap-2">
              <legend className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </legend>
            </div>
          )}

          {/* Description */}
          {description && !error && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}

          {/* Error */}
          {error && (
            <p
              id={errorId}
              className="text-sm text-destructive flex items-start gap-2"
              role="alert"
            >
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* Radio Group */}
          <RadioGroupPrimitive.Root
            className={cn(
              radioGroupVariants({ orientation, size, variant }),
              className
            )}
            orientation={orientation}
            onValueChange={onValueChange}
            aria-labelledby={label ? `${groupId}-label` : undefined}
            aria-describedby={cn(
              description && descriptionId,
              error && errorId
            )}
            aria-required={required}
            aria-invalid={!!error}
            ref={ref}
            {...props}
          >
            {options
              ? options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${groupId}-${option.value}`}
                      disabled={option.disabled}
                      label={option.label}
                      description={option.description}
                      icon={option.icon}
                      badge={option.badge}
                    />
                    <label
                      htmlFor={`${groupId}-${option.value}`}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        option.disabled && "opacity-50"
                      )}
                    >
                      {option.label}
                    </label>
                  </div>
                ))
              : children}
          </RadioGroupPrimitive.Root>
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// Enhanced RadioGroupItem with rich features[309][321]
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(
  (
    {
      className,
      variant: itemVariant,
      size: itemSize,
      label,
      description,
      icon: Icon,
      indicator: IndicatorIcon = Circle,
      badge,
      animate = false,
      ...props
    },
    ref
  ) => {
    const {
      size: contextSize,
      variant: contextVariant,
      animate: contextAnimate,
    } = useRadioGroup();

    const actualSize = itemSize || contextSize;
    const actualVariant = itemVariant || contextVariant;
    const actualAnimate = animate || contextAnimate;

    return (
      <div className="flex items-center space-x-2">
        <RadioGroupPrimitive.Item
          ref={ref}
          className={cn(
            radioItemVariants({ variant: actualVariant, size: actualSize }),
            className
          )}
          {...props}
        >
          <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            {actualAnimate ? (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <IndicatorIcon className="h-2.5 w-2.5 fill-current text-current" />
              </motion.div>
            ) : (
              <IndicatorIcon className="h-2.5 w-2.5 fill-current text-current" />
            )}
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>

        {/* Label and description */}
        {(label || description) && (
          <div className="grid gap-1.5">
            {label && (
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {label}
                </span>
                {badge && <div className="ml-auto">{badge}</div>}
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// RadioCard component for card-style radio buttons[316][319]
const RadioCard = React.forwardRef<HTMLDivElement, RadioCardProps>(
  (
    {
      value,
      label,
      description,
      icon: Icon,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => (
    <div className="relative">
      <RadioGroupPrimitive.Item
        value={value}
        id={value}
        disabled={disabled}
        className="sr-only peer"
      />
      <label
        htmlFor={value}
        className={cn(
          "flex cursor-pointer select-none items-center space-x-3 rounded-lg border border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
        <div className="grid gap-1">
          <div className="text-sm font-medium leading-none">{label}</div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>
        <div className="ml-auto">
          <Circle className="h-4 w-4 text-muted-foreground peer-data-[state=checked]:text-primary peer-data-[state=checked]:fill-primary" />
        </div>
      </label>
    </div>
  )
);

RadioCard.displayName = "RadioCard";

// RadioButton component for button-style radio buttons
const RadioButton = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    children: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </RadioGroupPrimitive.Item>
));

RadioButton.displayName = "RadioButton";

// Preset RadioGroup components for common use cases
const PreferenceRadioGroup: React.FC<{
  label: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: React.ElementType;
  }>;
  value?: string;
  onValueChange?: (value: string) => void;
}> = ({ label, options, value, onValueChange }) => (
  <RadioGroup
    label={label}
    value={value}
    onValueChange={onValueChange}
    variant="card"
  >
    {options.map((option) => (
      <RadioCard
        key={option.value}
        value={option.value}
        label={option.label}
        description={option.description}
        icon={option.icon}
      />
    ))}
  </RadioGroup>
);

const SizeRadioGroup: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
}> = ({ value, onValueChange }) => (
  <RadioGroup
    orientation="horizontal"
    value={value}
    onValueChange={onValueChange}
    variant="button"
  >
    <RadioButton value="xs">XS</RadioButton>
    <RadioButton value="sm">SM</RadioButton>
    <RadioButton value="md">MD</RadioButton>
    <RadioButton value="lg">LG</RadioButton>
    <RadioButton value="xl">XL</RadioButton>
  </RadioGroup>
);

export {
  RadioGroup,
  RadioGroupItem,
  RadioCard,
  RadioButton,
  PreferenceRadioGroup,
  SizeRadioGroup,
  useRadioGroup,
  type RadioGroupProps,
  type RadioGroupItemProps,
  type RadioOption,
  type RadioCardProps,
};
