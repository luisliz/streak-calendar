import { getCompletionCount } from "@/utils/completion-utils";
import { useLocale } from "next-intl";

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
}

export function MonthRowView({ habit, color, days, completions, onToggle }: MonthRowViewProps) {
  const locale = useLocale();
  const isRTL = locale === "he";

  // For RTL, we need to reverse the days array to maintain chronological order
  const orderedDays = isRTL ? [...days].reverse() : days;

  return (
    <div className="flex w-full justify-end overflow-hidden">
      <div className="flex w-full justify-end gap-px">
        {orderedDays.map((date) => (
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
  );
}
