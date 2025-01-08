"use client";

import { HabitDetails } from "@/components/habit/habit-details";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

/**
 * Habit details page component
 * Shows detailed information about a specific habit and allows editing
 */
export default function HabitPage() {
  const params = useParams();
  const habitId = params.habitId as Id<"habits">;

  // Fetch habit data
  const habit = useQuery(api.habits.get, { id: habitId });
  const calendar = useQuery(api.calendars.get, habit ? { id: habit.calendarId } : "skip");

  if (!habit || !calendar) {
    return null; // TODO: Add loading state
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <HabitDetails habit={habit} calendar={calendar} />
    </div>
  );
}
