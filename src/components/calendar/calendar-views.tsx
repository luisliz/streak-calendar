import { Id } from "@server/convex/_generated/dataModel";

import { CompletionMenu } from "./completion-menu";

interface CalendarViewProps {
  habit: {
    _id: Id<"habits">;
  };
  color: string;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  view: "monthRow" | "monthGrid" | "yearRow";
}

export const CalendarView = ({ habit, color, days, completions, onToggle, view }: CalendarViewProps) => {
  const getCompletionCount = (date: string) => {
    const timestamp = new Date(date).getTime();
    return completions.filter((completion) => completion.habitId === habit._id && completion.completedAt === timestamp)
      .length;
  };

  if (view === "monthRow") {
    return (
      <div data-habit-id={habit._id} className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-px bg-background border rounded-md p-1">
          {days.map((date) => (
            <CompletionMenu
              key={date}
              habitId={habit._id}
              date={date}
              count={getCompletionCount(date)}
              onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
              colorClass={color}
            />
          ))}
        </div>
      </div>
    );
  }

  if (view === "monthGrid") {
    const weeks = [];
    let currentWeek = [];
    const firstDay = new Date(days[0]);
    const startPadding = firstDay.getDay();

    // Add padding for the first week
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push(null);
    }

    // Group days into weeks
    for (const date of days) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add the last partial week if it exists
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return (
      <div data-habit-id={habit._id} className="flex-1">
        <div className="inline-grid grid-cols-7 gap-px bg-background border rounded-md p-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-center text-muted-foreground p-1">
              {day}
            </div>
          ))}
          {weeks.map((week, weekIndex) =>
            week.map((date, dayIndex) => (
              <div key={`${weekIndex}-${dayIndex}`} className="aspect-square">
                {date && (
                  <CompletionMenu
                    habitId={habit._id}
                    date={date}
                    count={getCompletionCount(date)}
                    onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
                    colorClass={color}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (view === "yearRow") {
    const yearStart = new Date(days[0]);
    yearStart.setMonth(0, 1);
    const yearEnd = new Date(days[0]);
    yearEnd.setMonth(11, 31);

    // Generate all days in the year
    const yearDays: string[] = [];
    for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
      yearDays.push(d.toISOString().split("T")[0]);
    }

    // Group days into weeks
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [];
    const firstDay = new Date(yearDays[0]);
    const startPadding = firstDay.getDay();

    // Add padding for the first week
    for (let i = 0; i < startPadding; i++) {
      currentWeek.push(null);
    }

    // Group days into weeks
    for (const date of yearDays) {
      currentWeek.push(date);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add the last partial week if it exists
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Get month labels positions
    interface MonthLabel {
      month: string;
      index: number;
    }
    const monthLabels: MonthLabel[] = [];
    let currentMonth = -1;
    yearDays.forEach((date, index) => {
      const month = new Date(date).getMonth();
      if (month !== currentMonth) {
        monthLabels.push({
          month: new Date(date).toLocaleString("default", { month: "short" }),
          index: Math.floor((index + startPadding) / 7),
        });
        currentMonth = month;
      }
    });

    return (
      <div data-habit-id={habit._id} className="flex-1 overflow-x-auto">
        <div className="relative inline-block">
          {/* Month labels */}
          <div className="flex mb-2 text-xs text-muted-foreground" style={{ marginLeft: "20px" }}>
            {monthLabels.map(({ month, index }) => (
              <div
                key={month}
                className="absolute"
                style={{
                  left: `${index * 13}px`,
                  width: "32px",
                  textAlign: "left",
                }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day of week labels */}
            <div className="flex flex-col gap-[3px] text-xs text-muted-foreground mr-2 pt-6">
              <div>Mon</div>
              <div>Wed</div>
              <div>Fri</div>
            </div>

            {/* Calendar grid */}
            <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px]">
              {weeks[0].map((_, dayIndex) =>
                Array.from({ length: weeks.length }).map((_, weekIndex) => {
                  const date = weeks[weekIndex]?.[dayIndex];
                  return (
                    <div key={`${weekIndex}-${dayIndex}`} className="w-[10px] h-[10px]">
                      {date && (
                        <CompletionMenu
                          habitId={habit._id}
                          date={date}
                          count={getCompletionCount(date)}
                          onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
                          colorClass={color}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
