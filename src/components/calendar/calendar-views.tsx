import { Id } from "@server/convex/_generated/dataModel";

import { MonthGridView } from "./month-grid-view";
import { MonthRowView } from "./month-row-view";

interface CalendarViewProps {
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
  view: "monthRow" | "monthGrid";
}

export function CalendarView({ habit, color, days, completions, onToggle, view }: CalendarViewProps) {
  if (view === "monthRow") {
    return <MonthRowView habit={habit} color={color} days={days} completions={completions} onToggle={onToggle} />;
  }

  if (view === "monthGrid") {
    return <MonthGridView habit={habit} color={color} days={days} completions={completions} onToggle={onToggle} />;
  }

  return null;
}
