import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dot,
  Minus,
  Circle,
  Square,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Lock,
  Unlock,
  Timer,
  Shield,
  User,
  Mail,
  Phone,
  Key,
  Smartphone,
  Clock,
  Info,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced OTP variants
const otpVariants = cva("flex items-center gap-2 has-[:disabled]:opacity-50", {
  variants: {
    variant: {
      default: "",
      outlined: "gap-3",
      filled: "gap-1",
      underlined: "gap-4",
    },
    size: {
      sm: "gap-1.5 [&>*]:h-8 [&>*]:w-8 [&>*]:text-sm",
      default: "gap-2 [&>*]:h-10 [&>*]:w-10 [&>*]:text-sm",
      lg: "gap-3 [&>*]:h-12 [&>*]:w-12 [&>*]:text-base",
      xl: "gap-4 [&>*]:h-14 [&>*]:w-14 [&>*]:text-lg",
    },
    rounded: {
      none: "[&>*]:rounded-none",
      sm: "[&>*]:rounded-sm",
      default: "[&>*]:rounded-md",
      lg: "[&>*]:rounded-lg",
      full: "[&>*]:rounded-full",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    rounded: "default",
  },
});

const slotVariants = cva(
  "relative flex items-center justify-center border text-sm transition-all font-mono",
  {
    variants: {
      variant: {
        default: "border-input bg-background",
        outlined: "border-2 border-input bg-transparent",
        filled: "border-transparent bg-muted",
        underlined:
          "border-0 border-b-2 border-input bg-transparent rounded-none",
      },
      state: {
        default: "",
        active: "z-10 ring-2 ring-ring ring-offset-background",
        success: "border-green-500 bg-green-50 text-green-700",
        error: "border-red-500 bg-red-50 text-red-700",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
      },
      size: {
        sm: "h-8 w-8 text-sm",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-14 w-14 text-lg",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md first:rounded-l-md last:rounded-r-md",
        lg: "rounded-lg first:rounded-l-lg last:rounded-r-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
      size: "default",
      rounded: "default",
    },
  }
);

// Enhanced interfaces
interface InputOTPProps
  extends React.ComponentPropsWithoutRef<typeof OTPInput>,
    VariantProps<typeof otpVariants> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  pattern?: string;
  timeout?: number;
  onTimeout?: () => void;
  onResend?: () => void;
  showResend?: boolean;
  resendDelay?: number;
  showCopy?: boolean;
  onCopy?: () => void;
  customIcon?: React.ElementType;
  autoSubmit?: boolean;
  onComplete?: (value: string) => void;
  pushPasswordManagerStrategy?: "increase-width" | "none";
  separator?: React.ReactNode | "dot" | "dash" | "space";
  groupSeparator?: boolean;
  autoFocus?: boolean;
}

interface InputOTPSlotProps
  extends React.ComponentPropsWithoutRef<"div">,
    Pick<VariantProps<typeof slotVariants>, "variant" | "size" | "rounded"> {
  index: number;
  showPassword?: boolean;
  animate?: boolean;
}

interface InputOTPGroupProps extends React.ComponentPropsWithoutRef<"div"> {
  label?: string;
}

// Context for sharing OTP state
interface OTPContextValue {
  variant: string;
  size: string;
  rounded: string;
  showPassword: boolean;
  error?: string;
  success: boolean;
  loading: boolean;
}

const OTPContext = React.createContext<OTPContextValue>({
  variant: "default",
  size: "default",
  rounded: "default",
  showPassword: false,
  success: false,
  loading: false,
});

const useOTP = () => {
  return React.useContext(OTPContext);
};

// Enhanced InputOTP with rich features
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  InputOTPProps
>(
  (
    {
      className,
      containerClassName,
      variant = "default",
      size = "default",
      rounded = "default",
      label,
      description,
      error,
      success = false,
      loading = false,
      showPassword = false,
      onTogglePassword,
      pattern = "\\d",
      timeout,
      onTimeout,
      onResend,
      showResend = false,
      resendDelay = 30,
      showCopy = false,
      onCopy,
      autoSubmit = false,
      onComplete,
      value,
      onChange,
      children,
      ...props
    },
    ref
  ) => {
    const [timeLeft, setTimeLeft] = React.useState<number | null>(
      timeout || null
    );
    const [resendTimeLeft, setResendTimeLeft] = React.useState(0);
    const [showResendButton, setShowResendButton] = React.useState(!showResend);

    // Timeout functionality
    React.useEffect(() => {
      if (timeout && timeLeft && timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev && prev <= 1) {
              onTimeout?.();
              return null;
            }
            return prev ? prev - 1 : null;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [timeout, timeLeft, onTimeout]);

    // Resend timer
    React.useEffect(() => {
      if (showResend && resendTimeLeft > 0) {
        const timer = setInterval(() => {
          setResendTimeLeft((prev) => {
            if (prev <= 1) {
              setShowResendButton(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [resendTimeLeft, showResend]);

    // Handle value change and auto-submit
    const handleChange = React.useCallback(
      (newValue: string) => {
        onChange?.(newValue);

        if (autoSubmit && onComplete && newValue.length === props.maxLength) {
          onComplete(newValue);
        }
      },
      [onChange, autoSubmit, onComplete, props.maxLength]
    );

    // Handle resend
    const handleResend = React.useCallback(() => {
      onResend?.();
      setResendTimeLeft(resendDelay);
      setShowResendButton(false);
      setTimeLeft(timeout || null);
    }, [onResend, resendDelay, timeout]);

    // Handle copy
    const handleCopy = React.useCallback(() => {
      if (value) {
        navigator.clipboard.writeText(value);
        onCopy?.();
      }
    }, [value, onCopy]);

    const contextValue = React.useMemo(
      () => ({
        variant,
        size,
        rounded,
        showPassword,
        error,
        success,
        loading,
      }),
      [variant, size, rounded, showPassword, error, success, loading]
    );

    return (
      <OTPContext.Provider value={contextValue}>
        <div className="space-y-2">
          {/* Label */}
          {label && (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
              </label>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {onTogglePassword && (
                  <button
                    type="button"
                    onClick={onTogglePassword}
                    className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                )}

                {showCopy && value && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground p-1 rounded transition-colors"
                    aria-label="Copy OTP"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Timer */}
          {timeLeft && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>
                Code expires in {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}

          {/* OTP Input */}
          <OTPInput
            ref={ref}
            value={value}
            onChange={handleChange}
            containerClassName={cn(
              otpVariants({ variant, size, rounded }),
              containerClassName
            )}
            className={cn("disabled:cursor-not-allowed", className)}
            pattern={pattern}
            {...props}
          >
            {children}
          </OTPInput>

          {/* Description */}
          {description && !error && (
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {description}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </p>
          )}

          {/* Success */}
          {success && !error && (
            <p className="text-sm text-green-600 flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Code verified successfully
            </p>
          )}

          {/* Resend */}
          {showResend && (
            <div className="flex items-center justify-center">
              {showResendButton ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw
                    className={cn("h-4 w-4", loading && "animate-spin")}
                  />
                  Resend code
                </button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend available in {resendTimeLeft}s
                </p>
              )}
            </div>
          )}
        </div>
      </OTPContext.Provider>
    );
  }
);

InputOTP.displayName = "InputOTP";

// Enhanced InputOTPGroup
const InputOTPGroup = React.forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div className="space-y-1">
      {label && (
        <div className="text-xs font-medium text-muted-foreground text-center">
          {label}
        </div>
      )}
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        {children}
      </div>
    </div>
  )
);

InputOTPGroup.displayName = "InputOTPGroup";

// Enhanced InputOTPSlot with animations and states
const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  (
    {
      index,
      className,
      variant,
      size,
      rounded,
      showPassword: slotShowPassword,
      animate = true,
      ...props
    },
    ref
  ) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const {
      variant: contextVariant,
      size: contextSize,
      rounded: contextRounded,
      showPassword: contextShowPassword,
      error,
      success,
      loading,
    } = useOTP();

    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    const actualVariant = variant || contextVariant;
    const actualSize = size || contextSize;
    const actualRounded = rounded || contextRounded;
    const actualShowPassword = slotShowPassword ?? contextShowPassword;

    // Determine state
    const state = error
      ? "error"
      : success
      ? "success"
      : isActive
      ? "active"
      : "default";

    const slotContent = (
      <div
        ref={ref}
        className={cn(
          slotVariants({
            variant: actualVariant,
            state,
            size: actualSize,
            rounded: actualRounded,
          }),
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && isActive ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        ) : (
          <>
            {/* Character display */}
            {actualShowPassword || !char ? (
              char
            ) : (
              <Circle className="h-2 w-2 fill-current" />
            )}

            {/* Fake caret */}
            {hasFakeCaret && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
              </div>
            )}
          </>
        )}
      </div>
    );

    if (animate && isActive) {
      return (
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 0.1 }}
        >
          {slotContent}
        </motion.div>
      );
    }

    return slotContent;
  }
);

InputOTPSlot.displayName = "InputOTPSlot";

// Enhanced InputOTPSeparator with variants
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    type?: "dot" | "dash" | "space" | "custom";
    icon?: React.ElementType;
  }
>(({ type = "dot", icon: Icon, children, className, ...props }, ref) => {
  const getSeparatorContent = () => {
    if (children) return children;
    if (Icon) return <Icon className="h-4 w-4" />;

    switch (type) {
      case "dash":
        return <Minus className="h-4 w-4" />;
      case "space":
        return <div className="w-4" />;
      case "custom":
        return null;
      case "dot":
      default:
        return <Dot className="h-6 w-6" />;
    }
  };

  return (
    <div
      ref={ref}
      role="separator"
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        className
      )}
      {...props}
    >
      {getSeparatorContent()}
    </div>
  );
});

InputOTPSeparator.displayName = "InputOTPSeparator";

// Preset OTP components for common use cases
const PhoneOTP: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  loading?: boolean;
}> = ({ value, onChange, onComplete, error, loading }) => (
  <InputOTP
    maxLength={6}
    value={value}
    onChange={onChange}
    onComplete={onComplete}
    error={error}
    loading={loading}
    label="Enter verification code"
    description="We sent a 6-digit code to your phone"
    showResend
    autoSubmit
    pattern="\\d"
  >
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);

const EmailOTP: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  loading?: boolean;
}> = ({ value, onChange, onComplete, error, loading }) => (
  <InputOTP
    maxLength={8}
    value={value}
    onChange={onChange}
    onComplete={onComplete}
    error={error}
    loading={loading}
    label="Enter email verification code"
    description="Check your email for the 8-character code"
    showResend
    autoSubmit
    pattern="[A-Z0-9]"
  >
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
    </InputOTPGroup>
    <InputOTPSeparator type="dash" />
    <InputOTPGroup>
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
      <InputOTPSlot index={6} />
      <InputOTPSlot index={7} />
    </InputOTPGroup>
  </InputOTP>
);

const PinOTP: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  loading?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}> = ({
  value,
  onChange,
  onComplete,
  error,
  loading,
  showPassword,
  onTogglePassword,
}) => (
  <InputOTP
    maxLength={4}
    value={value}
    onChange={onChange}
    onComplete={onComplete}
    error={error}
    loading={loading}
    showPassword={showPassword}
    onTogglePassword={onTogglePassword}
    label="Enter your PIN"
    autoSubmit
    pattern="\\d"
    size="lg"
  >
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
    </InputOTPGroup>
  </InputOTP>
);

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  PhoneOTP,
  EmailOTP,
  PinOTP,
  useOTP,
  type InputOTPProps,
  type InputOTPSlotProps,
  type InputOTPGroupProps,
};
