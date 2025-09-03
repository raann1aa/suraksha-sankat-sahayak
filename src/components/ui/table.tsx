import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  Settings,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Enhanced table variants
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "",
      bordered: "border border-border",
      striped: "[&_tbody_tr:nth-child(even)]:bg-muted/50",
      hover: "[&_tbody_tr:hover]:bg-muted/50",
    },
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
    layout: {
      auto: "table-auto",
      fixed: "table-fixed",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    layout: "auto",
  },
});

// Enhanced interfaces
interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  caption?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  responsive?: boolean;
  maxHeight?: string;
  sortable?: boolean;
  selectable?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  resizable?: boolean;
  sticky?: boolean;
  align?: "left" | "center" | "right";
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
  truncate?: boolean;
  align?: "left" | "center" | "right";
}

interface TableData {
  id: string | number;
  [key: string]: any;
}

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: TableData) => React.ReactNode;
}

interface DataTableProps {
  data: TableData[];
  columns: Column[];
  loading?: boolean;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (column: string, direction: "asc" | "desc") => void;
  emptyMessage?: string;
  caption?: string;
}

// Enhanced Table with comprehensive accessibility[385][390][391]
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      layout = "auto",
      caption,
      loading = false,
      empty = false,
      emptyMessage = "No data available",
      stickyHeader = false,
      responsive = true,
      maxHeight,
      sortable = false,
      selectable = false,
      children,
      ...props
    },
    ref
  ) => {
    const tableRef = React.useRef<HTMLTableElement>(null);
    const [focusedCell, setFocusedCell] = React.useState<{
      row: number;
      col: number;
    } | null>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => tableRef.current!, []);

    // Keyboard navigation for accessibility[385][389]
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!focusedCell) return;

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            setFocusedCell((prev) =>
              prev ? { ...prev, row: Math.max(0, prev.row - 1) } : null
            );
            break;
          case "ArrowDown":
            e.preventDefault();
            setFocusedCell((prev) =>
              prev ? { ...prev, row: prev.row + 1 } : null
            );
            break;
          case "ArrowLeft":
            e.preventDefault();
            setFocusedCell((prev) =>
              prev ? { ...prev, col: Math.max(0, prev.col - 1) } : null
            );
            break;
          case "ArrowRight":
            e.preventDefault();
            setFocusedCell((prev) =>
              prev ? { ...prev, col: prev.col + 1 } : null
            );
            break;
          case "Home":
            e.preventDefault();
            setFocusedCell((prev) => (prev ? { ...prev, col: 0 } : null));
            break;
          case "End":
            e.preventDefault();
            // Would need column count logic
            break;
        }
      },
      [focusedCell]
    );

    const containerClass = cn(
      "relative w-full",
      responsive && "overflow-auto",
      stickyHeader && "max-h-96 overflow-y-auto"
    );

    return (
      <div
        className={containerClass}
        style={{ maxHeight }}
        onKeyDown={handleKeyDown}
      >
        <table
          ref={tableRef}
          className={cn(tableVariants({ variant, size, layout }), className)}
          role="table"
          aria-label={props["aria-label"]}
          aria-describedby={props["aria-describedby"]}
          {...props}
        >
          {caption && <TableCaption>{caption}</TableCaption>}

          {loading && (
            <TableCaption>
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading data...
              </div>
            </TableCaption>
          )}

          {empty && !loading && (
            <TableCaption>
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Info className="h-4 w-4" />
                {emptyMessage}
              </div>
            </TableCaption>
          )}

          {!loading && !empty && children}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

// Enhanced TableHeader with accessibility improvements[390][392]
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        "[&_tr]:border-b",
        sticky && "sticky top-0 z-10 bg-background",
        className
      )}
      role="rowgroup"
      {...props}
    />
  )
);

TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    role="rowgroup"
    {...props}
  />
));

TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    role="rowgroup"
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

// Enhanced TableRow with selection and interaction[385][394]
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { className, selected = false, disabled = false, onClick, ...props },
    ref
  ) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors",
        !disabled && "hover:bg-muted/50",
        selected && "bg-muted data-[state=selected]:bg-muted",
        disabled && "opacity-50 cursor-not-allowed",
        onClick && "cursor-pointer",
        className
      )}
      role="row"
      aria-selected={selected}
      onClick={disabled ? undefined : onClick}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={
        onClick && !disabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      {...props}
    />
  )
);

TableRow.displayName = "TableRow";

