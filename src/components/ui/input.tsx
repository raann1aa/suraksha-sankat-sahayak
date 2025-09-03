import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Search,
  X,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  MapPin,
  DollarSign,
  Hash,
  AtSign,
  FileText,
  Image,
  Upload,
  Download,
  Link,
  Percent,
  Calculator,
  CreditCard,
  Key,
  Smartphone,
  Copy,
  Loader2,
  HelpCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced input variants
const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default: "border-input",
        outlined: "border-2 border-input",
        filled: "border-transparent bg-muted",
        flushed:
          "border-0 border-b-2 border-input rounded-none bg-transparent px-0",
        ghost: "border-transparent bg-transparent",
      },
      inputSize: {
        sm: "h-8 px-2 py-1 text-sm",
        default: "h-10 px-3 py-2 md:text-sm",
        lg: "h-12 px-4 py-3 text-base",
        xl: "h-14 px-5 py-4 text-lg",
      },
      state: {
        default: "",
        invalid: "border-destructive focus-visible:ring-destructive",
        valid: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
        loading: "pr-10",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
);

// Enhanced interfaces
interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  showPasswordToggle?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  copyable?: boolean;
  onCopy?: () => void;
  tooltip?: string;
  characterCount?: boolean;
  maxLength?: number;
  debounceDelay?: number;
  onDebouncedChange?: (value: string) => void;
  mask?: string | RegExp;
  formatValue?: (value: string) => string;
  validateOnChange?: boolean;
  required?: boolean;
  optional?: boolean;
  autoResize?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  showSuggestions?: boolean;
}

