import { Card } from "@/components/ui/card";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

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
    for (let i = 0; i <= 12; i++) {
      const date = new Date(yearAgo);
      date.setMonth(date.getMonth() + i);
      monthLabels.push({
        key: format(date, "MMM yyyy"),
        label: format(date, "MMM"),
      });
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
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
    if (count <= 2) return "fill-red-500/50 dark:fill-red-500/50";
    if (count <= 5) return "fill-red-500/65 dark:fill-red-500/65";
    if (count <= 10) return "fill-red-600/80 dark:fill-red-600/80";
    return "fill-red-600 dark:fill-red-600";
  }, []);

  // Extract grid cell to separate component for better performance
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="aspect-square w-[12px] max-w-full md:w-4" />;

    const count = completionCounts[day] || 0;
    const colorClass = getColorClass(count);

    if (count === 0) {
      return (
        <div
          className={`aspect-square w-[12px] max-w-full md:w-4 border rounded-full ${colorClass}`}
          title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
        />
      );
    }

    return (
      <div
        className="aspect-square w-[12px] max-w-full md:w-4 relative hover:opacity-80 transition-colors"
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
    // TODO: 2024-12-24 - make this responsive
    <div className="max-w-5xl mx-auto">
      <div className="mt-4 ml-1 text-sm text-muted-foreground mb-2">
        <span className="font-bold">Yearly Overview</span>{" "}
        <span className="text-muted-foreground/75">({totalCompletions} things done last year)</span>
      </div>
      <Card className="mb-16 rounded-3xl shadow-md p-2 md:p-4 overflow-hidden">
        <div ref={scrollRef} className="overflow-x-hidden -mr-2 md:-mr-4 pr-8 md:pr-12">
          <div className="flex flex-col">
            {/* Month labels */}
            <div className="flex mb-1 md:mb-2">
              <div className="pl-12 gap-[38px] md:gap-12 flex justify-between text-[8px] md:text-xs text-muted-foreground">
                {monthLabels.map((month) => (
                  <div key={month.key}>{month.label}</div>
                ))}
              </div>
            </div>

            {/* Day labels and contribution grid */}
            <div className="flex ">
              {/* Day labels */}
              <div className="flex flex-col gap-px mr-2">
                <div className="h-4" /> {/* Empty space for alignment */}
                <div className="text-muted-foreground text-[8px] md:text-xs">Mon</div>
                <div className="h-4" />
                <div className="text-muted-foreground text-[8px] md:text-xs">Wed</div>
                <div className="h-4" />
                <div className="text-muted-foreground text-[8px] md:text-xs">Fri</div>
              </div>

              {/* Contribution grid */}
              <div className="flex gap-px pr-4 md:pr-8">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px] flex-1">
                    {week.map((day, dayIndex) => (
                      <GridCell key={day || `empty-${weekIndex}-${dayIndex}`} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
