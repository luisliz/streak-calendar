import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

import { YearlyOverview } from "./yearly-overview";

interface CalendarItemProps {
  calendar: {
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  };
  habits: Array<{
    _id: Id<"habits">;
    name: string;
  }>;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onAddHabit: () => void;
  onEditCalendar: () => void;
  onEditHabit: (habit: { _id: Id<"habits">; name: string }) => void;
  onToggleHabit: (habitId: Id<"habits">, date: string) => void;
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
}: CalendarItemProps) => {
  return (
    <div className="rounded-lg border p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 group">
          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onEditCalendar}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onAddHabit}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
      ) : (
        <div className="space-y-1.5">
          {habits.map((habit) => (
            <div key={habit._id} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-48 group">
                <h3 className="font-medium text-base">{habit.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onEditHabit(habit)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <YearlyOverview
                habit={habit}
                color={calendar.colorTheme}
                days={days}
                completions={completions}
                onToggle={onToggleHabit}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
