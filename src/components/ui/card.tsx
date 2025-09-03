import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  X,
  MoreHorizontal,
  Star,
  Bookmark,
  Share2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Edit,
  Trash2,
  Copy,
  Heart,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Tag,
  Pin,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced card variants
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border shadow-sm",
        elevated: "border-border shadow-lg hover:shadow-xl",
        outlined: "border-2 border-border shadow-none",
        filled: "border-transparent shadow-sm bg-muted/50",
        ghost: "border-transparent shadow-none bg-transparent",
        gradient:
          "border-transparent shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10",
        glass: "border-white/20 shadow-xl bg-white/10 backdrop-blur-sm",
      },
      size: {
        sm: "text-sm",
        default: "",
        lg: "text-lg",
      },
      padding: {
        none: "[&>*]:p-0",
        sm: "[&>*]:p-3",
        default: "[&>*]:p-6",
        lg: "[&>*]:p-8",
      },
      interactive: {
        none: "",
        hover:
          "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
        clickable: "cursor-pointer hover:bg-accent/5 active:bg-accent/10",
      },
      status: {
        none: "",
        success: "border-l-4 border-l-green-500",
        warning: "border-l-4 border-l-yellow-500",
        error: "border-l-4 border-l-red-500",
        info: "border-l-4 border-l-blue-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      padding: "default",
      interactive: "none",
      status: "none",
    },
  }
);

const headerVariants = cva("flex flex-col space-y-1.5", {
  variants: {
    orientation: {
      vertical: "flex-col space-y-1.5 space-x-0",
      horizontal: "flex-row items-center justify-between space-y-0 space-x-4",
    },
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
      end: "items-end text-right",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    align: "start",
  },
});

// Enhanced Card interfaces
interface CardAction {
  id: string;
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: "default" | "destructive" | "ghost";
  disabled?: boolean;
}

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  loading?: boolean;
  actions?: CardAction[];
  badge?: React.ReactNode;
  avatar?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  imagePosition?: "top" | "left" | "right" | "background";
  href?: string;
  target?: "_blank" | "_self";
  animate?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  contextMenu?: CardAction[];
  metadata?: {
    author?: string;
    date?: Date;
    category?: string;
    tags?: string[];
    readTime?: string;
    likes?: number;
    comments?: number;
  };
}

interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  actions?: CardAction[];
  subtitle?: string;
  icon?: React.ElementType;
  avatar?: React.ReactNode;
  badge?: React.ReactNode;
}

