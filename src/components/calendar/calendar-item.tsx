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
      <div className="flex justify-between items-center pb-8">
        {/* Editable calendar name with hover effect */}
        <div
          className="flex w-full justify-center items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={onEditCalendar}
        >
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Main Calendar Content */}
      {habits.length === 0 ? (
        // Empty state when no habits exist
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground pb-8">No habits added yet. Add one to start tracking!</p>
          <Button size="sm" onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4" />
            Add Habit
          </Button>
        </div>
      ) : view === "monthRow" ? (
        // Horizontal Month Row Layout
        <div className="">
          {/* Calendar Header with Day Labels */}
          <div className="flex relative">
            {/* Left spacing for habit names */}
            <div className="w-16 md:w-32 bg-card" />
            {/* Gradient fade effect for overflow */}
            <div className="ml-16 md:ml-32 w-12 h-6 bg-gradient-to-r from-card to-transparent absolute z-10" />
            {/* Day name labels (Mo, Tu, We, etc.) */}
            <div className="flex-1 flex gap-px overflow-hidden mr-2">
              <div className="flex gap-px justify-end w-full">
                {days.map((day) => (
                  <div key={day} className="w-6">
                    <div className="w-6 h-6 relative">
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-900 dark:text-slate-100 scale-75">
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
                <div key={habit._id} className="flex items-start relative">
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
                    className="absolute left-0 flex group items-start cursor-pointer hover:text-muted-foreground transition-colors w-24 md:w-48"
                    onClick={() => onEditHabit(habit)}
                  >
                    <div className="truncate flex items-center relative">
                      <h3 className="font-medium text-base bg-card">
                        <span className="truncate">{habit.name}</span>
                        {habit.timerDuration && (
                          <span className="text-muted-foreground/50 text-sm ml-1">({habit.timerDuration}m)</span>
                        )}
                      </h3>

                      <div className="w-12 h-6 bg-gradient-to-r from-card to-transparent" />
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-6 top-1/2 -translate-y-1/2">
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
            <Button className="w-24 h-[24px] text-xs" size="sm" onClick={onAddHabit}>
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
                  className="flex justify-center items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
                  onClick={() => onEditHabit(habit)}
                >
                  <h3 className="font-medium text-base">
                    {habit.name}
                    {habit.timerDuration && (
                      <span className="text-muted-foreground text-sm ml-1">({habit.timerDuration}m)</span>
                    )}
                  </h3>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-4 w-4" />
                  </span>
                </div>
                {/* Centered completion controls */}
                <div className="flex justify-center -translate-x-3 -translate-y-3 scale-125">
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
