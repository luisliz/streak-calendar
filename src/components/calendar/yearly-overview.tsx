import { Card } from "@/components/ui/card";
import { XLogo } from "@/components/ui/x-logo";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { memo, useCallback, useMemo } from "react";

import { Id } from "@server/convex/_generated/dataModel";

/**
 * YearlyOverview Component
 * Displays a GitHub-style contribution graph showing habit completions over the past year.
 * The graph uses different shades of red to indicate completion intensity per day.
 */

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
          className={`aspect-square w-[5px] rounded-full sm:w-[9px] md:w-4 ${colorClass}`}
          title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
        />
      );
    }

    // Render completion indicator for days with completions
    return (
      <div
        className="relative aspect-square w-[5px] transition-colors hover:opacity-80 sm:w-[9px] md:w-4"
        title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
      >
        <svg viewBox="0 0 15 15" className={`h-full w-full ${colorClass}`}>
          <XLogo />
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
    <div className="mx-auto mt-2 sm:mt-16">
      <div className="mx-auto max-w-full pb-1 pl-2 text-xs text-muted-foreground md:w-[1000px]">
        <span className="font-bold">Yearly Overview</span>{" "}
        <span className="text-muted-foreground/75">({totalCompletions} things done last year)</span>
      </div>
      <Card className="mx-auto mb-4 w-fit rounded-xl p-1 shadow-md md:mb-16 md:w-[1000px] md:rounded-3xl md:p-2 md:pb-4">
        <div className="w-full">
          <div className="flex justify-end">
            {/* Left day labels (Mon/Wed/Fri) */}
            <div className="mt-3 flex flex-col pr-1 opacity-50 md:mt-6">
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Mon</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Wed</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Fri</div>
            </div>
            <div className="flex-1">
              {/* Month labels row */}
              <div className="mx-auto flex justify-center pb-[2px] text-[5px] text-muted-foreground opacity-50 sm:text-[7px] md:pb-2 md:text-xs">
                {monthLabels.map((month, index) => (
                  <div key={month.key} className={`${index === 0 ? "mr-auto pl-1" : "flex-1 text-center"}`}>
                    {month.label}
                  </div>
                ))}
              </div>
              {/* Main contribution grid */}
              <div className="flex justify-start gap-[1px] pl-0">
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
            <div className="mt-3 flex flex-col pl-1 opacity-50 md:mt-6">
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Mon</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Wed</div>
              <div className="h-[3px] md:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground sm:text-[7px] md:text-xs">Fri</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
