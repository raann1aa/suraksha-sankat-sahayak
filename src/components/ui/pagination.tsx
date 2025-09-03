import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/components/ui/button";

// Enhanced pagination variants
const paginationVariants = cva("mx-auto flex w-full justify-center", {
  variants: {
    variant: {
      default: "",
      outline: "border rounded-lg p-2",
      minimal: "gap-4",
      compact: "gap-1",
    },
    size: {
      sm: "text-sm",
      default: "",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Enhanced interfaces
interface PaginationProps
  extends React.ComponentProps<"nav">,
    VariantProps<typeof paginationVariants> {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  showFirstLast?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  disabled?: boolean;
  siblingCount?: number;
  boundaryCount?: number;
  showInfo?: boolean;
  showJumpTo?: boolean;
  locale?: {
    previous?: string;
    next?: string;
    first?: string;
    last?: string;
    page?: string;
    of?: string;
    items?: string;
    jumpTo?: string;
    itemsPerPage?: string;
  };
}

interface PaginationLinkProps extends Pick<ButtonProps, "size"> {
  isActive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  "aria-label"?: string;
}

// Pagination logic hook
const usePagination = ({
  currentPage = 1,
  totalPages = 1,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
}) => {
  return React.useMemo(() => {
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

    const totalPageNumbers = siblingCount + 5; // 1 first + 1 last + 1 current + 2*siblingCount

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount, boundaryCount]);
};

// Enhanced Pagination component with comprehensive accessibility[275][276][277]
const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      currentPage = 1,
      totalPages = 1,
      totalItems,
      itemsPerPage = 10,
      showFirstLast = false,
      showPageSize = false,
      pageSizeOptions = [10, 20, 50, 100],
      onPageChange,
      onPageSizeChange,
      loading = false,
      disabled = false,
      siblingCount = 1,
      boundaryCount = 1,
      showInfo = false,
      showJumpTo = false,
      locale = {},
      ...props
    },
    ref
  ) => {
    const [jumpToPage, setJumpToPage] = React.useState("");

    const {
      previous = "Previous",
      next = "Next",
      first = "First",
      last = "Last",
      page = "Page",
      of = "of",
      items = "items",
      jumpTo = "Jump to page",
      itemsPerPage: itemsPerPageLabel = "Items per page",
    } = locale;

    const pages = usePagination({
      currentPage,
      totalPages,
      siblingCount,
      boundaryCount,
    });

    const handlePageChange = React.useCallback(
      (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && !disabled && !loading) {
          onPageChange?.(newPage);
        }
      },
      [onPageChange, totalPages, disabled, loading]
    );

    const handleJumpTo = React.useCallback(() => {
      const pageNum = parseInt(jumpToPage);
      if (pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum);
        setJumpToPage("");
      }
    }, [jumpToPage, handlePageChange, totalPages]);

    // Calculate display information
    const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = totalItems
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : 0;

    return (
      <div className="flex flex-col gap-4">
        {/* Info and Controls */}
        {(showInfo || showPageSize || showJumpTo) && (
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
            {/* Items info */}
            {showInfo && totalItems && (
              <div className="flex items-center gap-2">
                <span>
                  Showing {startItem.toLocaleString()} to{" "}
                  {endItem.toLocaleString()} of {totalItems.toLocaleString()}{" "}
                  {items}
                </span>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Page size selector */}
              {showPageSize && onPageSizeChange && (
                <div className="flex items-center gap-2">
                  <label htmlFor="page-size" className="text-sm">
                    {itemsPerPageLabel}:
                  </label>
                  <select
                    id="page-size"
                    value={itemsPerPage}
                    onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                    className="border border-input rounded px-2 py-1 text-sm bg-background"
                    disabled={disabled || loading}
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Jump to page */}
              {showJumpTo && (
                <div className="flex items-center gap-2">
                  <label htmlFor="jump-to" className="text-sm">
                    {jumpTo}:
                  </label>
                  <input
                    id="jump-to"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJumpTo()}
                    className="w-16 border border-input rounded px-2 py-1 text-sm bg-background"
                    placeholder="1"
                    disabled={disabled || loading}
                  />
                  <button
                    onClick={handleJumpTo}
                    disabled={disabled || loading || !jumpToPage}
                    className="px-2 py-1 text-sm border border-input rounded hover:bg-accent disabled:opacity-50"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination Navigation */}
        <nav
          ref={ref}
          role="navigation"
          aria-label="Pagination Navigation"
          className={cn(paginationVariants({ variant, size }), className)}
          {...props}
        >
          <PaginationContent>
            {/* First page */}
            {showFirstLast && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || disabled || loading}
                  aria-label={`Go to ${first.toLowerCase()} ${page.toLowerCase()}`}
                  size={size === "sm" ? "sm" : "default"}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">{first}</span>
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Previous page */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || disabled || loading}
                loading={loading}
                locale={{ previous }}
              />
            </PaginationItem>

            {/* Page numbers */}
            <AnimatePresence mode="wait">
              {pages.map((pageItem, index) => (
                <PaginationItem key={`${pageItem}-${index}`}>
                  {pageItem === "dots" ? (
                    <PaginationEllipsis />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(pageItem as number)}
                        isActive={currentPage === pageItem}
                        disabled={disabled || loading}
                        aria-label={`Go to ${page.toLowerCase()} ${pageItem}`}
                        aria-current={
                          currentPage === pageItem ? "page" : undefined
                        }
                        size={size === "sm" ? "sm" : "icon"}
                      >
                        {pageItem}
                      </PaginationLink>
                    </motion.div>
                  )}
                </PaginationItem>
              ))}
            </AnimatePresence>

            {/* Next page */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || disabled || loading}
                loading={loading}
                locale={{ next }}
              />
            </PaginationItem>

            {/* Last page */}
            {showFirstLast && (
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || disabled || loading}
                  aria-label={`Go to ${last.toLowerCase()} ${page.toLowerCase()}`}
                  size={size === "sm" ? "sm" : "default"}
                >
                  <span className="sr-only sm:not-sr-only">{last}</span>
                  <ChevronsRight className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            )}
          </PaginationContent>
        </nav>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));

PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));

