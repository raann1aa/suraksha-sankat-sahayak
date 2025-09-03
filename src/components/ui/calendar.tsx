import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Plus,
  Minus,
  Star,
  Bookmark,
  MoreHorizontal,
  Filter,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// Enhanced calendar variants
const calendarVariants = cva("p-3 border rounded-lg bg-background", {
  variants: {
    variant: {
      default: "border-border",
      outline: "border-2 border-border",
      ghost: "border-transparent",
      floating: "shadow-lg border-border",
    },
    size: {
      sm: "p-2 text-sm [&_.rdp-day]:h-8 [&_.rdp-day]:w-8",
      default: "p-3 [&_.rdp-day]:h-9 [&_.rdp-day]:w-9",
      lg: "p-4 text-lg [&_.rdp-day]:h-10 [&_.rdp-day]:w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

// Enhanced Calendar props interface
export interface CalendarProps
  extends React.ComponentProps<typeof DayPicker>,
    VariantProps<typeof calendarVariants> {
  mode?: "single" | "multiple" | "range";
  locale?: Locale;
  showWeekNumbers?: boolean;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  numberOfMonths?: number;
  enableYearNavigation?: boolean;
  enableMonthNavigation?: boolean;
  showToday?: boolean;
  showTimePicker?: boolean;
  timePickerProps?: {
    minuteStep?: number;
    hourStep?: number;
    format24h?: boolean;
  };
  holidays?: Date[];
  events?: Array<{
    date: Date;
    title: string;
    color?: string;
    description?: string;
  }>;
  customDayContent?: (date: Date) => React.ReactNode;
  onMonthChange?: (month: Date) => void;
  onYearChange?: (year: number) => void;
  onTodayClick?: () => void;
  quickSelect?: {
    today: boolean;
    tomorrow: boolean;
    nextWeek: boolean;
    nextMonth: boolean;
  };
  footer?: React.ReactNode;
  header?: React.ReactNode;
  animate?: boolean;
  theme?: "light" | "dark" | "auto";
  compact?: boolean;
  showPresets?: boolean;
  customPresets?: Array<{
    label: string;
    value: Date | [Date, Date];
    description?: string;
  }>;
}

// Time picker component
const TimePicker: React.FC<{
  selected?: Date;
  onTimeChange?: (time: { hours: number; minutes: number }) => void;
  format24h?: boolean;
  minuteStep?: number;
  hourStep?: number;
}> = ({
  selected,
  onTimeChange,
  format24h = true,
  minuteStep = 15,
  hourStep = 1,
}) => {
  const [hours, setHours] = React.useState(selected?.getHours() || 0);
  const [minutes, setMinutes] = React.useState(selected?.getMinutes() || 0);
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");

  React.useEffect(() => {
    if (selected) {
      const h = selected.getHours();
      setHours(format24h ? h : h > 12 ? h - 12 : h || 12);
      setMinutes(selected.getMinutes());
      setPeriod(h >= 12 ? "PM" : "AM");
    }
  }, [selected, format24h]);

  const handleTimeChange = () => {
    const actualHours = format24h
      ? hours
      : period === "PM" && hours !== 12
      ? hours + 12
      : period === "AM" && hours === 12
      ? 0
      : hours;

    onTimeChange?.({ hours: actualHours, minutes });
  };

  React.useEffect(handleTimeChange, [
    hours,
    minutes,
    period,
    format24h,
    onTimeChange,
  ]);

  return (
    <div className="flex items-center justify-center gap-2 p-3 border-t">
      <div className="flex items-center gap-1">
        <button
          onClick={() =>
            setHours((h) => Math.max(format24h ? 0 : 1, h - hourStep))
          }
          className="p-1 hover:bg-accent rounded"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-mono">
          {String(hours).padStart(2, "0")}
        </span>
        <button
          onClick={() =>
            setHours((h) => Math.min(format24h ? 23 : 12, h + hourStep))
          }
          className="p-1 hover:bg-accent rounded"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <span className="text-muted-foreground">:</span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setMinutes((m) => Math.max(0, m - minuteStep))}
          className="p-1 hover:bg-accent rounded"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-mono">
          {String(minutes).padStart(2, "0")}
        </span>
        <button
          onClick={() => setMinutes((m) => Math.min(59, m + minuteStep))}
          className="p-1 hover:bg-accent rounded"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {!format24h && (
        <button
          onClick={() => setPeriod((p) => (p === "AM" ? "PM" : "AM"))}
          className="px-2 py-1 text-sm bg-accent hover:bg-accent/80 rounded"
        >
          {period}
        </button>
      )}
    </div>
  );
};

// Quick select presets
const QuickSelectPresets: React.FC<{
  onSelect: (date: Date | [Date, Date]) => void;
  mode?: "single" | "multiple" | "range";
  customPresets?: Array<{
    label: string;
    value: Date | [Date, Date];
    description?: string;
  }>;
}> = ({ onSelect, mode, customPresets }) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const defaultPresets = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: tomorrow },
    {
      label: "Next Week",
      value: mode === "range" ? ([today, nextWeek] as [Date, Date]) : nextWeek,
    },
    {
      label: "Next Month",
      value:
        mode === "range" ? ([today, nextMonth] as [Date, Date]) : nextMonth,
    },
  ];

  const presets = customPresets || defaultPresets;

  return (
    <div className="p-2 border-b space-y-1">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Quick Select
      </div>
      {presets.map((preset, index) => (
        <button
          key={index}
          onClick={() => onSelect(preset.value)}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-accent rounded transition-colors"
        >
          <div className="font-medium">{preset.label}</div>
          {preset.description && (
            <div className="text-xs text-muted-foreground">
              {preset.description}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// Enhanced month/year navigation
const MonthYearNavigation: React.FC<{
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  onYearChange?: (year: number) => void;
  enableYearNavigation?: boolean;
  enableMonthNavigation?: boolean;
}> = ({
  currentMonth,
  onMonthChange,
  onYearChange,
  enableYearNavigation = true,
  enableMonthNavigation = true,
}) => {
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [showYearPicker, setShowYearPicker] = React.useState(false);

  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  return (
    <div className="flex items-center justify-between p-2 border-b">
      <div className="flex items-center gap-2">
        {enableMonthNavigation && (
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded"
            >
              {months[currentMonthIndex]}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showMonthPicker && (
              <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      const newDate = new Date(currentYear, index, 1);
                      onMonthChange(newDate);
                      setShowMonthPicker(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent",
                      index === currentMonthIndex && "bg-accent font-medium"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {enableYearNavigation && (
          <div className="relative">
            <button
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="flex items-center gap-1 px-2 py-1 text-sm hover:bg-accent rounded"
            >
              {currentYear}
              <ChevronDown className="w-3 h-3" />
            </button>

            {showYearPicker && (
              <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      const newDate = new Date(year, currentMonthIndex, 1);
                      onMonthChange(newDate);
                      onYearChange?.(year);
                      setShowYearPicker(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-accent",
                      year === currentYear && "bg-accent font-medium"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            const prevMonth = new Date(currentMonth);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            onMonthChange(prevMonth);
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-7 w-7 p-0"
          )}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>

        <button
          onClick={() => {
            const nextMonth = new Date(currentMonth);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            onMonthChange(nextMonth);
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-7 w-7 p-0"
          )}
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  variant,
  size,
  mode = "single",
  locale,
  showWeekNumbers = false,
  fixedWeeks = false,
  numberOfMonths = 1,
  enableYearNavigation = true,
  enableMonthNavigation = true,
  showToday = true,
  showTimePicker = false,
  timePickerProps,
  holidays = [],
  events = [],
  customDayContent,
  onMonthChange,
  onYearChange,
  onTodayClick,
  quickSelect,
  footer,
  header,
  animate = false,
  theme = "auto",
  compact = false,
  showPresets = false,
  customPresets,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected instanceof Date ? selected : new Date()
  );
  const [selectedTime, setSelectedTime] = React.useState<{
    hours: number;
    minutes: number;
  }>({
    hours: 0,
    minutes: 0,
  });

  // Handle month change
  const handleMonthChange = React.useCallback(
    (month: Date) => {
      setCurrentMonth(month);
      onMonthChange?.(month);
    },
    [onMonthChange]
  );

  // Handle today click
  const handleTodayClick = React.useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    onSelect?.(today as any);
    onTodayClick?.();
  }, [onSelect, onTodayClick]);

  // Handle preset selection
  const handlePresetSelect = React.useCallback(
    (value: Date | [Date, Date]) => {
      onSelect?.(value as any);
      if (value instanceof Date) {
        setCurrentMonth(value);
      }
    },
    [onSelect]
  );

  // Handle time change
  const handleTimeChange = React.useCallback(
    (time: { hours: number; minutes: number }) => {
      setSelectedTime(time);
      if (selected instanceof Date) {
        const newDate = new Date(selected);
        newDate.setHours(time.hours, time.minutes);
        onSelect?.(newDate as any);
      }
    },
    [selected, onSelect]
  );

  // Custom day renderer with events and holidays
  const renderDay = React.useCallback(
    (date: Date) => {
      const dateString = date.toDateString();
      const isHoliday = holidays.some(
        (holiday) => holiday.toDateString() === dateString
      );
      const dayEvents = events.filter(
        (event) => event.date.toDateString() === dateString
      );
      const hasEvents = dayEvents.length > 0;

      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span
            className={cn(
              isHoliday && "text-red-500 font-semibold",
              hasEvents && "font-medium"
            )}
          >
            {date.getDate()}
          </span>

          {/* Event indicators */}
          {hasEvents && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: event.color || "#3b82f6" }}
                  title={event.title}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              )}
            </div>
          )}

          {/* Holiday indicator */}
          {isHoliday && (
            <Star className="absolute top-0.5 right-0.5 w-2 h-2 text-red-500" />
          )}

          {/* Custom content */}
          {customDayContent?.(date)}
        </div>
      );
    },
    [holidays, events, customDayContent]
  );

  const calendarContent = (
    <div className={cn(calendarVariants({ variant, size }), className)}>
      {/* Custom Header */}
      {header}

      {/* Presets */}
      {showPresets && (
        <QuickSelectPresets
          onSelect={handlePresetSelect}
          mode={mode}
          customPresets={customPresets}
        />
      )}

      {/* Enhanced Navigation */}
      {(enableMonthNavigation || enableYearNavigation) && (
        <MonthYearNavigation
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
          onYearChange={onYearChange}
          enableYearNavigation={enableYearNavigation}
          enableMonthNavigation={enableMonthNavigation}
        />
      )}

      {/* Main Calendar */}
      <DayPicker
        mode={mode as any}
        selected={selected}
        onSelect={onSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={showOutsideDays}
        showWeekNumber={showWeekNumbers}
        fixedWeeks={fixedWeeks}
        numberOfMonths={numberOfMonths}
        locale={locale}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "h-9 w-9 text-center text-sm p-0 relative",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            "[&:has([aria-selected].day-outside)]:bg-accent/50",
            "[&:has([aria-selected])]:bg-accent",
            "first:[&:has([aria-selected])]:rounded-l-md",
            "last:[&:has([aria-selected])]:rounded-r-md",
            "focus-within:relative focus-within:z-20"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...iconProps }) => (
            <ChevronLeft className="h-4 w-4" {...iconProps} />
          ),
          IconRight: ({ ...iconProps }) => (
            <ChevronRight className="h-4 w-4" {...iconProps} />
          ),
          Day: ({ date, ...dayProps }) => (
            <div {...dayProps}>{renderDay(date)}</div>
          ),
        }}
        {...props}
      />

      {/* Today Button */}
      {showToday && (
        <div className="flex justify-center pt-2 border-t">
          <button
            onClick={handleTodayClick}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 px-3"
            )}
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            Today
          </button>
        </div>
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <TimePicker
          selected={selected instanceof Date ? selected : undefined}
          onTimeChange={handleTimeChange}
          {...timePickerProps}
        />
      )}

      {/* Custom Footer */}
      {footer}
    </div>
  );

  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {calendarContent}
    </motion.div>
  ) : (
    calendarContent
  );
}

Calendar.displayName = "Calendar";

// Preset calendar components
const DatePicker: React.FC<CalendarProps> = (props) => (
  <Calendar mode="single" {...props} />
);

const DateRangePicker: React.FC<CalendarProps> = (props) => (
  <Calendar mode="range" {...props} />
);

const DateTimePicker: React.FC<CalendarProps> = (props) => (
  <Calendar showTimePicker {...props} />
);

const CompactCalendar: React.FC<CalendarProps> = (props) => (
  <Calendar compact size="sm" variant="ghost" {...props} />
);

export {
  Calendar,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  CompactCalendar,
  type CalendarProps,
};
