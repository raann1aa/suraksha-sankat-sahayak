import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced textarea variants
const textareaVariants = cva(
  "flex w-full rounded-md border bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
  {
    variants: {
      variant: {
        default: "border-input",
        outline: "border-2 border-input",
        filled: "border-transparent bg-muted",
        ghost: "border-transparent bg-transparent",
      },
      textareaSize: {
        sm: "min-h-[60px] px-2 py-1 text-xs",
        default: "min-h-[80px] px-3 py-2",
        lg: "min-h-[120px] px-4 py-3 text-base",
        xl: "min-h-[160px] px-5 py-4 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      textareaSize: "default",
      state: "default",
      resize: "vertical",
    },
  }
);

// Enhanced interfaces
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  showCharCount?: boolean;
  showWordCount?: boolean;
  autoResize?: boolean;
  copyable?: boolean;
  clearable?: boolean;
  showPassword?: boolean;
  onClear?: () => void;
  onCopy?: () => void;
  onTogglePassword?: () => void;
  tooltip?: string;
  required?: boolean;
  optional?: boolean;
  debounceDelay?: number;
  onDebouncedChange?: (value: string) => void;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
}

interface TextareaGroupProps {
  children: React.ReactNode;
  className?: string;
}

// Debounce hook for performance
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

// Enhanced Textarea with comprehensive accessibility[396][397][400]
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = "default",
      textareaSize = "default",
      state: propState = "default",
      resize = "vertical",
      label,
      description,
      error,
      success = false,
      loading = false,
      showCharCount = false,
      showWordCount = false,
      autoResize = false,
      copyable = false,
      clearable = false,
      showPassword = false,
      onClear,
      onCopy,
      onTogglePassword,
      tooltip,
      required = false,
      optional = false,
      debounceDelay = 0,
      onDebouncedChange,
      value,
      onChange,
      onFocus,
      onBlur,
      maxLength,
      id,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const [isFocused, setIsFocused] = React.useState(false);
    const [showTooltip, setShowTooltip] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(
      !showPassword
    );

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const uniqueId = React.useId();
    const actualId = id || uniqueId;

    // Combine refs
    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    // Debounced value for performance
    const debouncedValue = useDebounce(internalValue, debounceDelay);

    // Handle debounced change
    React.useEffect(() => {
      if (onDebouncedChange && debounceDelay > 0) {
        onDebouncedChange(debouncedValue);
      }
    }, [debouncedValue, onDebouncedChange, debounceDelay]);

    // Auto-resize functionality
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [internalValue, autoResize]);

    // Determine actual state
    const actualState = error ? "error" : success ? "success" : propState;

    // Handle value changes
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        onChange?.(e);
      },
      [onChange]
    );

    // Handle focus
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    // Handle blur
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLTextAreaElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    // Handle clear
    const handleClear = React.useCallback(() => {
      setInternalValue("");
      onClear?.();

      if (textareaRef.current) {
        textareaRef.current.value = "";
        textareaRef.current.focus();
      }
    }, [onClear]);

    // Handle copy
    const handleCopy = React.useCallback(() => {
      if (internalValue) {
        navigator.clipboard.writeText(internalValue);
        onCopy?.();
      }
    }, [internalValue, onCopy]);

    // Handle password toggle
    const togglePassword = React.useCallback(() => {
      setIsPasswordVisible(!isPasswordVisible);
      onTogglePassword?.();
    }, [isPasswordVisible, onTogglePassword]);

    // Calculate character and word counts
    const currentLength = internalValue.length;
    const wordCount = internalValue.trim()
      ? internalValue.trim().split(/\s+/).length
      : 0;
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

        {/* Description */}
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={actualId}
            value={value ?? internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              textareaVariants({
                variant,
                textareaSize,
                state: actualState,
                resize,
              }),
              showPassword && !isPasswordVisible && "font-mono tracking-wider",
              (clearable || copyable || showPassword) && "pr-12",
              className
            )}
            style={{
              fontFamily:
                showPassword && !isPasswordVisible ? "monospace" : undefined,
            }}
            aria-invalid={!!error}
            aria-describedby={cn(
              error && `${actualId}-error`,
              description && `${actualId}-description`,
              props["aria-describedby"]
            )}
            aria-required={required}
            aria-multiline="true"
            maxLength={maxLength}
            disabled={loading}
            {...props}
          />

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-md">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {(clearable || copyable || showPassword) && !loading && (
            <div className="absolute top-3 right-3 flex items-center gap-1">
              {clearable && internalValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  aria-label="Clear textarea"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}

              {copyable && internalValue && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  aria-label="Copy content"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}

              {showPassword && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                  aria-label={
                    isPasswordVisible ? "Hide content" : "Show content"
                  }
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>

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

        {/* Character/Word Count */}
        {(showCharCount || showWordCount) && (
          <div className="flex justify-between items-center text-xs">
            <div className="flex gap-4">
              {showWordCount && (
                <span className="text-muted-foreground">
                  {wordCount} {wordCount === 1 ? "word" : "words"}
                </span>
              )}
            </div>
            {showCharCount && maxLength && (
              <span
                className={cn(
                  "text-muted-foreground",
                  isOverLimit && "text-destructive"
                )}
              >
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Textarea Group for combining textareas with addons
const TextareaGroup: React.FC<TextareaGroupProps> = ({
  children,
  className,
}) => (
  <div className={cn("flex flex-col space-y-2", className)}>{children}</div>
);

// Enhanced TextareaField with form field wrapper
const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, required, optional, ...props }, ref) => (
    <Textarea
      ref={ref}
      label={label}
      description={description}
      error={error}
      required={required}
      optional={optional}
      {...props}
    />
  )
);

TextareaField.displayName = "TextareaField";

// Preset Textarea components for common use cases
const CommentTextarea: React.FC<
  Omit<TextareaProps, "label" | "placeholder">
> = (props) => (
  <Textarea
    label="Comments"
    placeholder="Enter your comments..."
    showCharCount
    maxLength={500}
    {...props}
  />
);

const FeedbackTextarea: React.FC<
  Omit<TextareaProps, "label" | "placeholder">
> = (props) => (
  <Textarea
    label="Feedback"
    description="Help us improve by sharing your thoughts"
    placeholder="Tell us what you think..."
    showCharCount
    showWordCount
    maxLength={1000}
    textareaSize="lg"
    {...props}
  />
);

const CodeTextarea: React.FC<Omit<TextareaProps, "className">> = ({
  className,
  ...props
}) => (
  <Textarea
    className={cn("font-mono text-sm", className)}
    placeholder="Enter your code here..."
    resize="both"
    copyable
    {...props}
  />
);

export {
  Textarea,
  TextareaGroup,
  TextareaField,
  CommentTextarea,
  FeedbackTextarea,
  CodeTextarea,
  type TextareaProps,
  type TextareaGroupProps,
};
