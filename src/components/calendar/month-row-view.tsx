import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { getCompletionCount } from "@/utils/completion-utils";
import { useLocale, useTranslations } from "next-intl";

import { Id } from "@server/convex/_generated/dataModel";

import { DayCell } from "./day-cell";

/**
 * Row view component for displaying habits in a horizontal calendar layout.
 * Shows days in a continuous row with habit completion tracking.
 * Supports RTL languages and includes gradient fade effects for better UX.
 */

/**
 * Props interface for the MonthRowView component
 */
interface MonthRowViewProps {
  /** Primary habit for the calendar */
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  /** Color theme for the calendar */
  color: string;
  /** Array of dates to display */
  days: string[];
  /** Array of habit completion records */
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  /** Callback for toggling habit completion */
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  /** Callback for editing habit properties */
  onEditHabit: (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => void;
  /** Array of all habits in the calendar */
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  }>;
  /** Callback for adding a new habit */
  onAddHabit: () => void;
  loadingCells: Record<string, boolean>;
}

/**
 * Component that renders habits in a horizontal calendar layout
 * Supports RTL languages and includes gradient fade effects
 */
export function MonthRowView({
  color,
  days,
  completions,
  onToggle,
  onEditHabit,
  habits,
  onAddHabit,
  loadingCells,
}: MonthRowViewProps) {
  const t = useTranslations("calendar");
  const isRTL = useLocale() === "ar";

  return (
    <div className="relative">
      {/* Habit Rows Section */}
      <div className="relative space-y-px overflow-hidden">
        {habits.map((habit) => {
          // Calculate today's completion count for the habit
          const today = new Date().toISOString().split("T")[0];
          const todayCount = completions.filter(
            (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
          ).length;

          return (
            <div key={habit._id} className="relative flex h-6 items-center justify-end">
              {/* Calendar view grid for the habit */}
              <div className="flex-1">
                <div className="flex justify-end">
                  <div className={`flex gap-px ${isRTL ? "pl-24 md:pl-28" : "pr-24 md:pr-28"}`}>
                    {days.map((date) => {
                      const cellKey = `${habit._id}-${date}`;
                      return (
                        <DayCell
                          key={date}
                          habitId={habit._id}
                          date={date}
                          count={getCompletionCount(date, habit._id, completions)}
                          onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
                          colorClass={color}
                          size="small"
                          isLoading={loadingCells[cellKey]}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Editable habit name with hover effects - direction aware */}
              <div
                className={`absolute top-0 flex h-full items-center ${
                  isRTL ? "right-0" : "left-0"
                } w-24 cursor-pointer select-none md:w-48`}
                onClick={() => onEditHabit(habit)}
              >
                <div className="flex items-baseline bg-card">
                  <h3 className="text-sm font-medium hover:text-muted-foreground">{habit.name}</h3>
                  {habit.timerDuration && (
                    <span className="ml-1 text-xs text-muted-foreground">({habit.timerDuration}m)</span>
                  )}
                </div>
              </div>
              {/* Habit completion controls for today */}
              <div className={`absolute ${isRTL ? "left-0" : "right-0"}`}>
                <CompleteControls
                  count={todayCount}
                  onIncrement={() => onToggle(habit._id, today, todayCount + 1)}
                  onDecrement={() => onToggle(habit._id, today, todayCount - 1)}
                  variant="default"
                  timerDuration={habit.timerDuration}
                  habitName={habit.name}
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Add habit button */}
      <div className="mt-px flex justify-end">
        <Button variant="ghost" size="sm" onClick={onAddHabit}>
          {t("controls.addHabit")}
        </Button>
      </div>
    </div>
  );
}
