/**
 * CalendarView Component
 *
 * A flexible calendar visualization component that supports two display modes:
 * 1. Month Row: A horizontal strip showing consecutive days
 * 2. Month Grid: A traditional calendar grid layout showing 3 months
 *
 * The component handles:
 * - Completion tracking for habits
 * - Date range visualization
 * - Responsive layout switching
 * - Completion count calculation
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
  color: string; // Base color theme for completion visualization
  days: string[]; // Array of ISO date strings to display
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number; // Unix timestamp of completion
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  view: "monthRow" | "monthGrid"; // Display mode selection
}

export const CalendarView = ({ habit, color, days, completions, onToggle, view }: CalendarViewProps) => {
  /**
   * Calculates the number of completions for a specific date
   * Considers the full day range (00:00:00 to 23:59:59)
   *
   * @param date - ISO date string to check
   * @returns Number of completions on that date
   */
  const getCompletionCount = (date: string) => {
    // Set up time range for the entire day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const dayStartTime = dayStart.getTime();
    const dayEndTime = dayEnd.getTime();

    // Count completions that match the habit and fall within the day
    return completions.filter(
      (completion) =>
        completion.habitId === habit._id &&
        completion.completedAt >= dayStartTime &&
        completion.completedAt <= dayEndTime
    ).length;
  };

  // Render horizontal row view - simple consecutive day display
  if (view === "monthRow") {
    return (
      <div data-habit-id={habit._id} className="overflow-x-auto flex">
        <div className="inline-flex gap-px bg-card h-[25px]">
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

  // Render calendar grid view - traditional month calendar layout
  if (view === "monthGrid") {
    // Find the most recent date and generate 3 months back
    const mostRecentDate = new Date(Math.max(...days.map((d) => new Date(d).getTime())));
    const months: Record<string, string[]> = {};

    // Generate dates for 3 months, working backwards from most recent
    for (let i = 0; i < 3; i++) {
      const currentDate = new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - i, 1);
      const monthKey = format(currentDate, "yyyy-MM");
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

      // Create array of ISO date strings for each day in the month
      months[monthKey] = Array.from({ length: daysInMonth }, (_, j) => {
        const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), j + 1);
        return format(day, "yyyy-MM-dd");
      });
    }

    // Sort months chronologically
    const sortedMonths = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));

    return (
      <div data-habit-id={habit._id} className="w-full space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
        {sortedMonths.map(([monthKey, monthDays]) => {
          // Calculate padding for proper day alignment
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
              <div className="grid grid-cols-7 gap-px">
                {/* Day of week labels */}
                {dayLabels.map((label) => (
                  <div key={label} className="text-center text-sm text-muted-foreground">
                    {label}
                  </div>
                ))}
                {/* Empty cells for start of month alignment */}
                {emptyStartDays.map((_, index) => (
                  <div key={`empty-start-${index}`} className="h-9 w-9" />
                ))}
                {/* Calendar days with completion tracking */}
                {monthDays.map((dateStr) => {
                  const isInRange = days.includes(dateStr);
                  const count = isInRange ? getCompletionCount(dateStr) : 0;

                  return (
                    <CompletionMenu
                      key={dateStr}
                      habitId={habit._id}
                      date={dateStr}
                      count={count}
                      onCountChange={(newCount) => onToggle(habit._id, dateStr, newCount)}
                      colorClass={color}
                      gridView={true}
                      disabled={!isInRange}
                    />
                  );
                })}
                {/* Empty cells for end of month alignment */}
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
