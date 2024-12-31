/**
 * YearlyOverview Component
 * Displays a GitHub-style contribution graph showing habit completions over the past year.
 * The graph uses different shades of red to indicate completion intensity per day.
 */
import { Card } from "@/components/ui/card";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { memo, useCallback, useMemo } from "react";

import { Id } from "@server/convex/_generated/dataModel";

// Type definitions for the component's props
interface YearlyOverviewProps {
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    calendarId: Id<"calendars">;
  }>;
  calendars: Array<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  }>;
}

export const YearlyOverview = ({ completions }: YearlyOverviewProps) => {
  // Calculate and memoize the calendar grid structure and month labels
  // This only needs to be calculated once since it's based on static dates
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const yearAgo = subYears(today, 1);
    // Generate array of dates for the past year in yyyy-MM-dd format
    const days = eachDayOfInterval({ start: yearAgo, end: today }).map((date) => format(date, "yyyy-MM-dd"));

    // Create week arrays with padding for proper calendar alignment
    const firstDayOfWeek = getDay(yearAgo);
    const emptyStartDays = Array(firstDayOfWeek).fill(null);
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [...emptyStartDays];

    // Group days into weeks of 7
    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Pad the last week with null values if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Generate month labels for the calendar header
    const monthLabels = [];
    const firstMonth = new Date(yearAgo);
    firstMonth.setDate(1);

    let currentDate = firstMonth;
    while (monthLabels.length <= 12) {
      monthLabels.push({
        key: `${format(currentDate, "MMM yyyy")}-${monthLabels.length}`,
        label: format(currentDate, "MMM"),
      });
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return { weeks, monthLabels };
  }, []);

  // Calculate and memoize the number of completions per day
  const completionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const dateKey = format(date, "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }, [completions]);

  // Determine the color intensity based on the number of completions
  const getColorClass = useCallback((count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count <= 2) return "fill-red-500/50 dark:fill-red-500/50";
    if (count <= 5) return "fill-red-500/65 dark:fill-red-500/65";
    if (count <= 10) return "fill-red-600/80 dark:fill-red-600/80";
    return "fill-red-600 dark:fill-red-600";
  }, []);

  // Memoized grid cell component for better performance
  // Renders either an empty cell, a blank day, or a completion indicator
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="aspect-square w-[5px] sm:w-[9px] md:w-4" />;

    const count = completionCounts[day] || 0;
    const colorClass = getColorClass(count);

    // Render empty cell for days with no completions
    if (count === 0) {
      return (
        <div
          className={`aspect-square w-[5px] sm:w-[9px] md:w-4 rounded-full ${colorClass}`}
          title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
        />
      );
    }

    // Render completion indicator for days with completions
    return (
      <div
        className="aspect-square w-[5px] sm:w-[9px] md:w-4 relative hover:opacity-80 transition-colors"
        title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
      >
        <svg viewBox="0 0 15 15" className={`w-full h-full ${colorClass}`}>
          <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
        </svg>
      </div>
    );
  });
  GridCell.displayName = "GridCell";

  // Calculate total number of completions for the year
  const totalCompletions = useMemo(() => {
    return Object.values(completionCounts).reduce((sum, count) => sum + count, 0);
  }, [completionCounts]);

  return (
    <div className="mx-auto sm:mt-16 mt-2">
      <div className="mx-auto pl-2 pb-1 max-w-full md:w-[1000px] text-xs text-muted-foreground">
        <span className="font-bold">Yearly Overview</span>{" "}
        <span className="text-muted-foreground/75">({totalCompletions} things done last year)</span>
      </div>
      <Card className="mx-auto w-fit mb-4 md:mb-16 rounded-xl md:rounded-3xl md:w-[1000px] shadow-md p-1 md:p-2 md:pb-4">
        <div className="w-full">
          <div className="flex justify-end">
            {/* Left day labels (Mon/Wed/Fri) */}
            <div className="opacity-50 flex flex-col mt-3 md:mt-6 pr-1">
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-right">Mon</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-right">Wed</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-right">Fri</div>
            </div>
            <div className="flex-1">
              {/* Month labels row */}
              <div className="opacity-50 flex text-[5px] sm:text-[7px] md:text-xs text-muted-foreground pb-[2px] md:pb-2 justify-center mx-auto">
                {monthLabels.map((month, index) => (
                  <div key={month.key} className={`${index === 0 ? "mr-auto pl-1" : "flex-1 text-center"}`}>
                    {month.label}
                  </div>
                ))}
              </div>
              {/* Main contribution grid */}
              <div className="flex gap-[1px] justify-start pl-0">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px]">
                    {week.map((day, dayIndex) => (
                      <GridCell key={day || `empty-${weekIndex}-${dayIndex}`} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Right day labels (Mon/Wed/Fri) */}
            <div className="opacity-50 flex flex-col mt-3 md:mt-6 pl-1">
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-left">Mon</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-left">Wed</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-muted-foreground text-[5px] sm:text-[7px] md:text-xs text-left">Fri</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
