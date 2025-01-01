import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { Pencil, PlusCircle } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

import { CalendarView } from "./calendar-views";

/**
 * CalendarItem Component
 *
 * A comprehensive calendar view component that displays habits and their completion tracking.
 * Supports two view modes: monthRow (horizontal) and monthGrid (vertical grid layout).
 *
 * Features:
 * - Calendar header with editable name
 * - Habit list with completion status
 * - Daily tracking controls
 * - Support for timer-based habits
 * - Interactive controls for adding/editing habits and calendars
 */

/**
 * Props interface for the CalendarItem component
 * @property calendar - Calendar metadata including ID, name, and color theme
 * @property habits - Array of habit objects with names and optional timer durations
 * @property days - Array of date strings to display in the calendar
 * @property completions - Array of habit completion records
 * @property onAddHabit - Callback for adding a new habit
 * @property onEditCalendar - Callback for editing calendar settings
 * @property onEditHabit - Callback for editing an existing habit
 * @property onToggleHabit - Callback for toggling habit completion status
 * @property view - Display mode: "monthRow" or "monthGrid"
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
    timerDuration?: number;
  }>;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onAddHabit: () => void;
  onEditCalendar: () => void;
  onEditHabit: (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => void;
  onToggleHabit: (habitId: Id<"habits">, date: string, count: number) => void;
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
  // Normalize color theme format by ensuring it has the 'bg-' prefix
  const colorTheme = calendar.colorTheme.startsWith("bg-") ? calendar.colorTheme : `bg-${calendar.colorTheme}-500`;

  return (
    <div className="">
      {/* Calendar Header Section */}
      <div className="flex items-center justify-between pb-8">
        {/* Editable calendar name with hover effect */}
        <div
          className="group flex w-full cursor-pointer items-center justify-center gap-2 transition-colors hover:text-muted-foreground"
          onClick={onEditCalendar}
        >
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Main Calendar Content */}
      {habits.length === 0 ? (
        // Empty state when no habits exist
        <div className="flex w-full flex-col items-center justify-center">
          <p className="pb-8 text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
          <Button size="sm" onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4" />
            Add Habit
          </Button>
        </div>
      ) : view === "monthRow" ? (
        // Horizontal Month Row Layout
        <div className="">
          {/* Calendar Header with Day Labels */}
          <div className="relative flex">
            {/* Left spacing for habit names */}
            <div className="w-16 bg-card md:w-32" />
            {/* Gradient fade effect for overflow */}
            <div className="absolute z-10 ml-16 h-6 w-12 bg-gradient-to-r from-card to-transparent md:ml-32" />
            {/* Day name labels (Mo, Tu, We, etc.) */}
            <div className="mr-2 flex flex-1 gap-px overflow-hidden">
              <div className="flex w-full justify-end gap-px">
                {days.map((day) => (
                  <div key={day} className="w-6">
                    <div className="relative h-6 w-6">
                      <span className="absolute inset-0 flex scale-75 items-center justify-center text-xs font-medium text-slate-900 dark:text-slate-100">
                        {new Date(day).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* TODO: 2024-12-31 - Add a habit here maybe? */}
            <div className="w-24" />
          </div>

          {/* Habit Rows Section */}
          <div className="overflow-hidden">
            {habits.map((habit) => {
              // Calculate today's completion count for the habit
              const today = new Date().toISOString().split("T")[0];
              const todayCount = completions.filter(
                (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
              ).length;

              return (
                <div key={habit._id} className="relative flex items-start">
                  {/* Calendar view grid for the habit */}
                  <CalendarView
                    habit={habit}
                    color={colorTheme}
                    days={days}
                    completions={completions}
                    onToggle={onToggleHabit}
                    view={view}
                  />
                  {/* Editable habit name with hover effects */}
                  <div
                    className="group absolute left-0 flex w-24 cursor-pointer items-start transition-colors hover:text-muted-foreground md:w-48"
                    onClick={() => onEditHabit(habit)}
                  >
                    <div className="relative flex items-center truncate">
                      <h3 className="bg-card text-base font-medium">
                        <span className="truncate">{habit.name}</span>
                        {habit.timerDuration && (
                          <span className="ml-1 text-sm text-muted-foreground/50">({habit.timerDuration}m)</span>
                        )}
                      </h3>

                      <div className="h-6 w-12 bg-gradient-to-r from-card to-transparent" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Pencil className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  {/* Habit completion controls for today */}
                  <CompleteControls
                    count={todayCount}
                    onIncrement={() => onToggleHabit(habit._id, today, todayCount + 1)}
                    onDecrement={() => onToggleHabit(habit._id, today, todayCount - 1)}
                    variant="default"
                    timerDuration={habit.timerDuration}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button className="h-[24px] w-24 text-xs" size="sm" onClick={onAddHabit}>
              New
            </Button>
          </div>
        </div>
      ) : (
        // Vertical Month Grid Layout
        <div className="space-y-4">
          {habits.map((habit) => {
            // Calculate today's completion count for the habit
            const today = new Date().toISOString().split("T")[0];
            const todayCount = completions.filter(
              (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
            ).length;

            return (
              <div key={habit._id} className="space-y-4">
                {/* Editable habit name */}
                <div
                  className="group flex cursor-pointer items-center justify-center gap-2 transition-colors hover:text-muted-foreground"
                  onClick={() => onEditHabit(habit)}
                >
                  <h3 className="text-base font-medium">
                    {habit.name}
                    {habit.timerDuration && (
                      <span className="ml-1 text-sm text-muted-foreground">({habit.timerDuration}m)</span>
                    )}
                  </h3>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">
                    <Pencil className="h-4 w-4" />
                  </span>
                </div>
                {/* Centered completion controls */}
                <div className="flex -translate-x-3 -translate-y-3 scale-125 justify-center">
                  <CompleteControls
                    count={todayCount}
                    onIncrement={() => onToggleHabit(habit._id, today, todayCount + 1)}
                    onDecrement={() => onToggleHabit(habit._id, today, todayCount - 1)}
                    variant="default"
                    timerDuration={habit.timerDuration}
                  />
                </div>
                {/* Calendar grid view */}
                <CalendarView
                  habit={habit}
                  color={colorTheme}
                  days={days}
                  completions={completions}
                  onToggle={onToggleHabit}
                  view={view}
                />
              </div>
            );
          })}
          <div className="flex justify-center pb-8">
            <Button variant="outline" size="sm" onClick={onAddHabit}>
              <PlusCircle className="h-4 w-4" />
              Add Habit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
