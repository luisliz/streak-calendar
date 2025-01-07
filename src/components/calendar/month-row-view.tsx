import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { getCompletionCount } from "@/utils/completion-utils";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Id } from "@server/convex/_generated/dataModel";

import { DayCell } from "./day-cell";

interface MonthRowViewProps {
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  color: string;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  onEditHabit: (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => void;
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  }>;
  onAddHabit: () => void;
}

export function MonthRowView({
  color,
  days,
  completions,
  onToggle,
  onEditHabit,
  habits,
  onAddHabit,
}: MonthRowViewProps) {
  const locale = useLocale();
  const t = useTranslations("calendar");
  const isRTL = ["he", "ar"].includes(locale);

  return (
    <div className="relative">
      {/* Calendar Header with Day Labels */}
      <div className="relative flex">
        {/* Left/Right spacing for gradient effect */}
        <div className={`${isRTL ? "order-first" : "order-first"} w-16 bg-card md:w-32`} />
        {/* Gradient fade effect - direction aware */}
        <div
          className={`absolute z-10 h-6 w-12 ${
            isRTL
              ? "right-16 bg-gradient-to-l from-card to-transparent md:right-32"
              : "left-16 bg-gradient-to-r from-card to-transparent md:left-32"
          }`}
        />
        {/* Day name labels (Mo, Tu, We, etc.) */}
        <div className="flex flex-1 gap-px overflow-hidden">
          <div className={`flex w-full justify-end gap-px ${isRTL ? "pl-28" : "pr-28"}`}>
            {days.map((day) => {
              const date = new Date(day);
              const dayOfWeek = format(date, "eee").toLowerCase();
              const isSaturday = date.getDay() === 6;

              return (
                <div key={day} className="w-6">
                  <div
                    className={`relative h-6 w-6 ${
                      isSaturday ? `${isRTL ? "border-l-2" : "border-r-2"} border-dotted border-primary/20` : ""
                    }`}
                  >
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
            <div key={habit._id} className="relative flex justify-end">
              {/* Calendar view grid for the habit */}
              <div className="flex-1">
                <div className="flex justify-end">
                  <div className={`flex gap-px ${isRTL ? "pl-28" : "pr-28"}`}>
                    {days.map((date) => (
                      <DayCell
                        key={date}
                        habitId={habit._id}
                        date={date}
                        count={getCompletionCount(date, habit._id, completions)}
                        onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
                        colorClass={color}
                        gridView={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Editable habit name with hover effects - direction aware */}
              <div
                className={`group absolute flex w-24 cursor-pointer items-start transition-colors hover:text-muted-foreground md:w-48 ${
                  isRTL ? "right-0" : "left-0"
                }`}
                onClick={() => onEditHabit(habit)}
              >
                {/* Container for habit name with relative positioning for edit icon */}
                <div className="relative flex items-center">
                  {/* Habit name display with background matching card color */}
                  <h3 className="bg-card text-base font-medium">
                    {/* Truncate long habit names to prevent overflow */}
                    <span className="truncate">{habit.name}</span>
                    {/* Optional timer duration display */}
                    {/* Shows duration in minutes with RTL-aware spacing */}
                    {habit.timerDuration && (
                      <span className={`${isRTL ? "mx-1" : "ml-1"} text-sm text-muted-foreground/50`}>
                        ({habit.timerDuration}m)
                      </span>
                    )}
                  </h3>
                  {/* Gradient fade effect on the habit name */}
                  <div
                    className={`h-6 w-12 ${isRTL ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-card to-transparent`}
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
      {/* TODO: 2025-01-03 - this is insane browsers work in mysterious ways */}
      <div className={`mt-px flex ${isRTL ? "justify-end" : "justify-end"}`}>
        <Button className="h-[24px] w-24 text-xs" size="sm" onClick={onAddHabit}>
          {t("controls.new")}
        </Button>
      </div>
    </div>
  );
}
