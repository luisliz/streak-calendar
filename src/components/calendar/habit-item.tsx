import { Id } from "@server/convex/_generated/dataModel";

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
    completedAt: number; // Timestamp when habit was completed
  }>;
  onToggle: (habitId: Id<"habits">, date: string) => void; // Callback when a day is toggled
}

export const HabitItem = ({ habit, color, days, completions, onToggle }: HabitItemProps) => {
  return (
    // Scrollable container for the grid
    <div className="flex-1 overflow-x-auto">
      {/* Grid of day buttons with rounded border */}
      <div className="inline-flex gap-px bg-background border rounded-md p-1">
        {days.map((date) => {
          // Convert date string to timestamp for comparison
          const timestamp = new Date(date).getTime();
          // Check if habit was completed on this date
          const isCompleted = completions.some(
            (completion) => completion.habitId === habit._id && completion.completedAt === timestamp
          );
          // Format date for tooltip display
          const formattedDate = new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          return (
            <button
              key={date}
              onClick={() => onToggle(habit._id, date)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm transition-colors hover:opacity-80 ${
                isCompleted ? color : "bg-gray-200"
              }`}
              title={`${formattedDate}: ${isCompleted ? "Completed" : "Not completed"}`}
            />
          );
        })}
      </div>
    </div>
  );
};
