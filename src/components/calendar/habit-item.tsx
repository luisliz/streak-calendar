/**
 * HabitItem Component
 *
 * A wrapper component that manages the display of a single habit's completion tracking.
 * It serves two main purposes:
 * 1. Provides a container for the calendar visualization
 * 2. Handles horizontal scrolling behavior to show the most recent dates
 *
 * The component automatically scrolls to show the most recent dates when mounted
 * or when the habit changes, ensuring users see the most relevant information first.
 */
import { useEffect } from "react";

import { Id } from "@server/convex/_generated/dataModel";

import { CalendarView } from "./calendar-views";

interface HabitItemProps {
  habit: {
    _id: Id<"habits">;
    name: string;
  };
  color: string; // Base color theme for completion visualization
  days: string[]; // Array of ISO date strings to display
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number; // Unix timestamp of completion
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
  view: "monthRow" | "monthGrid"; // Display mode selection
}

export const HabitItem = ({ habit, color, days, completions, onToggle, view }: HabitItemProps) => {
  // Auto-scroll to most recent dates when component mounts or habit changes
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
