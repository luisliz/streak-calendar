import { Card } from "@/components/ui/card";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { memo, useCallback, useMemo } from "react";

import { Id } from "@server/convex/_generated/dataModel";

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
  // Memoize date calculations that don't need to change
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const yearAgo = subYears(today, 1);
    const days = eachDayOfInterval({ start: yearAgo, end: today }).map((date) => format(date, "yyyy-MM-dd"));

    // Calculate weeks
    const firstDayOfWeek = getDay(yearAgo);
    const emptyStartDays = Array(firstDayOfWeek).fill(null);
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [...emptyStartDays];

    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Get month labels
    const monthLabels = [];
    const firstMonth = new Date(yearAgo);
    firstMonth.setDate(1); // Set to first day of month

    let currentDate = firstMonth;
    while (monthLabels.length <= 12) {
      monthLabels.push({
        key: `${format(currentDate, "MMM yyyy")}-${monthLabels.length}`,
        label: format(currentDate, "MMM"),
      });
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return { weeks, monthLabels };
  }, []); // Empty deps since these only need to calculate once

  // Memoize completion counts to avoid recalculating on every render
  const completionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const dateKey = format(date, "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }, [completions]);

  // Memoize color class function
  const getColorClass = useCallback((count: number) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (count <= 2) return "fill-red-500/50 dark:fill-red-500/50";
    if (count <= 5) return "fill-red-500/65 dark:fill-red-500/65";
    if (count <= 10) return "fill-red-600/80 dark:fill-red-600/80";
    return "fill-red-600 dark:fill-red-600";
  }, []);

  // Extract grid cell to separate component for better performance
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="aspect-square w-[6px] sm:w-[8px] md:w-4" />;

    const count = completionCounts[day] || 0;
    const colorClass = getColorClass(count);

    if (count === 0) {
      return (
        <div
          className={`aspect-square w-[5px] sm:w-[8px] md:w-4 rounded-full ${colorClass}`}
          title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
        />
      );
    }

    return (
      <div
        className="aspect-square w-[5px] sm:w-[8px] md:w-4 relative hover:opacity-80 transition-colors"
        title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
      >
        <svg viewBox="0 0 15 15" className={`w-full h-full ${colorClass}`}>
          <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
        </svg>
      </div>
    );
  });
  GridCell.displayName = "GridCell";

  // Add this near other useMemo calculations
  const totalCompletions = useMemo(() => {
    return Object.values(completionCounts).reduce((sum, count) => sum + count, 0);
  }, [completionCounts]);

  return (
    <div className="mx-auto sm:mt-16 mt-2">
      <div className="mx-auto pl-2 pb-1 max-w-full md:w-[min(1000px,95vw)] text-xs text-muted-foreground">
        <span className="font-bold">Yearly Overview</span>{" "}
        <span className="text-muted-foreground/75">({totalCompletions} things done last year)</span>
      </div>
      <Card className="mx-auto mb-4 md:mb-16 rounded-3xl max-w-full md:w-[min(1000px,95vw)] shadow-md p-1 md:p-2 md:pb-4 overflow-hidden">
        <div className="mx-auto">
          <div className="flex">
            <div className="opacity-50 hidden md:flex w-[30px] flex-col justify-around h-full mt-6">
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-right">Mon</div>
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-right">Wed</div>
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-right">Fri</div>
            </div>
            <div className="flex-1">
              {/* Month labels */}
              <div className="opacity-50 flex justify-between text-[8px] md:text-xs text-muted-foreground mb-2">
                {monthLabels.map((month) => (
                  <div key={month.key}>{month.label}</div>
                ))}
              </div>
              {/* Contribution grid */}
              <div className="flex gap-[1px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px]">
                    {week.map((day, dayIndex) => (
                      <GridCell key={day || `empty-${weekIndex}-${dayIndex}`} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="opacity-50 hidden md:flex w-[30px] flex-col justify-around h-full mt-6">
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-left">Mon</div>
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-left">Wed</div>
              <div className="h-[4px] md:h-[18px]" />
              <div className="text-muted-foreground text-[8px] md:text-xs text-left">Fri</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
