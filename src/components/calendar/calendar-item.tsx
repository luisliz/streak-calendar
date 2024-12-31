import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { Pencil, PlusCircle } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

import { CalendarView } from "./calendar-views";

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
  // Ensure the color theme has the correct format
  const colorTheme = calendar.colorTheme.startsWith("bg-") ? calendar.colorTheme : `bg-${calendar.colorTheme}-500`;

  return (
    <div className="">
      {/* Header section with calendar name and add habit button */}
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={onEditCalendar}
        >
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Conditional rendering based on habits existence */}
      {habits.length === 0 ? (
        <div className="w-full">
          <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
          <Button size="sm" onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      ) : view === "monthRow" ? (
        // Month Row View - habits on the left
        <div className="">
          {/* Calendar header */}
          <div className="flex">
            <div className="min-w-24 md:min-w-48 w-32 md:w-48" />
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
            <div className="w-24 hover:bg-red-500/50" />
          </div>

          <div className="overflow-hidden">
            {habits.map((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const todayCount = completions.filter(
                (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
              ).length;

              return (
                <div key={habit._id} className="flex items-start">
                  <div
                    className="flex min-w-24 md:min-w-48 w-32 md:w-48 group items-start cursor-pointer hover:text-muted-foreground transition-colors overflow-hidden"
                    onClick={() => onEditHabit(habit)}
                  >
                    <div className="truncate flex items-center gap-2">
                      <h3 className="font-medium text-base">
                        {habit.name}
                        {habit.timerDuration && (
                          <span className="text-muted-foreground/50 text-sm ml-1">({habit.timerDuration}m)</span>
                        )}
                      </h3>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  <CalendarView
                    habit={habit}
                    color={colorTheme}
                    days={days}
                    completions={completions}
                    onToggle={onToggleHabit}
                    view={view}
                  />
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
        // Month Grid View - habits above calendars
        <div className="space-y-4">
          {habits.map((habit) => {
            const today = new Date().toISOString().split("T")[0];
            const todayCount = completions.filter(
              (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
            ).length;

            return (
              <div key={habit._id} className="space-y-4">
                <div
                  className="flex items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
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
                <CalendarView
                  habit={habit}
                  color={colorTheme}
                  days={days}
                  completions={completions}
                  onToggle={onToggleHabit}
                  view={view}
                />
                <CompleteControls
                  count={todayCount}
                  onIncrement={() => onToggleHabit(habit._id, today, todayCount + 1)}
                  onDecrement={() => onToggleHabit(habit._id, today, todayCount - 1)}
                  variant="ghost"
                  timerDuration={habit.timerDuration}
                />
              </div>
            );
          })}
          <Button size="sm" onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      )}
    </div>
  );
};
