import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

import { HabitItem } from "./habit-item";

/**
 * CalendarItem represents a single calendar view with its habits and their completion tracking.
 * It displays a calendar's name, color theme, and a list of habits with their yearly progress.
 */

interface CalendarItemProps {
  calendar: {
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  };
  habits: Array<{
    _id: Id<"habits">;
    name: string;
  }>;
  days: string[]; // Array of dates to display in the yearly overview
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onAddHabit: () => void; // Callback when user wants to add a new habit
  onEditCalendar: () => void; // Callback when user wants to edit calendar settings
  onEditHabit: (habit: { _id: Id<"habits">; name: string }) => void; // Callback when user wants to edit a habit
  onToggleHabit: (habitId: Id<"habits">, date: string, count: number) => void; // Callback when user toggles habit completion
  view: "monthRow" | "monthGrid";
}

export const CalendarItem = ({
  calendar,
  habits,
  days,
  completions,
  onAddHabit,
  onEditCalendar,
  onEditHabit,
  onToggleHabit,
  view,
}: CalendarItemProps) => {
  // Ensure the color theme has the correct format
  const colorTheme = calendar.colorTheme.startsWith("bg-") ? calendar.colorTheme : `bg-${calendar.colorTheme}-500`;

  return (
    // TODO: 2024-12-23 - remove empty div
    <div className="">
      {/* Header section with calendar name and add habit button */}
      <div className="flex justify-between items-center mb-6">
        {/* Calendar title with hover-reveal edit button */}
        <div
          className="flex items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={onEditCalendar}
        >
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
        {/* Add habit button */}
        <Button size="sm" variant="link" onClick={onAddHabit}>
          <PlusCircle className="h-4 w-4 fill-red-500" />
        </Button>
      </div>

      {/* Conditional rendering based on habits existence */}
      {habits.length === 0 ? (
        // Empty state message when no habits exist
        <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
      ) : (
        // List of habits with their yearly overviews
        // TODO: 2024-12-23 - remove empty div
        <div className="">
          {habits.map((habit) => (
            <div key={habit._id} className="flex items-start gap-4">
              {/* Habit name with hover-reveal edit button */}
              <div
                className="flex w-48 group items-start cursor-pointer hover:text-muted-foreground transition-colors"
                onClick={() => onEditHabit(habit)}
              >
                <h3 className="font-medium text-base truncate">{habit.name}</h3>
                <span className="mx-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-4 w-4" />
                </span>
              </div>
              {/* Yearly overview grid showing habit completion status */}
              <HabitItem
                habit={habit}
                color={colorTheme}
                days={days}
                completions={completions}
                onToggle={onToggleHabit}
                view={view}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
