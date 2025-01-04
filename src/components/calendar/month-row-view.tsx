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

  return (
    <div className="flex justify-end">
      <div className={`flex gap-px ${isRTL ? "pl-[96px]" : "pr-24"}`}>
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
  );
}
