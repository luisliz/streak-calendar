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
    if (count <= 2) return "bg-emerald-200 dark:bg-emerald-500";
    if (count <= 5) return "bg-emerald-300 dark:bg-emerald-600";
    if (count <= 10) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-500 dark:bg-emerald-800";
  }, []);

  // Extract grid cell to separate component for better performance
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="w-4 h-4" />;

    const count = completionCounts[day] || 0;
    return (
      <div
        className={`w-4 h-4 rounded-sm transition-colors hover:opacity-80 relative ${getColorClass(count)}`}
        title={`${format(new Date(day), "MMM d, yyyy")}: ${count} completions`}
      />
    );
  });
  GridCell.displayName = "GridCell";

  return (
    <div className="w-full flex justify-center">
      <Card className="mb-8 rounded-xl shadow-md p-2 sm:p-4 inline-block max-w-full">
        <div ref={scrollRef} className="overflow-x-auto px-1 sm:px-2">
          <div className="flex flex-col min-w-[800px]">
            {/* Month labels */}
            <div className="flex mb-2">
              <div className="w-10" /> {/* Spacer for day labels */}
              <div className="flex text-xs sm:text-sm text-muted-foreground">
                {monthLabels.map((month, index) => (
                  <div key={month.key} className={index === 0 ? "mr-8" : "mr-12"}>
                    {month.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Day labels and contribution grid */}
            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col gap-px mr-2">
                <div className="h-4" /> {/* Empty space for alignment */}
                <div className="text-xs sm:text-sm text-muted-foreground h-4">Mon</div>
                <div className="h-4" /> {/* Empty space for alignment */}
                <div className="text-xs sm:text-sm text-muted-foreground h-4">Wed</div>
                <div className="h-4" /> {/* Empty space for alignment */}
                <div className="text-xs sm:text-sm text-muted-foreground h-4">Fri</div>
              </div>

              {/* Contribution grid */}
              <div className="flex gap-px">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-px">
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
