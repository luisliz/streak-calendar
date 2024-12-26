import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import { Minus, Pencil, Plus, PlusCircle } from "lucide-react";

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
    <div className="">
      {/* Header section with calendar name and add habit button */}
      <div className="flex justify-between items-center mb-6">
        <div
          className="flex items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
          onClick={onEditCalendar}
        >
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
        <Button size="sm" variant="link" onClick={onAddHabit}>
          <PlusCircle className="h-4 w-4 fill-red-500" />
        </Button>
      </div>

      {/* Conditional rendering based on habits existence */}
      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
      ) : view === "monthRow" ? (
        // Month Row View - habits on the left
        <div className="overflow-hidden">
          {habits.map((habit) => (
            <div key={habit._id} className="flex items-start gap-4">
              <div
                className="flex min-w-24 md:min-w-48 w-32 md:w-48 group items-start cursor-pointer hover:text-muted-foreground transition-colors overflow-hidden"
                onClick={() => onEditHabit(habit)}
              >
                <div className="truncate flex items-center gap-2">
                  <h3 className="font-medium text-base">{habit.name}</h3>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-4 w-4" />
                  </span>
                </div>
              </div>
              <HabitItem
                habit={habit}
                color={colorTheme}
                days={days}
                completions={completions}
                onToggle={onToggleHabit}
                view={view}
              />
              {(() => {
                const today = new Date().toISOString().split("T")[0];
                const todayCount = completions.filter(
                  (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
                ).length;

                return todayCount === 0 ? (
                  <ConfettiButton
                    variant="default"
                    size="sm"
                    className="h-6 w-20 ml-auto"
                    onClick={() => onToggleHabit(habit._id, today, 1)}
                    options={{
                      get angle() {
                        return Math.random() * 90 + 45;
                      },
                      particleCount: 50,
                      spread: 70,
                      startVelocity: 30,
                      gravity: 0.5,
                      ticks: 300,
                      colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
                      scalar: 1.2,
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </ConfettiButton>
                ) : (
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onToggleHabit(habit._id, today, todayCount - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{todayCount}</span>
                    <ConfettiButton
                      variant="default"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onToggleHabit(habit._id, today, todayCount + 1)}
                      options={{
                        get angle() {
                          return Math.random() * 90 + 45;
                        },
                        particleCount: 25,
                        spread: 45,
                        startVelocity: 25,
                        gravity: 0.5,
                        ticks: 200,
                        colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
                        scalar: 1.2,
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </ConfettiButton>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      ) : (
        // Month Grid View - habits above calendars
        <div className="space-y-8">
          {habits.map((habit) => (
            <div key={habit._id} className="space-y-4">
              <div
                className="flex items-center gap-2 group cursor-pointer hover:text-muted-foreground transition-colors"
                onClick={() => onEditHabit(habit)}
              >
                <h3 className="font-medium text-base">{habit.name}</h3>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-4 w-4" />
                </span>
              </div>
              <HabitItem
                habit={habit}
                color={colorTheme}
                days={days}
                completions={completions}
                onToggle={onToggleHabit}
                view={view}
              />
              {(() => {
                const today = new Date().toISOString().split("T")[0];
                const todayCount = completions.filter(
                  (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
                ).length;

                return todayCount === 0 ? (
                  <ConfettiButton
                    variant="default"
                    size="sm"
                    className="h-6 ml-auto"
                    onClick={() => onToggleHabit(habit._id, today, 1)}
                    options={{
                      get angle() {
                        return Math.random() * 90 + 45;
                      },
                      particleCount: 100,
                      spread: 70,
                      startVelocity: 30,
                      gravity: 0.5,
                      ticks: 300,
                      colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
                      scalar: 1.2,
                    }}
                  >
                    Complete
                  </ConfettiButton>
                ) : (
                  <div className="flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onToggleHabit(habit._id, today, todayCount - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center font-medium">{todayCount}</span>
                    <ConfettiButton
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onToggleHabit(habit._id, today, todayCount + 1)}
                      options={{
                        get angle() {
                          return Math.random() * 90 + 45;
                        },
                        particleCount: 50,
                        spread: 45,
                        startVelocity: 25,
                        gravity: 0.5,
                        ticks: 200,
                        colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
                        scalar: 1.2,
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </ConfettiButton>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
