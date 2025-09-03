import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Info,
  AlertCircle,
  CheckCircle,
  Star,
  Bookmark,
  ExternalLink,
  Copy,
  Share2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Clock,
  User,
  Calendar,
  Tag,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Heart,
  MessageCircle,
  Flag,
  Archive,
  Pin,
  PinOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Enhanced Types
interface AccordionItemData {
  id: string;
  title: string;
  content?: React.ReactNode;
  description?: string;
  icon?: React.ElementType;
  badge?: string | number;
  priority?: "low" | "medium" | "high" | "critical";
  status?: "active" | "inactive" | "pending" | "completed" | "draft";
  tags?: string[];
  timestamp?: Date;
  author?: string;
  isStarred?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  isPrivate?: boolean;
  metadata?: Record<string, any>;
  actions?: AccordionAction[];
}

interface AccordionAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline";
  disabled?: boolean;
}

interface AccordionContextValue {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  expandedItems: Set<string>;
  setExpandedItems: React.Dispatch<React.SetStateAction<Set<string>>>;
  filteredItems: AccordionItemData[];
  onItemAction: (itemId: string, actionId: string) => void;
  showMetadata: boolean;
  setShowMetadata: (show: boolean) => void;
  sortBy: "title" | "date" | "priority" | "status";
  setSortBy: (sort: "title" | "date" | "priority" | "status") => void;
  groupBy: "none" | "status" | "priority" | "author" | "tags";
  setGroupBy: (
    group: "none" | "status" | "priority" | "author" | "tags"
  ) => void;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "useAccordionContext must be used within AccordionProvider"
    );
  }
  return context;
};

// Enhanced Root Component with Provider
interface AccordionProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> {
  items?: AccordionItemData[];
  searchable?: boolean;
  sortable?: boolean;
  groupable?: boolean;
  showMetadata?: boolean;
  onItemAction?: (itemId: string, actionId: string) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(
  (
    {
      className,
      children,
      items = [],
      searchable = false,
      sortable = false,
      groupable = false,
      showMetadata: initialShowMetadata = false,
      onItemAction,
      emptyState,
      loading = false,
      error,
      ...props
    },
    ref
  ) => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
      new Set()
    );
    const [showMetadata, setShowMetadata] = React.useState(initialShowMetadata);
    const [sortBy, setSortBy] = React.useState<
      "title" | "date" | "priority" | "status"
    >("title");
    const [groupBy, setGroupBy] = React.useState<
      "none" | "status" | "priority" | "author" | "tags"
    >("none");

