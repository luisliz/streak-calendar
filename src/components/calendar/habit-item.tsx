import { useEffect } from "react";

import { Id } from "@server/convex/_generated/dataModel";

import { CalendarView } from "./calendar-views";

/**
 * HabitItem displays a grid of days showing habit completion status.
 * Each day is represented by a button that can be toggled to mark habit completion.
 */

interface HabitItemProps {
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

export const HabitItem = ({ habit, color, days, completions, onToggle, view }: HabitItemProps) => {
  useEffect(() => {
    const container = document.querySelector(`[data-habit-id="${habit._id}"]`);
    if (container) {
      container.scrollLeft = container.scrollWidth;
    }
  }, [habit._id]);

  return (
    <CalendarView habit={habit} color={color} days={days} completions={completions} onToggle={onToggle} view={view} />
  );
};