interface InputGroupProps {
  children: React.ReactNode;
  className?: string;
}

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Enhanced Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      inputSize = "default",
      state: propState = "default",
      label,
      description,
      error,
      success = false,
      loading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftAddon,
      rightAddon,
      showPasswordToggle = false,
      clearable = false,
      onClear,
      copyable = false,
      onCopy,
      tooltip,
      characterCount = false,
      maxLength,
      debounceDelay = 0,
      onDebouncedChange,
      mask,
      formatValue,
      validateOnChange = false,
      required = false,
      optional = false,
      autoResize = false,
      suggestions = [],
      onSuggestionSelect,
      showSuggestions = false,
      value,
      onChange,
      onFocus,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<
      string[]
    >([]);
    const [showSuggestionList, setShowSuggestionList] = React.useState(false);
    const [activeSuggestion, setActiveSuggestion] = React.useState(-1);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const suggestionListRef = React.useRef<HTMLDivElement>(null);
    const uniqueId = React.useId();
    const actualId = id || uniqueId;

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!, []);

    // Debounced value for performance
    const debouncedValue = useDebounce(internalValue, debounceDelay);

    // Handle debounced change
    React.useEffect(() => {
      if (onDebouncedChange && debounceDelay > 0) {
        onDebouncedChange(debouncedValue);
      }
    }, [debouncedValue, onDebouncedChange, debounceDelay]);

    // Determine actual state
    const actualState = error
      ? "invalid"
      : success
      ? "valid"
      : loading
      ? "loading"
      : propState;

    // Determine if password type
    const isPasswordType = type === "password" || showPasswordToggle;
    const actualType = isPasswordType && showPassword ? "text" : type;

    // Handle value changes
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Apply mask if provided
        if (mask) {
          if (typeof mask === "string") {
            // Simple string mask (e.g., "999-999-9999")
            newValue = applyMask(newValue, mask);
          } else if (mask instanceof RegExp) {
            // RegExp validation
            if (!mask.test(newValue)) {
              return;
            }
          }
        }

        // Apply formatting
        if (formatValue) {
          newValue = formatValue(newValue);
        }

        setInternalValue(newValue);

        // Update suggestions
        if (showSuggestions && suggestions.length > 0) {
          const filtered = suggestions.filter((suggestion) =>
            suggestion.toLowerCase().includes(newValue.toLowerCase())
          );
          setFilteredSuggestions(filtered);
          setShowSuggestionList(filtered.length > 0 && newValue.length > 0);
          setActiveSuggestion(-1);
        }

        // Call original onChange
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: newValue },
        };
        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      },
      [mask, formatValue, onChange, showSuggestions, suggestions]
    );

    // Handle focus
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);

        if (showSuggestions && suggestions.length > 0) {
          setShowSuggestionList(true);
        }
      },
      [onFocus, showSuggestions, suggestions]
    );

    // Handle blur
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);

        // Hide suggestions after a delay to allow for clicks
        setTimeout(() => {
          setShowSuggestionList(false);
          setActiveSuggestion(-1);
        }, 150);
      },
      [onBlur]
    );

    // Handle keyboard navigation for suggestions
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestionList || filteredSuggestions.length === 0) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveSuggestion((prev) =>
              prev < filteredSuggestions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveSuggestion((prev) =>
              prev > 0 ? prev - 1 : filteredSuggestions.length - 1
            );
            break;
          case "Enter":
            if (activeSuggestion >= 0) {
              e.preventDefault();
              handleSuggestionSelect(filteredSuggestions[activeSuggestion]);
            }
            break;
          case "Escape":
            setShowSuggestionList(false);
            setActiveSuggestion(-1);
            break;
        }
      },
      [showSuggestionList, filteredSuggestions, activeSuggestion]
    );

    // Handle suggestion selection
    const handleSuggestionSelect = React.useCallback(
      (suggestion: string) => {
        setInternalValue(suggestion);
        setShowSuggestionList(false);
        setActiveSuggestion(-1);
        onSuggestionSelect?.(suggestion);

        // Update the actual input value
        if (inputRef.current) {
          inputRef.current.value = suggestion;
          inputRef.current.focus();
        }
      },
      [onSuggestionSelect]
    );

    // Handle password toggle
    const togglePassword = React.useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword]);

    // Handle clear
    const handleClear = React.useCallback(() => {
      setInternalValue("");
      onClear?.();

      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }, [onClear]);

    // Handle copy
    const handleCopy = React.useCallback(() => {
      if (internalValue) {
        navigator.clipboard.writeText(internalValue);
        onCopy?.();
      }
    }, [internalValue, onCopy]);

    // Simple mask application
    const applyMask = (value: string, maskPattern: string) => {
      let result = "";
      let valueIndex = 0;

      for (
        let i = 0;
        i < maskPattern.length && valueIndex < value.length;
        i++
      ) {
        if (maskPattern[i] === "9") {
          if (/\d/.test(value[valueIndex])) {
            result += value[valueIndex];
            valueIndex++;
          } else {
            break;
          }
        } else if (maskPattern[i] === "A") {
          if (/[A-Za-z]/.test(value[valueIndex])) {
            result += value[valueIndex];
            valueIndex++;
          } else {
            break;
          }
        } else {
          result += maskPattern[i];
        }
      }

      return result;
    };

    // Get character count
    const currentLength = internalValue.length;
    const isOverLimit = maxLength ? currentLength > maxLength : false;

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={actualId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-destructive"
              )}
            >
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
              {optional && (
                <span className="text-muted-foreground ml-1 text-xs">
                  (optional)
                </span>
              )}
            </label>

            {tooltip && (
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                {showTooltip && (
                  <div className="absolute right-0 bottom-full mb-2 z-10">
                    <div className="bg-popover text-popover-foreground text-sm rounded-md p-2 shadow-md border max-w-xs whitespace-pre-wrap">
                      {tooltip}
                      <div className="absolute top-full right-3 border-4 border-transparent border-t-popover" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Addon */}
          {leftAddon && (
            <div className="absolute left-0 top-0 h-full flex items-center pl-3 pointer-events-none">
              {leftAddon}
            </div>
          )}

          {/* Left Icon */}
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <LeftIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {/* Input Element */}
          <input
            ref={inputRef}
            type={actualType}
            id={actualId}
            value={value ?? internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              inputVariants({ variant, inputSize, state: actualState }),
              leftAddon && "pl-12",
              LeftIcon && "pl-10",
              (rightAddon ||
                RightIcon ||
                isPasswordType ||
                clearable ||
                copyable ||
                loading) &&
                "pr-10",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && `${actualId}-error`,
              description && `${actualId}-description`
            )}
            aria-required={required}
            maxLength={maxLength}
            {...props}
          />

          {/* Right Icons/Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Loading */}
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}

            {/* Clear Button */}
            {clearable && internalValue && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear input"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Copy Button */}
            {copyable && internalValue && !loading && (
              <button
                type="button"
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy value"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}

            {/* Password Toggle */}
            {isPasswordType && !loading && (
              <button
                type="button"
                onClick={togglePassword}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Right Icon */}
            {RightIcon && !loading && (
              <RightIcon className="h-4 w-4 text-muted-foreground" />
            )}

            {/* Right Addon */}
            {rightAddon && <div className="ml-2">{rightAddon}</div>}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestionList && filteredSuggestions.length > 0 && (
            <div
              ref={suggestionListRef}
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors",
                    index === activeSuggestion && "bg-accent"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {description && !error && (
          <p
            id={`${actualId}-description`}
            className="text-sm text-muted-foreground flex items-start gap-2"
          >
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {description}
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            id={`${actualId}-error`}
            className="text-sm text-destructive flex items-start gap-2"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {error}
          </p>
        )}

        {/* Success */}
        {success && !error && (
          <p className="text-sm text-green-600 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Input is valid
          </p>
        )}

        {/* Character Count */}
        {characterCount && maxLength && (
          <div className="flex justify-end">
            <span
              className={cn(
                "text-xs",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Input Group for combining inputs with addons
const InputGroup: React.FC<InputGroupProps> = ({ children, className }) => (
  <div className={cn("flex items-stretch", className)}>{children}</div>
);

// Preset Input components for common use cases
const SearchInput: React.FC<Omit<InputProps, "leftIcon" | "type">> = (
  props
) => (
  <Input
    type="search"
    leftIcon={Search}
    placeholder="Search..."
    clearable
    {...props}
  />
);

const PasswordInput: React.FC<
  Omit<InputProps, "type" | "showPasswordToggle">
> = (props) => <Input type="password" showPasswordToggle {...props} />;

const EmailInput: React.FC<Omit<InputProps, "type" | "leftIcon">> = (props) => (
  <Input
    type="email"
    leftIcon={Mail}
    placeholder="email@example.com"
    {...props}
  />
);

const PhoneInput: React.FC<Omit<InputProps, "type" | "leftIcon">> = (props) => (
  <Input
    type="tel"
    leftIcon={Phone}
    placeholder="+1 (555) 000-0000"
    mask="(999) 999-9999"
    {...props}
  />
);

const CurrencyInput: React.FC<Omit<InputProps, "type" | "leftIcon">> = (
  props
) => (
  <Input type="number" leftIcon={DollarSign} placeholder="0.00" {...props} />
);

export {
  Input,
  InputGroup,
  SearchInput,
  PasswordInput,
  EmailInput,
  PhoneInput,
  CurrencyInput,
  type InputProps,
  type InputGroupProps,
};
