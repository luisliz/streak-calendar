import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Check, X } from "lucide-react";

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
        <div className="inline-flex gap-px bg-background border rounded-md p-1">
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

    const getBgColor = (count: number) => {
      if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
      const colorName = color.match(/bg-(\w+)-\d+/)?.[1] || "neutral";
      const intensityMap = {
        1: "100",
        2: "200",
        3: "300",
        4: "400",
        5: "500",
      };
      const intensity = intensityMap[Math.min(count, 5) as keyof typeof intensityMap] || "500";
      return `bg-${colorName}-${intensity} dark:bg-${colorName}-900/${Math.min(count * 20, 100)}`;
    };

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
            const date = new Date(dateStr);
            const count = getCompletionCount(dateStr);

            return (
              <Popover key={dateStr}>
                <PopoverTrigger asChild>
                  <button
                    aria-label={`View habits for ${format(date, "MMMM d, yyyy")}`}
                    className={`aspect-square w-full rounded p-0.5 text-center text-sm ${getBgColor(count)} ${
                      isToday(date) ? "ring-2 ring-ring" : ""
                    } transition-all duration-200 hover:brightness-110`}
                  >
                    {format(date, "d")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-medium">{format(date, "MMMM d, yyyy")}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span>{habit.name}</span>
                        {count > 0 ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Remove completion for ${habit.name}`}
                            onClick={() => onToggle(habit._id, dateStr, 0)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Mark ${habit.name} as complete`}
                            onClick={() => onToggle(habit._id, dateStr, 1)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