// Enhanced TableHead with sorting and accessibility[385][390][394]
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortable = false,
      sortDirection = null,
      onSort,
      resizable = false,
      sticky = false,
      align = "left",
      children,
      ...props
    },
    ref
  ) => {
    const content = (
      <div
        className={cn(
          "flex items-center gap-2",
          align === "center" && "justify-center",
          align === "right" && "justify-end"
        )}
      >
        <span className="truncate">{children}</span>
        {sortable && (
          <button
            className="p-1 hover:bg-muted rounded transition-colors"
            onClick={onSort}
            aria-label={`Sort by ${children} ${
              sortDirection === "asc" ? "descending" : "ascending"
            }`}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="h-3 w-3" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="h-3 w-3" />
            ) : (
              <ArrowUpDown className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
    );

    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          align === "left" && "text-left",
          align === "center" && "text-center",
          align === "right" && "text-right",
          sticky && "sticky top-0 z-20 bg-background",
          sortable && "cursor-pointer select-none",
          className
        )}
        role="columnheader"
        aria-sort={
          sortDirection
            ? sortDirection === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
        tabIndex={sortable ? 0 : undefined}
        onKeyDown={
          sortable && onSort
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSort();
                }
              }
            : undefined
        }
        {...props}
      >
        {sortable ? content : children}

        {resizable && (
          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-border opacity-0 hover:opacity-100 transition-opacity" />
        )}
      </th>
    );
  }
);

TableHead.displayName = "TableHead";

// Enhanced TableCell with alignment and truncation[390][393]
const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      className,
      numeric = false,
      truncate = false,
      align = "left",
      children,
      ...props
    },
    ref
  ) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        align === "left" && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        numeric && "font-mono",
        truncate && "truncate max-w-0",
        className
      )}
      role="cell"
      {...props}
    >
      {truncate ? (
        <div
          className="truncate"
          title={typeof children === "string" ? children : undefined}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </td>
  )
);

TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

// Complete DataTable component with all features[385][389]
const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  loading = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortBy,
  sortDirection,
  onSort,
  emptyMessage = "No data available",
  caption,
}) => {
  const [internalSelectedRows, setInternalSelectedRows] =
    React.useState<(string | number)[]>(selectedRows);

  const handleRowSelection = React.useCallback(
    (rowId: string | number, selected: boolean) => {
      const newSelection = selected
        ? [...internalSelectedRows, rowId]
        : internalSelectedRows.filter((id) => id !== rowId);

      setInternalSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    },
    [internalSelectedRows, onSelectionChange]
  );

  const handleSelectAll = React.useCallback(
    (selected: boolean) => {
      const newSelection = selected ? data.map((row) => row.id) : [];
      setInternalSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    },
    [data, onSelectionChange]
  );

  const handleSort = React.useCallback(
    (columnKey: string) => {
      const newDirection =
        sortBy === columnKey && sortDirection === "asc" ? "desc" : "asc";
      onSort?.(columnKey, newDirection);
    },
    [sortBy, sortDirection, onSort]
  );

  return (
    <Table
      variant="hover"
      loading={loading}
      empty={data.length === 0}
      emptyMessage={emptyMessage}
      caption={caption}
      stickyHeader
      aria-label={caption || "Data table"}
      aria-rowcount={data.length + 1}
      aria-colcount={columns.length + (selectable ? 1 : 0)}
    >
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={
                  internalSelectedRows.length === data.length && data.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {columns.map((column, index) => (
            <TableHead
              key={column.key}
              sortable={column.sortable}
              sortDirection={sortBy === column.key ? sortDirection : null}
              onSort={
                column.sortable ? () => handleSort(column.key) : undefined
              }
              align={column.align}
              style={{ width: column.width }}
              aria-colindex={index + (selectable ? 2 : 1)}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={row.id}
            selected={internalSelectedRows.includes(row.id)}
            aria-rowindex={rowIndex + 2}
          >
            {selectable && (
              <TableCell>
                <input
                  type="checkbox"
                  checked={internalSelectedRows.includes(row.id)}
                  onChange={(e) => handleRowSelection(row.id, e.target.checked)}
                  aria-label={`Select row ${rowIndex + 1}`}
                />
              </TableCell>
            )}
            {columns.map((column, colIndex) => (
              <TableCell
                key={`${row.id}-${column.key}`}
                numeric={typeof row[column.key] === "number"}
                align={column.align}
                aria-colindex={colIndex + (selectable ? 2 : 1)}
              >
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
  type TableProps,
  type TableHeaderProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type DataTableProps,
  type Column,
  type TableData,
};