// Enhanced Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      padding,
      interactive,
      status,
      collapsible = false,
      defaultCollapsed = false,
      onCollapse,
      loading = false,
      actions = [],
      badge,
      avatar,
      image,
      imageAlt,
      imagePosition = "top",
      href,
      target = "_self",
      animate = false,
      hoverable = false,
      selectable = false,
      selected = false,
      onSelect,
      draggable = false,
      onDragStart,
      onDrop,
      contextMenu = [],
      metadata,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const [showContextMenu, setShowContextMenu] = React.useState(false);
    const [contextMenuPosition, setContextMenuPosition] = React.useState({
      x: 0,
      y: 0,
    });

    const handleCollapse = React.useCallback(() => {
      const newCollapsed = !collapsed;
      setCollapsed(newCollapsed);
      onCollapse?.(newCollapsed);
    }, [collapsed, onCollapse]);

    const handleClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (href) {
          if (target === "_blank") {
            window.open(href, "_blank");
          } else {
            window.location.href = href;
          }
          return;
        }

        if (selectable) {
          onSelect?.(!selected);
        }

        onClick?.(e);
      },
      [href, target, selectable, selected, onSelect, onClick]
    );

    const handleContextMenu = React.useCallback(
      (e: React.MouseEvent) => {
        if (contextMenu.length === 0) return;

        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
      },
      [contextMenu]
    );

    // Close context menu when clicking outside
    React.useEffect(() => {
      const handleClickOutside = () => setShowContextMenu(false);
      if (showContextMenu) {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }
    }, [showContextMenu]);

    const cardContent = (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, padding, interactive, status }),
          hoverable && "hover:shadow-md transition-shadow",
          selectable && selected && "ring-2 ring-primary ring-offset-2",
          draggable && "cursor-move",
          loading && "opacity-50 pointer-events-none",
          className
        )}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDragStart={onDragStart}
        onDrop={onDrop}
        draggable={draggable}
        role={onClick || href ? "button" : undefined}
        tabIndex={onClick || href ? 0 : undefined}
        {...props}
      >
        {/* Badge */}
        {badge && <div className="absolute -top-2 -right-2 z-10">{badge}</div>}

        {/* Background Image */}
        {image && imagePosition === "background" && (
          <div
            className="absolute inset-0 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-lg" />
          </div>
        )}

        {/* Top Image */}
        {image && imagePosition === "top" && (
          <div className="relative -m-6 mb-0 overflow-hidden rounded-t-lg">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div
          className={cn(
            "relative",
            image && imagePosition === "background" && "z-10 text-white",
            imagePosition === "top" && "pt-6"
          )}
        >
          {children}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {/* Context Menu */}
        {showContextMenu && contextMenu.length > 0 && (
          <div
            className="fixed bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg z-50 min-w-32"
            style={{
              left: contextMenuPosition.x,
              top: contextMenuPosition.y,
            }}
          >
            {contextMenu.map((action) => (
              <button
                key={action.id}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setShowContextMenu(false);
                }}
                disabled={action.disabled}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors first:rounded-t-md last:rounded-b-md",
                  action.variant === "destructive" &&
                    "text-red-600 hover:bg-red-50"
                )}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={hoverable ? { y: -2 } : undefined}
          transition={{ duration: 0.2 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

Card.displayName = "Card";

// Enhanced CardHeader
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    {
      className,
      orientation,
      align,
      actions = [],
      subtitle,
      icon: Icon,
      avatar,
      badge,
      children,
      ...props
    },
    ref
  ) => {
    const [showActions, setShowActions] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(headerVariants({ orientation, align }), "p-6", className)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        {...props}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          {avatar && <div className="flex-shrink-0">{avatar}</div>}

          {/* Icon */}
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            {children}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Badge */}
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div
            className={cn(
              "flex items-center gap-1 transition-opacity",
              showActions ? "opacity-100" : "opacity-0"
            )}
          >
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                className="p-1 hover:bg-accent rounded-md transition-colors"
                title={action.label}
              >
                {action.icon && <action.icon className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Enhanced CardTitle
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    truncate?: boolean;
  }
>(({ className, as: Comp = "h3", truncate = false, ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      truncate && "truncate",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

// Enhanced CardDescription
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    truncate?: boolean;
    lines?: number;
  }
>(({ className, truncate = false, lines, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-muted-foreground",
      truncate && "truncate",
      lines && `line-clamp-${lines}`,
      className
    )}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

// Enhanced CardContent
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    scrollable?: boolean;
    maxHeight?: string;
  }
>(({ className, scrollable = false, maxHeight, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", scrollable && "overflow-y-auto", className)}
    style={maxHeight ? { maxHeight } : undefined}
    {...props}
  />
));

CardContent.displayName = "CardContent";

// Enhanced CardFooter
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: "start" | "center" | "end" | "between";
    orientation?: "horizontal" | "vertical";
  }
>(
  (
    { className, justify = "start", orientation = "horizontal", ...props },
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
          "flex items-center p-6 pt-0",
          orientation === "vertical"
            ? "flex-col space-y-2"
            : "flex-row space-x-2",
          justifyClasses[justify],
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = "CardFooter";

// Card Metadata component
const CardMetadata = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    author?: string;
    date?: Date;
    category?: string;
    tags?: string[];
    readTime?: string;
    likes?: number;
    comments?: number;
  }
>(
  (
    {
      className,
      author,
      date,
      category,
      tags = [],
      readTime,
      likes,
      comments,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
        className
      )}
      {...props}
    >
      {author && (
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{author}</span>
        </div>
      )}

      {date && (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      )}

      {readTime && (
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{readTime}</span>
        </div>
      )}

      {category && (
        <div className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          <span>{category}</span>
        </div>
      )}

      {likes !== undefined && (
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>{likes}</span>
        </div>
      )}

      {comments !== undefined && (
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>{comments}</span>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex items-center gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-1 py-0.5 bg-muted rounded text-xs">
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs">+{tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
);

CardMetadata.displayName = "CardMetadata";

// Card Grid component
interface CardGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  (
    {
      children,
      columns = { mobile: 1, tablet: 2, desktop: 3 },
      gap = "md",
      className,
    },
    ref
  ) => {
    const gapClasses = {
      sm: "gap-3",
      md: "gap-6",
      lg: "gap-8",
    };

    const gridClasses = `grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

    return (
      <div ref={ref} className={cn(gridClasses, gapClasses[gap], className)}>
        {children}
      </div>
    );
  }
);

CardGrid.displayName = "CardGrid";

// Preset card components
const ProductCard: React.FC<
  CardProps & {
    product: {
      name: string;
      price: string;
      image: string;
      description?: string;
      rating?: number;
      inStock?: boolean;
    };
  }
> = ({ product, ...props }) => (
  <Card variant="elevated" hoverable animate {...props}>
    <div className="relative">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white font-medium">Out of Stock</span>
        </div>
      )}
    </div>
    <CardHeader>
      <CardTitle className="text-lg">{product.name}</CardTitle>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-primary">{product.price}</span>
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
        )}
      </div>
    </CardHeader>
    {product.description && (
      <CardContent>
        <CardDescription>{product.description}</CardDescription>
      </CardContent>
    )}
  </Card>
);

const ProfileCard: React.FC<
  CardProps & {
    profile: {
      name: string;
      title: string;
      avatar: string;
      bio?: string;
      stats?: { label: string; value: string | number }[];
    };
  }
> = ({ profile, ...props }) => (
  <Card variant="outlined" {...props}>
    <CardHeader align="center">
      <img
        src={profile.avatar}
        alt={profile.name}
        className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
      />
      <CardTitle className="text-xl">{profile.name}</CardTitle>
      <CardDescription>{profile.title}</CardDescription>
    </CardHeader>
    {profile.bio && (
      <CardContent>
        <p className="text-sm text-center">{profile.bio}</p>
      </CardContent>
    )}
    {profile.stats && (
      <CardFooter justify="center">
        <div className="flex gap-6">
          {profile.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-semibold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardFooter>
    )}
  </Card>
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardMetadata,
  CardGrid,
  ProductCard,
  ProfileCard,
  type CardProps,
  type CardAction,
};
