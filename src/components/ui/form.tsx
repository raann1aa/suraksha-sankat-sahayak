import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  UseFormReturn,
  Path,
  PathValue,
  FieldError,
  DeepPartial,
} from "react-hook-form";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  X,
  Loader2,
  Star,
  Lock,
  Unlock,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Upload,
  FileText,
  Image,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Enhanced form variants
const formItemVariants = cva("space-y-2", {
  variants: {
    variant: {
      default: "",
      compact: "space-y-1",
      relaxed: "space-y-3",
      inline: "flex items-center space-y-0 space-x-3",
    },
    disabled: {
      true: "opacity-50 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    disabled: false,
  },
});

const formLabelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "",
        required: "after:content-['*'] after:text-destructive after:ml-1",
        optional:
          "after:content-['(optional)'] after:text-muted-foreground after:ml-1 after:text-xs",
      },
      state: {
        default: "",
        error: "text-destructive",
        success: "text-green-600",
        warning: "text-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

const formMessageVariants = cva("text-sm font-medium flex items-center gap-2", {
  variants: {
    variant: {
      error: "text-destructive",
      warning: "text-yellow-600",
      success: "text-green-600",
      info: "text-blue-600",
    },
  },
  defaultVariants: {
    variant: "error",
  },
});

// Enhanced interfaces
interface FormProps extends React.ComponentProps<typeof FormProvider> {
  onSubmit?: (data: any) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends ControllerProps<TFieldValues, TName> {
  description?: string;
  tooltip?: string;
  showOptional?: boolean;
  showRequired?: boolean;
}

interface FormItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formItemVariants> {
  required?: boolean;
  disabled?: boolean;
}

interface FormLabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof formLabelVariants> {
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  icon?: React.ElementType;
}

interface FormMessageProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formMessageVariants> {
  icon?: React.ElementType;
  animate?: boolean;
}

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  justify?: "start" | "center" | "end" | "between";
  orientation?: "horizontal" | "vertical";
  sticky?: boolean;
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
  description?: string;
  tooltip?: string;
  showOptional?: boolean;
  showRequired?: boolean;
};

type FormItemContextValue = {
  id: string;
  required?: boolean;
  disabled?: boolean;
};

type FormContextValue = {
  loading?: boolean;
  disabled?: boolean;
  showOptional?: boolean;
  showRequired?: boolean;
};

// Contexts
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormContext = React.createContext<FormContextValue>({});

// Enhanced Form Provider
const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      onSubmit,
      loading = false,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({
        loading,
        disabled,
      }),
      [loading, disabled]
    );

    const handleSubmit = React.useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (onSubmit && !loading && !disabled) {
          const form = event.currentTarget;
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          onSubmit(data);
        }
      },
      [onSubmit, loading, disabled]
    );

    return (
      <FormContext.Provider value={contextValue}>
        <FormProvider {...props}>
          <form
            ref={ref}
            onSubmit={handleSubmit}
            className={cn("space-y-6", className)}
            noValidate
          >
            {children}
          </form>
        </FormProvider>
      </FormContext.Provider>
    );
  }
);

Form.displayName = "Form";

// Enhanced FormField with additional props
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  description,
  tooltip,
  showOptional = false,
  showRequired = false,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
        description,
        tooltip,
        showOptional,
        showRequired,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// Enhanced useFormField hook
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const formContext = React.useContext(FormContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id, required, disabled } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    formTooltipId: `${id}-form-item-tooltip`,
    description: fieldContext.description,
    tooltip: fieldContext.tooltip,
    required: required || fieldContext.showRequired,
    disabled: disabled || formContext.disabled,
    loading: formContext.loading,
    showOptional: fieldContext.showOptional,
    ...fieldState,
  };
};

// Enhanced FormItem
const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  (
    { className, variant, disabled: itemDisabled, required = false, ...props },
    ref
  ) => {
    const id = React.useId();
    const { disabled: formDisabled } = React.useContext(FormContext);
    const disabled = itemDisabled || formDisabled;

    return (
      <FormItemContext.Provider value={{ id, required, disabled }}>
        <div
          ref={ref}
          className={cn(formItemVariants({ variant, disabled }), className)}
          {...props}
        />
      </FormItemContext.Provider>
    );
  }
);

FormItem.displayName = "FormItem";

// Enhanced FormLabel with icons and tooltips
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  FormLabelProps
>(
  (
    {
      className,
      variant,
      state,
      required: labelRequired,
      optional,
      tooltip,
      icon: Icon,
      children,
      ...props
    },
    ref
  ) => {
    const {
      error,
      formItemId,
      required: fieldRequired,
      tooltip: fieldTooltip,
    } = useFormField();

    const isRequired = labelRequired || fieldRequired;
    const actualTooltip = tooltip || fieldTooltip;
    const errorState = error ? "error" : "default";

    // Determine variant based on props
    const labelVariant = isRequired
      ? "required"
      : optional
      ? "optional"
      : variant;

    return (
      <div className="flex items-center gap-2">
        <Label
          ref={ref}
          className={cn(
            formLabelVariants({ variant: labelVariant, state: errorState }),
            className
          )}
          htmlFor={formItemId}
          {...props}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {children}
          </div>
        </Label>

        {actualTooltip && (
          <div className="relative group">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute left-1/2 bottom-full mb-2 hidden group-hover:block">
              <div className="bg-popover text-popover-foreground text-sm rounded-md p-2 shadow-md border max-w-xs -translate-x-1/2 whitespace-pre-wrap">
                {actualTooltip}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

FormLabel.displayName = "FormLabel";

// Enhanced FormControl with validation states
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot> & {
    showValidation?: boolean;
  }
>(({ showValidation = true, ...props }, ref) => {
  const {
    error,
    isDirty,
    isValid,
    formItemId,
    formDescriptionId,
    formMessageId,
    description,
    disabled,
    loading,
  } = useFormField();

  const validationState =
    showValidation && isDirty && !error && isValid ? "valid" : undefined;

  return (
    <div className="relative">
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !error
            ? description
              ? formDescriptionId
              : undefined
            : `${description ? formDescriptionId : ""} ${formMessageId}`.trim()
        }
        aria-invalid={!!error}
        disabled={disabled || loading}
        data-state={validationState}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          validationState === "valid" &&
            "border-green-500 focus-visible:ring-green-500"
        )}
        {...props}
      />

      {/* Validation icon */}
      {showValidation && isDirty && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : null}
        </div>
      )}
    </div>
  );
});

