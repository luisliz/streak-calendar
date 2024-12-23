import { eachDayOfInterval, format, getDay, subYears } from "date-fns";

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
  // Get dates for the last year (from today)
  const today = new Date();
  const yearAgo = subYears(today, 1);
  const days = eachDayOfInterval({ start: yearAgo, end: today }).map((date) => format(date, "yyyy-MM-dd"));

  // Calculate the starting day of the week (0-4, where 0 is Sunday)
  const firstDayOfWeek = getDay(yearAgo);
  const emptyStartDays = Array(firstDayOfWeek).fill(null);

  // Group days by week
  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = [...emptyStartDays];

  days.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  // Add the last week if it's not empty
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Calculate total completions for a specific date
  const getCompletionCount = (date: string) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const dayStartTime = dayStart.getTime();
    const dayEndTime = dayEnd.getTime();

    return completions.filter(
      (completion) => completion.completedAt >= dayStartTime && completion.completedAt <= dayEndTime
    ).length;
  };

  // Get month labels for the top of the grid
  const monthLabels = Array.from(new Set(days.map((day) => format(new Date(day), "MMM"))));

  // Function to get color intensity based on completion count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
    if (count <= 2) return "bg-emerald-200 dark:bg-emerald-900";
    if (count <= 5) return "bg-emerald-300 dark:bg-emerald-800";
    if (count <= 10) return "bg-emerald-400 dark:bg-emerald-700";
    return "bg-emerald-500 dark:bg-emerald-600";
  };

  return (
    <div className="w-full mb-12">
      <h2 className="text-2xl font-semibold mb-8">Yearly Overview</h2>
      <div className="w-full overflow-x-auto">
        <div className="inline-flex flex-col min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-4" /> {/* Spacer for day labels */}
            <div className="flex gap-8 text-sm text-muted-foreground">
              {monthLabels.map((month) => (
                <div key={month}>{month}</div>
              ))}
            </div>
          </div>

          {/* Day labels and contribution grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-px mr-2">
              <div className="h-4" /> {/* Empty space for alignment */}
              <div className="text-sm text-muted-foreground h-4">Mon</div>
              <div className="h-4" /> {/* Empty space for alignment */}
              <div className="text-sm text-muted-foreground h-4">Wed</div>
              <div className="h-4" /> {/* Empty space for alignment */}
              <div className="text-sm text-muted-foreground h-4">Fri</div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-px">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-px">
                  {week.map((day, dayIndex) =>
                    day ? (
                      <div
                        key={day}
                        className={`w-4 h-4 rounded-sm transition-colors hover:opacity-80 relative ${getColorClass(
                          getCompletionCount(day)
                        )}`}
                        title={`${format(new Date(day), "MMM d, yyyy")}: ${getCompletionCount(day)} completions`}
                      ></div>
                    ) : (
                      <div key={`empty-${weekIndex}-${dayIndex}`} className="w-4 h-4" />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