PaginationItem.displayName = "PaginationItem";

// Enhanced PaginationLink with comprehensive accessibility[276][277][278]
const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  (
    {
      className,
      isActive,
      disabled = false,
      loading = false,
      size = "icon",
      children,
      onClick,
      href,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (disabled || loading) {
          e.preventDefault();
          return;
        }

        if (href) {
          // Let the browser handle navigation
          return;
        }

        e.preventDefault();
        onClick?.();
      },
      [disabled, loading, href, onClick]
    );

    if (href) {
      return (
        <a
          href={href}
          onClick={handleClick}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            buttonVariants({
              variant: isActive ? "default" : "ghost",
              size,
            }),
            disabled && "pointer-events-none opacity-50",
            className
          )}
          {...props}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          buttonVariants({
            variant: isActive ? "default" : "ghost",
            size,
          }),
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        {children}
      </button>
    );
  }
);

PaginationLink.displayName = "PaginationLink";

// Enhanced Previous button with accessibility improvements[277][278]
const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  Omit<PaginationLinkProps, "children"> & {
    locale?: { previous?: string };
  }
>(({ className, disabled, loading, locale = {}, ...props }, ref) => {
  const { previous = "Previous" } = locale;

  return (
    <PaginationLink
      ref={ref}
      aria-label={`Go to ${previous.toLowerCase()} page`}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      disabled={disabled}
      loading={loading}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>{previous}</span>
    </PaginationLink>
  );
});

PaginationPrevious.displayName = "PaginationPrevious";

// Enhanced Next button with accessibility improvements[277][278]
const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  Omit<PaginationLinkProps, "children"> & {
    locale?: { next?: string };
  }
>(({ className, disabled, loading, locale = {}, ...props }, ref) => {
  const { next = "Next" } = locale;

  return (
    <PaginationLink
      ref={ref}
      aria-label={`Go to ${next.toLowerCase()} page`}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      disabled={disabled}
      loading={loading}
      {...props}
    >
      <span>{next}</span>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
});

PaginationNext.displayName = "PaginationNext";

// Enhanced Ellipsis with better accessibility[277]
const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));

PaginationEllipsis.displayName = "PaginationEllipsis";

// Utility hook for pagination state management
export const usePaginationState = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const handlePageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  const reset = React.useCallback(() => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    reset,
  };
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  usePagination,
  type PaginationProps,
  type PaginationLinkProps,
};