FormControl.displayName = "FormControl";

// Enhanced FormDescription
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    icon?: React.ElementType;
  }
>(({ className, icon: Icon, children, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  if (!children) return null;

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        "text-sm text-muted-foreground flex items-start gap-2",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />}
      <span>{children}</span>
    </p>
  );
});

FormDescription.displayName = "FormDescription";

// Enhanced FormMessage with animations and icons
const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  (
    {
      className,
      children,
      variant = "error",
      icon: Icon,
      animate = true,
      ...props
    },
    ref
  ) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    const getIcon = () => {
      if (Icon) return Icon;
      switch (variant) {
        case "error":
          return AlertTriangle;
        case "warning":
          return AlertTriangle;
        case "success":
          return CheckCircle;
        case "info":
          return Info;
        default:
          return AlertTriangle;
      }
    };

    const MessageIcon = getIcon();

    const messageContent = (
      <p
        ref={ref}
        id={formMessageId}
        role="alert"
        aria-live="polite"
        className={cn(formMessageVariants({ variant }), className)}
        {...props}
      >
        <MessageIcon className="h-4 w-4 flex-shrink-0" />
        <span>{body}</span>
      </p>
    );

    if (animate) {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {messageContent}
          </motion.div>
        </AnimatePresence>
      );
    }

    return messageContent;
  }
);

FormMessage.displayName = "FormMessage";

// FormSection for grouping related fields
const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  (
    {
      className,
      title,
      description,
      icon: Icon,
      collapsible = false,
      defaultCollapsed = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <div className="flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                <h3 className="text-lg font-medium leading-6">{title}</h3>
                {collapsible && (
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto p-1 hover:bg-accent rounded-md transition-colors"
                    aria-expanded={!isCollapsed}
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <AnimatePresence>
          {(!collapsible || !isCollapsed) && (
            <motion.div
              initial={collapsible ? { opacity: 0, height: 0 } : false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormSection.displayName = "FormSection";

// FormActions for submit/cancel buttons
const FormActions = React.forwardRef<HTMLDivElement, FormActionsProps>(
  (
    {
      className,
      loading = false,
      submitText = "Submit",
      cancelText = "Cancel",
      onCancel,
      justify = "end",
      orientation = "horizontal",
      sticky = false,
      children,
      ...props
    },
    ref
  ) => {
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3",
          orientation === "horizontal" ? "flex-row" : "flex-col items-stretch",
          orientation === "horizontal" && justifyClasses[justify],
          sticky && "sticky bottom-0 bg-background border-t pt-4 -mx-6 px-6",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitText}
            </button>
          </>
        )}
      </div>
    );
  }
);

FormActions.displayName = "FormActions";

// Utility hooks
export const useFormValidation = () => {
  const { formState } = useFormContext();

  return {
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    isSubmitting: formState.isSubmitting,
    isSubmitted: formState.isSubmitted,
    errors: formState.errors,
    touchedFields: formState.touchedFields,
    dirtyFields: formState.dirtyFields,
  };
};

export const useFormField2 = <T extends FieldValues, K extends Path<T>>(
  name: K
) => {
  const { control, getFieldState, formState } = useFormContext<T>();
  const fieldState = getFieldState(name, formState);

  return {
    ...fieldState,
    name,
    control,
  };
};

// Preset form field components for common use cases
const PasswordField: React.FC<{
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
}> = ({
  name,
  label = "Password",
  placeholder = "Enter password",
  required = false,
  description,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField
      name={name}
      description={description}
      showRequired={required}
      render={({ field }) => (
        <FormItem required={required}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-input rounded-md bg-background pr-10"
                {...field}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const EmailField: React.FC<{
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
}> = ({
  name,
  label = "Email",
  placeholder = "Enter email",
  required = false,
  description,
}) => (
  <FormField
    name={name}
    description={description}
    showRequired={required}
    render={({ field }) => (
      <FormItem required={required}>
        <FormLabel icon={Mail}>{label}</FormLabel>
        <FormControl>
          <input
            type="email"
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            {...field}
          />
        </FormControl>
        <FormDescription />
        <FormMessage />
      </FormItem>
    )}
  />
);

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormSection,
  FormActions,
  PasswordField,
  EmailField,
  useFormValidation,
  type FormProps,
  type FormFieldProps,
  type FormItemProps,
  type FormLabelProps,
  type FormMessageProps,
  type FormSectionProps,
  type FormActionsProps,
};