    // Filter and sort items
    const filteredItems = React.useMemo(() => {
      let filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );

      // Sort items
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "date":
            return (
              (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0)
            );
          case "priority":
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return (
              (priorityOrder[b.priority || "low"] || 0) -
              (priorityOrder[a.priority || "low"] || 0)
            );
          case "status":
            return (a.status || "").localeCompare(b.status || "");
          case "title":
          default:
            return a.title.localeCompare(b.title);
        }
      });

      return filtered;
    }, [items, searchTerm, sortBy]);

    const handleItemAction = React.useCallback(
      (itemId: string, actionId: string) => {
        onItemAction?.(itemId, actionId);
      },
      [onItemAction]
    );

    const contextValue: AccordionContextValue = {
      searchTerm,
      setSearchTerm,
      expandedItems,
      setExpandedItems,
      filteredItems,
      onItemAction: handleItemAction,
      showMetadata,
      setShowMetadata,
      sortBy,
      setSortBy,
      groupBy,
      setGroupBy,
    };

    if (loading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      );
    }

    return (
      <AccordionContext.Provider value={contextValue}>
        <div className="space-y-4">
          {/* Enhanced Controls */}
          {(searchable || sortable || groupable) && (
            <AccordionControls
              searchable={searchable}
              sortable={sortable}
              groupable={groupable}
            />
          )}

          {/* Accordion Content */}
          <AccordionPrimitive.Root
            ref={ref}
            className={cn("space-y-2", className)}
            {...props}
          >
            {items.length > 0 ? (
              <AccordionItemsList />
            ) : filteredItems.length === 0 && searchTerm ? (
              <AccordionEmptySearch />
            ) : (
              emptyState || <AccordionEmptyState />
            )}
            {children}
          </AccordionPrimitive.Root>
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

// Enhanced Controls Component
const AccordionControls: React.FC<{
  searchable: boolean;
  sortable: boolean;
  groupable: boolean;
}> = ({ searchable, sortable, groupable }) => {
  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    groupBy,
    setGroupBy,
    showMetadata,
    setShowMetadata,
    expandedItems,
    setExpandedItems,
    filteredItems,
  } = useAccordionContext();

  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 bg-gray-50 rounded-lg border">
      {/* Search */}
      {searchable && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search accordion items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Sort */}
        {sortable && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="title">Sort by Title</option>
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>
        )}

        {/* Group */}
        {groupable && (
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="none">No Grouping</option>
            <option value="status">Group by Status</option>
            <option value="priority">Group by Priority</option>
            <option value="author">Group by Author</option>
            <option value="tags">Group by Tags</option>
          </select>
        )}

        {/* Metadata Toggle */}
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className={cn(
            "px-3 py-2 text-sm border rounded-md transition-colors",
            showMetadata
              ? "bg-blue-100 text-blue-700 border-blue-300"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          )}
          title="Toggle metadata display"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Expand All */}
        <button
          onClick={() => {
            if (expandedItems.size === filteredItems.length) {
              setExpandedItems(new Set());
            } else {
              setExpandedItems(new Set(filteredItems.map((item) => item.id)));
            }
          }}
          className="px-3 py-2 text-sm bg-white text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          title={
            expandedItems.size === filteredItems.length
              ? "Collapse All"
              : "Expand All"
          }
        >
          {expandedItems.size === filteredItems.length ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// Items List Component
const AccordionItemsList: React.FC = () => {
  const { filteredItems, groupBy } = useAccordionContext();

  if (groupBy === "none") {
    return (
      <>
        {filteredItems.map((item) => (
          <EnhancedAccordionItem key={item.id} item={item} />
        ))}
      </>
    );
  }

  // Group items
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, AccordionItemData[]> = {};

    filteredItems.forEach((item) => {
      let groupKey = "Other";

      switch (groupBy) {
        case "status":
          groupKey = item.status || "Unknown";
          break;
        case "priority":
          groupKey = item.priority || "low";
          break;
        case "author":
          groupKey = item.author || "Unknown";
          break;
        case "tags":
          groupKey = item.tags?.[0] || "Untagged";
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  }, [filteredItems, groupBy]);

  return (
    <>
      {Object.entries(groupedItems).map(([groupName, items]) => (
        <div key={groupName} className="space-y-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-md">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {groupName} ({items.length})
            </span>
          </div>
          {items.map((item) => (
            <div key={item.id} className="ml-4">
              <EnhancedAccordionItem item={item} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

// Enhanced Accordion Item
const EnhancedAccordionItem: React.FC<{ item: AccordionItemData }> = ({
  item,
}) => {
  const { onItemAction, showMetadata } = useAccordionContext();

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      case "draft":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <AccordionItem
      value={item.id}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon */}
            {item.icon && (
              <div className="flex-shrink-0">
                <item.icon className="w-5 h-5 text-gray-500" />
              </div>
            )}

            {/* Pin Indicator */}
            {item.isPinned && (
              <Pin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}

            {/* Lock Indicator */}
            {item.isLocked && (
              <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900 truncate">
                  {item.title}
                </h3>

                {/* Star */}
                {item.isStarred && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                )}

                {/* Private Indicator */}
                {item.isPrivate && (
                  <EyeOff className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-600 truncate">
                  {item.description}
                </p>
              )}

              {/* Metadata */}
              {showMetadata && (
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {item.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </div>
                  )}
                  {item.timestamp && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.timestamp.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{item.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right side indicators */}
          <div className="flex items-center gap-2 ml-3">
            {/* Badge */}
            {item.badge && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {item.badge}
              </span>
            )}

            {/* Priority */}
            {item.priority && (
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full capitalize",
                  getPriorityColor(item.priority)
                )}
              >
                {item.priority}
              </span>
            )}

            {/* Status */}
            {item.status && (
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full capitalize",
                  getStatusColor(item.status)
                )}
              >
                {item.status}
              </span>
            )}

            {/* Actions Menu */}
            {item.actions && item.actions.length > 0 && (
              <div className="relative">
                <AccordionActionsMenu item={item} />
              </div>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.content}

          {/* Action Buttons */}
          {item.actions && item.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              {item.actions.slice(0, 3).map((action) => (
                <button
                  key={action.id}
                  onClick={() => onItemAction(item.id, action.id)}
                  disabled={action.disabled}
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                    action.variant === "destructive"
                      ? "bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                      : action.variant === "outline"
                      ? "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  )}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
              {item.actions.length > 3 && (
                <span className="text-sm text-gray-500">
                  +{item.actions.length - 3} more actions
                </span>
              )}
            </div>
          )}
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
};

// Actions Menu Component
const AccordionActionsMenu: React.FC<{ item: AccordionItemData }> = ({
  item,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { onItemAction } = useAccordionContext();

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 text-gray-400 hover:text-gray-600 rounded"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-32">
            {item.actions?.map((action) => (
              <button
                key={action.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onItemAction(item.id, action.id);
                  setIsOpen(false);
                }}
                disabled={action.disabled}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 disabled:opacity-50 first:rounded-t-md last:rounded-b-md",
                  action.variant === "destructive" &&
                    "text-red-600 hover:bg-red-50"
                )}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Empty States
const AccordionEmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Archive className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
    <p className="text-gray-500 max-w-sm">
      There are no accordion items to display. Add some items to get started.
    </p>
  </div>
);

const AccordionEmptySearch: React.FC = () => {
  const { searchTerm, setSearchTerm } = useAccordionContext();

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No results found
      </h3>
      <p className="text-gray-500 max-w-sm mb-4">
        No items match your search for "{searchTerm}". Try different keywords or
        clear your search.
      </p>
      <button
        onClick={() => setSearchTerm("")}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        Clear Search
      </button>
    </div>
  );
};

// Enhanced Item Component (keeping original structure)
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// Enhanced Trigger with Animation Support
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    iconVariant?: "chevron" | "plus" | "arrow";
    iconPosition?: "left" | "right";
    showRotateAnimation?: boolean;
  }
>(
  (
    {
      className,
      children,
      iconVariant = "chevron",
      iconPosition = "right",
      showRotateAnimation = true,
      ...props
    },
    ref
  ) => {
    const IconComponent =
      iconVariant === "plus"
        ? Plus
        : iconVariant === "arrow"
        ? ChevronRight
        : ChevronDown;

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "flex flex-1 items-center gap-3 py-4 font-medium transition-all hover:underline",
            iconPosition === "left" ? "flex-row" : "justify-between",
            className
          )}
          {...props}
        >
          {iconPosition === "left" && (
            <IconComponent
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                showRotateAnimation &&
                  iconVariant === "chevron" &&
                  "[&[data-state=open]]:rotate-90",
                showRotateAnimation &&
                  iconVariant === "arrow" &&
                  "[&[data-state=open]]:rotate-90",
                showRotateAnimation &&
                  iconVariant === "plus" &&
                  "[&[data-state=open]]:rotate-45"
              )}
            />
          )}

          <div className="flex-1 text-left">{children}</div>

          {iconPosition === "right" && (
            <IconComponent
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                showRotateAnimation &&
                  iconVariant === "chevron" &&
                  "[&[data-state=open]]:rotate-180",
                showRotateAnimation &&
                  iconVariant === "arrow" &&
                  "[&[data-state=open]]:rotate-90",
                showRotateAnimation &&
                  iconVariant === "plus" &&
                  "[&[data-state=open]]:rotate-45"
              )}
            />
          )}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

// Enhanced Content with Animation Support
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    animationDuration?: "fast" | "normal" | "slow";
    showBorder?: boolean;
  }
>(
  (
    {
      className,
      children,
      animationDuration = "normal",
      showBorder = false,
      ...props
    },
    ref
  ) => {
    const durationClass = {
      fast: "duration-150",
      normal: "duration-200",
      slow: "duration-300",
    }[animationDuration];

    return (
      <AccordionPrimitive.Content
        ref={ref}
        className={cn(
          "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          durationClass,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "pb-4 pt-0",
            showBorder && "border-t border-gray-100 pt-4"
          )}
        >
          {children}
        </div>
      </AccordionPrimitive.Content>
    );
  }
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  type AccordionItemData,
  type AccordionAction,
};
