import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { useMobile } from "@/hooks/use-mobile";
import { getCompletionCount } from "@/utils/completion-utils";
import { format } from "date-fns";
import { Pencil, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Id } from "@server/convex/_generated/dataModel";

import { DayCell } from "./day-cell";

interface MonthGridViewProps {
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

export function MonthGridView({
  color,
  days,
  completions,
  onToggle,
  onEditHabit,
  habits,
  onAddHabit,
}: MonthGridViewProps) {
  const t = useTranslations("calendar");

  return (
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
                onIncrement={() => onToggle(habit._id, today, todayCount + 1)}
                onDecrement={() => onToggle(habit._id, today, todayCount - 1)}
                variant="default"
                timerDuration={habit.timerDuration}
                habitName={habit.name}
              />
            </div>
            {/* Calendar grid view */}
            <MonthGridCalendar habit={habit} color={color} days={days} completions={completions} onToggle={onToggle} />
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
  );
}

interface MonthGridCalendarProps {
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
}

function MonthGridCalendar({ habit, color, days, completions, onToggle }: MonthGridCalendarProps) {
  const isMobile = useMobile();
  const t = useTranslations("calendar");

  // Find the most recent date and generate months
  const mostRecentDate = new Date(Math.max(...days.map((d) => new Date(d).getTime())));
  const months: Record<string, string[]> = {};
  const monthsToShow = isMobile ? 1 : 3;

  for (let i = 0; i < monthsToShow; i++) {
    const currentDate = new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - i, 1);
    const monthKey = format(currentDate, "yyyy-MM");
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    months[monthKey] = Array.from({ length: daysInMonth }, (_, j) => {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), j + 1);
      return format(day, "yyyy-MM-dd");
    });
  }

  const sortedMonths = Object.entries(months).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div
      data-habit-id={habit._id}
      className="w-full space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-3"
    >
      {sortedMonths.map(([monthKey, monthDays]) => {
        const firstDay = new Date(monthDays[0]);
        const lastDay = new Date(monthDays[monthDays.length - 1]);
        const startPadding = firstDay.getDay();
        const endPadding = 6 - lastDay.getDay();
        const emptyStartDays = Array(startPadding).fill(null);
        const emptyEndDays = Array(endPadding).fill(null);
        const dayLabels = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => t("weekDays." + d));

        const monthName = t(`monthNames.${format(firstDay, "MMMM").toLowerCase()}`);
        const year = format(firstDay, "yyyy");

        return (
          <div key={monthKey} className="mx-auto w-fit space-y-4">
            <h3 className="font-medium">{`${monthName} ${year}`}</h3>
            <div className="grid grid-cols-7 gap-[1px]">
              {dayLabels.map((label) => (
                <div key={label} className="text-center text-sm text-muted-foreground">
                  {label}
                </div>
              ))}
              {emptyStartDays.map((_, index) => (
                <div key={`empty-start-${index}`} className="h-[48px] w-[48px] p-0">
                  <div className="h-full w-full" />
                </div>
              ))}
              {monthDays.map((dateStr) => {
                const isInRange = days.includes(dateStr);
                const count = isInRange ? getCompletionCount(dateStr, habit._id, completions) : 0;

                return (
                  <div key={dateStr} className="h-[48px] w-[48px] p-0">
                    <div className="h-full w-full">
                      <DayCell
                        habitId={habit._id}
                        date={dateStr}
                        count={count}
                        onCountChange={(newCount) => onToggle(habit._id, dateStr, newCount)}
                        colorClass={color}
                        gridView={true}
                        disabled={!isInRange}
                      />
                    </div>
                  </div>
                );
              })}
              {emptyEndDays.map((_, index) => (
                <div key={`empty-end-${index}`} className="h-[48px] w-[48px] p-0">
                  <div className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
