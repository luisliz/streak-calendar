/**
 * CalendarView Component
 * Renders a calendar visualization for habit tracking in either a row or grid layout.
 * Supports displaying completion status and handling completion toggles.
 */
import { format } from "date-fns";

import { Id } from "@server/convex/_generated/dataModel";

import { CompletionMenu } from "./completion-menu";

/**
 * Props interface for the CalendarView component
 * @property habit - Object containing habit ID and name
 * @property color - CSS color class for styling completions
 * @property days - Array of date strings to display
 * @property completions - Array of habit completion records
 * @property onToggle - Callback function for handling completion changes
 * @property view - Layout type: "monthRow" for horizontal view or "monthGrid" for calendar grid
 */
interface CalendarViewProps {
  habit: {
    _id: Id<"habits">;
    name: string;
  };
  color: string;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  view: "monthRow" | "monthGrid";
}

export const CalendarView = ({ habit, color, days, completions, onToggle, view }: CalendarViewProps) => {
  /**
   * Calculates the number of times a habit was completed on a specific date
   * @param date - The date string to check completions for
   * @returns The count of completions for the given date
   */
  const getCompletionCount = (date: string) => {
    const timestamp = new Date(date).getTime();
    return completions.filter((completion) => completion.habitId === habit._id && completion.completedAt === timestamp)
      .length;
  };

  // Render horizontal row view
  if (view === "monthRow") {
    return (
      <div data-habit-id={habit._id} className="overflow-x-auto bg-red-300 items-center justify-center">
        <div className="inline-flex gap-px bg-card">
          {days.map((date) => (
            <CompletionMenu
              key={date}
              habitId={habit._id}
              date={date}
              count={getCompletionCount(date)}
              onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
              colorClass={color}
              gridView={false}
            />
          ))}
        </div>
      </div>
    );
  }

  // Render calendar grid view
  if (view === "monthGrid") {
    // Find the most recent date and generate 3 months back
    const mostRecentDate = new Date(Math.max(...days.map((d) => new Date(d).getTime())));
    const months: Record<string, string[]> = {};

    // Generate 3 months of dates
    for (let i = 0; i < 3; i++) {
      const currentDate = new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - i, 1);
      const monthKey = format(currentDate, "yyyy-MM");
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

      months[monthKey] = Array.from({ length: daysInMonth }, (_, j) => {
        const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), j + 1);
        return format(day, "yyyy-MM-dd");
      });
    }

    // Sort months in ascending order
    const sortedMonths = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));

    return (
      <div data-habit-id={habit._id} className="w-full space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
        {sortedMonths.map(([monthKey, monthDays]) => {
          const firstDay = new Date(monthDays[0]);
          const lastDay = new Date(monthDays[monthDays.length - 1]);
          const startPadding = firstDay.getDay();
          const endPadding = 6 - lastDay.getDay();
          const emptyStartDays = Array(startPadding).fill(null);
          const emptyEndDays = Array(endPadding).fill(null);
          const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

          return (
            <div key={monthKey} className="w-full max-w-[350px] mx-auto space-y-4">
              <h3 className="font-medium">{format(firstDay, "MMMM yyyy")}</h3>
              <div className="grid grid-cols-7 gap-4">
                {dayLabels.map((label) => (
                  <div key={label} className="text-center text-sm text-muted-foreground">
                    {label}
                  </div>
                ))}
                {emptyStartDays.map((_, index) => (
                  <div key={`empty-start-${index}`} className="h-9 w-9" />
                ))}
                {monthDays.map((dateStr) => {
                  const count = getCompletionCount(dateStr);

                  return (
                    <CompletionMenu
                      key={dateStr}
                      habitId={habit._id}
                      date={dateStr}
                      count={count}
                      onCountChange={(newCount) => onToggle(habit._id, dateStr, newCount)}
                      colorClass={color}
                      gridView={true}
                    />
                  );
                })}
                {emptyEndDays.map((_, index) => (
                  <div key={`empty-end-${index}`} className="h-9 w-9" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};
