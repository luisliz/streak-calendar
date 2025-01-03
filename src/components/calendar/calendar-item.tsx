import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { format } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

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
  const t = useTranslations("calendar");
  const locale = useLocale();
  const isRTL = locale === "he";
  const colorTheme = calendar.colorTheme.startsWith("bg-") ? calendar.colorTheme : `bg-${calendar.colorTheme}-500`;

  return (
    <div className="">
      {/* Calendar Header Section */}
      <div className="flex justify-center pb-8 pl-6 pt-8">
        {/* Editable calendar name with hover effect */}
        <div
          className="group flex cursor-pointer items-center justify-center gap-2 transition-colors hover:text-muted-foreground"
          onClick={onEditCalendar}
        >
          <h2 className={`text-4xl font-semibold underline decoration-4 ${colorTheme.replace("bg-", "decoration-")}`}>
            {calendar.name}
          </h2>
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Main Calendar Content */}
      {habits.length === 0 ? (
        // Empty state when no habits exist
        <div className="flex w-full flex-col items-center justify-center">
          <p className="pb-8 text-sm text-muted-foreground">{t("emptyState.noHabits")}</p>
          <Button size="sm" onClick={onAddHabit}>
            <PlusCircle className="h-4 w-4" />
            {t("controls.addHabit")}
          </Button>
        </div>
      ) : view === "monthRow" ? (
        <div className="relative">
          {/* Calendar Header with Day Labels */}
          <div className="relative flex">
            {/* Left/Right spacing for habit names based on direction */}
            <div className={`${isRTL ? "order-last" : "order-first"} w-16 bg-card md:w-32`} />
            {/* Gradient fade effect for overflow - direction aware */}
            <div
              className={`absolute z-10 h-6 w-12 ${
                isRTL
                  ? "right-16 bg-gradient-to-l from-card to-transparent md:right-32"
                  : "left-16 bg-gradient-to-r from-card to-transparent md:left-32"
              }`}
            />
            {/* Day name labels (Mo, Tu, We, etc.) */}
            <div className="flex flex-1 gap-px overflow-hidden">
              <div className={`flex w-full justify-end gap-px ${isRTL ? "pl-[96px]" : "pr-24"}`}>
                {days.map((day) => {
                  const dayOfWeek = format(new Date(day), "eee").toLowerCase();
                  return (
                    <div key={day} className="w-6">
                      <div className="relative h-6 w-6">
                        <span className="absolute inset-0 flex scale-75 items-center justify-center text-xs font-medium text-foreground">
                          {t(`weekDaysShort.${dayOfWeek}`)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Habit Rows Section */}
          <div className="relative space-y-px overflow-hidden">
            {habits.map((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const todayCount = completions.filter(
                (c) => c.habitId === habit._id && new Date(c.completedAt).toISOString().split("T")[0] === today
              ).length;

              return (
                <div key={habit._id} className="relative flex items-start">
                  {/* Calendar view grid for the habit */}
                  <div className="flex-1">
                    <CalendarView
                      habit={habit}
                      color={colorTheme}
                      days={days}
                      completions={completions}
                      onToggle={onToggleHabit}
                      view={view}
                    />
                  </div>
                  {/* Editable habit name with hover effects - direction aware */}
                  <div
                    className={`group absolute flex w-24 cursor-pointer items-start transition-colors hover:text-muted-foreground md:w-48 ${
                      isRTL ? "right-0" : "left-0"
                    }`}
                    onClick={() => onEditHabit(habit)}
                  >
                    <div className="relative flex items-center truncate">
                      <h3 className="bg-card text-base font-medium">
                        <span className="truncate">{habit.name}</span>
                        {habit.timerDuration && (
                          <span className={`${isRTL ? "mr-1" : "ml-1"} text-sm text-muted-foreground/50`}>
                            ({habit.timerDuration}m)
                          </span>
                        )}
                      </h3>

                      <div
                        className={`h-6 w-12 ${
                          isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"
                        } from-card to-transparent`}
                      />
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 ${
                          isRTL ? "left-6" : "right-6"
                        }`}
                      >
                        <Pencil className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                  {/* Habit completion controls for today */}
                  <div className={`absolute ${isRTL ? "left-0" : "right-0"}`}>
                    <CompleteControls
                      count={todayCount}
                      onIncrement={() => onToggleHabit(habit._id, today, todayCount + 1)}
                      onDecrement={() => onToggleHabit(habit._id, today, todayCount - 1)}
                      variant="default"
                      timerDuration={habit.timerDuration}
                      habitName={habit.name}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
            <Button className="h-[24px] w-24 text-xs" size="sm" onClick={onAddHabit}>
              {t("controls.new")}
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
              <div key={habit._id} className="">
                {/* Editable habit name */}
                <div className="flex justify-center pt-8">
                  <div
                    className="group inline-flex cursor-pointer items-center gap-2 pl-6 transition-colors hover:text-muted-foreground"
                    onClick={() => onEditHabit(habit)}
                  >
                    <h3 className="text-2xl font-medium">
                      {habit.name}
                      {habit.timerDuration && (
                        <span className="ml-1 text-sm text-muted-foreground">({habit.timerDuration}m)</span>
                      )}
                    </h3>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Pencil className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                {/* Centered completion controls */}
                <div className="flex justify-center pb-4">
                  <CompleteControls
                    count={todayCount}
                    onIncrement={() => onToggleHabit(habit._id, today, todayCount + 1)}
                    onDecrement={() => onToggleHabit(habit._id, today, todayCount - 1)}
                    variant="default"
                    timerDuration={habit.timerDuration}
                    habitName={habit.name}
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
              {t("controls.addHabit")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
