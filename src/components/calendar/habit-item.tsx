import { useEffect } from "react";

import { Id } from "@server/convex/_generated/dataModel";

import { CompletionMenu } from "./completion-menu";

/**
 * HabitItem displays a grid of days showing habit completion status.
 * Each day is represented by a button that can be toggled to mark habit completion.
 */

interface HabitItemProps {
  habit: {
    _id: Id<"habits">;
  };
  color: string; // Tailwind color class for completed days
  days: string[]; // Array of dates to display in the grid
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void; // Callback when a day is toggled
}

export const HabitItem = ({ habit, color, days, completions, onToggle }: HabitItemProps) => {
  useEffect(() => {
    const container = document.querySelector(`[data-habit-id="${habit._id}"]`);
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, [habit._id]);

  return (
    <div data-habit-id={habit._id} className="flex-1 overflow-x-auto">
      {/* Grid of day buttons with rounded border */}
      <div className="inline-flex gap-px bg-background border rounded-md p-1">
        {days.map((date) => {
          // Convert date string to timestamp for comparison
          const timestamp = new Date(date).getTime();
          // Count completions for this date
          const count = completions.filter(
            (completion) => completion.habitId === habit._id && completion.completedAt === timestamp
          ).length;

          return (
            <CompletionMenu
              key={date}
              habitId={habit._id}
              date={date}
              count={count}
              onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
              colorClass={color}
            />
          );
        })}
      </div>
    </div>
  );
};
