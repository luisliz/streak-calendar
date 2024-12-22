import { format } from "date-fns";

import { Id } from "@server/convex/_generated/dataModel";

import { CompletionMenu } from "./completion-menu";

interface CalendarViewProps {
  habit: {
    _id: Id<"habits">;
    name: string;
  };
  color: string;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  view: "monthRow" | "monthGrid";
}

export const CalendarView = ({ habit, color, days, completions, onToggle, view }: CalendarViewProps) => {
  const getCompletionCount = (date: string) => {
    const timestamp = new Date(date).getTime();
    return completions.filter((completion) => completion.habitId === habit._id && completion.completedAt === timestamp)
      .length;
  };

  if (view === "monthRow") {
    return (
      <div data-habit-id={habit._id} className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-px bg-background rounded-md p-1">
          {days.map((date) => (
            <CompletionMenu
              key={date}
              habitId={habit._id}
              date={date}
              count={getCompletionCount(date)}
              onCountChange={(newCount) => onToggle(habit._id, date, newCount)}
              colorClass={color}
            />
          ))}
        </div>
      </div>
    );
  }

  if (view === "monthGrid") {
    const firstDay = new Date(days[0]);
    const startPadding = firstDay.getDay();
    const emptyDays = Array(startPadding).fill(null);
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div data-habit-id={habit._id} className="mx-auto w-[500px] space-y-2">
        <h3 className="truncate text-sm font-medium">{format(firstDay, "MMMM yyyy")}</h3>
        <div className="grid grid-cols-7 gap-1">
          {dayLabels.map((label) => (
            <div key={label} className="text-center text-xs text-muted-foreground">
              {label}
            </div>
          ))}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {days.map((dateStr) => {
            const count = getCompletionCount(dateStr);

            return (
              <CompletionMenu
                key={dateStr}
                habitId={habit._id}
                date={dateStr}
                count={count}
                onCountChange={(newCount) => onToggle(habit._id, dateStr, newCount)}
                colorClass={color}
                gridView={true}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
