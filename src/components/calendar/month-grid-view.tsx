import { useMobile } from "@/hooks/use-mobile";
import { getCompletionCount } from "@/utils/completion-utils";
import { format } from "date-fns";
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
}

export function MonthGridView({ habit, color, days, completions, onToggle }: MonthGridViewProps) {
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
