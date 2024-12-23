import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";

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
  return (
    // Main container with rounded borders and padding
    // TODO: 2024-12-23 remove empty div
    <div className="">
      {/* Header section with calendar name and add habit button */}
      <div className="flex justify-between items-center mb-6">
        {/* Calendar title with hover-reveal edit button */}
        <div className="flex items-center gap-2 group">
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEditCalendar}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        {/* Add habit button */}
        <Button variant="default" onClick={onAddHabit}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Conditional rendering based on habits existence */}
      {habits.length === 0 ? (
        // Empty state message when no habits exist
        <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
      ) : (
        // List of habits with their yearly overviews
        // TODO: 2024-12-23 remove empty div
        <div className="">
          {habits.map((habit) => (
            <div key={habit._id} className="flex items-center gap-4">
              {/* Habit name with hover-reveal edit button */}
              <div className="flex items-center gap-2 w-48 group">
                <h3 className="font-medium text-base">{habit.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEditHabit(habit)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              {/* Yearly overview grid showing habit completion status */}
              <HabitItem
                habit={habit}
                color={calendar.colorTheme}
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
