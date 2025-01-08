"use client";

import { HabitDetails } from "@/components/habit/habit-details";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

/**
 * Habit details page component
 * Shows detailed information about a specific habit and allows editing
 */
export default function HabitPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.habitId as Id<"habits">;

  try {
    const habit = useQuery(api.habits.get, { id: habitId });
    const calendar = useQuery(api.calendars.get, habit ? { id: habit.calendarId } : "skip");

    if (habit === null) {
      router.replace("/calendar");
      return null;
    }

    return (
      <div className="container mx-auto max-w-7xl">
        {habit && calendar ? (
          <HabitDetails habit={habit} calendar={calendar} onDelete={() => router.replace("/calendar")} />
        ) : (
          <Card className="my-8 border shadow-md">
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="h-10 w-24" />
            </div>
            <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
              <div className="space-y-4 p-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            </Card>
          </Card>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading habit:", error);
    return null;
  }
}
