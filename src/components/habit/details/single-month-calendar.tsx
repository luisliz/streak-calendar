"use client";

import { DayCell } from "@/components/calendar/day-cell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Id } from "@server/convex/_generated/dataModel";

interface SingleMonthCalendarProps {
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  color: string;
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  initialDate?: Date;
}

export function SingleMonthCalendar({
  habit,
  color,
  completions,
  onToggle,
  initialDate = new Date(),
}: SingleMonthCalendarProps) {
  const t = useTranslations("calendar");
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [updatingDates, setUpdatingDates] = useState<Set<string>>(new Set());

  const goToPreviousMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const handleToggle = async (habitId: Id<"habits">, date: string, count: number) => {
    setUpdatingDates((prev) => new Set(prev).add(date));
    try {
      await onToggle(habitId, date, count);
    } finally {
      setUpdatingDates((prev) => {
        const next = new Set(prev);
        next.delete(date);
        return next;
      });
    }
  };

  // Get current month's days
  const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    return format(day, "yyyy-MM-dd");
  });

  // Get the date range for completions
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Set to end of today
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  const days = monthDays.filter((d) => {
    const date = new Date(d);
    return date >= start && date <= end;
  });

  // Calculate padding days
  const firstDay = new Date(monthDays[0]);
  const lastDay = new Date(monthDays[monthDays.length - 1]);
  const startPadding = firstDay.getDay();
  const endPadding = 6 - lastDay.getDay();
  const emptyStartDays = Array(startPadding).fill(null);
  const emptyEndDays = Array(endPadding).fill(null);

  // Get localized day and month names
  const dayLabels = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => t(`weekDays.${d}`));
  const monthName = t(`monthNames.${format(firstDay, "MMMM").toLowerCase()}`);
  const year = format(firstDay, "yyyy");

  return (
    // TODO: 2025-01-12 - what does min-w-[300px] even mean?
    <Card className="min-w-[300px] border p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">{`${monthName} ${year}`}</h3>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="mx-auto w-fit">
        <div className="grid grid-cols-7 gap-[1px]">
          {/* Day name labels */}
          {dayLabels.map((label) => (
            <div key={label} className="text-center text-xs text-muted-foreground">
              {label}
            </div>
          ))}
          {/* Empty cells for start padding */}
          {emptyStartDays.map((_, index) => (
            <div key={`empty-start-${index}`} className="h-9 w-9">
              <div className="h-full w-full" />
            </div>
          ))}
          {/* Day cells with completion tracking */}
          {monthDays.map((dateStr) => {
            const isInRange = days.includes(dateStr);
            const count = getCompletionCount(dateStr, habit._id, completions);
            return (
              <div key={dateStr} className="h-9 w-9">
                <DayCell
                  habitId={habit._id}
                  date={dateStr}
                  count={count}
                  onCountChange={async (newCount) => handleToggle(habit._id, dateStr, newCount)}
                  colorClass={color}
                  size="medium"
                  disabled={!isInRange}
                  isUpdating={updatingDates.has(dateStr)}
                />
              </div>
            );
          })}
          {/* Empty cells for end padding */}
          {emptyEndDays.map((_, index) => (
            <div key={`empty-end-${index}`} className="h-9 w-9">
              <div className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function getCompletionCount(
  date: string,
  habitId: Id<"habits">,
  completions: Array<{ habitId: Id<"habits">; completedAt: number }>
): number {
  return completions.filter((completion) => {
    const completionDate = new Date(completion.completedAt).toISOString().split("T")[0];
    return completion.habitId === habitId && completionDate === date;
  }).length;
}
