"use client";

import { HabitDetails } from "@/components/habit/habit-details";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

/**
 * Habit Details Page
 *
 * Client component that displays detailed information for a specific habit.
 * Uses dynamic routing to fetch habit data based on the habitId parameter.
 *
 * Key features:
 * - Fetches habit and associated calendar data
 * - Handles loading states with skeleton UI
 * - Redirects to calendar if habit not found
 * - Renders HabitDetails component with edit/delete capabilities
 */
export default function HabitPage() {
  // Extract habitId from route parameters and set up navigation
  const params = useParams();
  const router = useRouter();
  const habitId = params.habitId as Id<"habits">;

  // Fetch habit and associated calendar data using Convex queries
  // Calendar query is skipped if habit data isn't available yet
  const habit = useQuery(api.habits.get, { id: habitId });
  const calendar = useQuery(api.calendars.get, habit ? { id: habit.calendarId } : "skip");

  // Redirect to calendar page if habit doesn't exist
  if (habit === null) {
    router.replace("/calendar");
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl">
      {habit && calendar ? (
        // Render habit details when data is available
        <HabitDetails habit={habit} calendar={calendar} onDelete={() => router.replace("/calendar")} />
      ) : (
        // Show skeleton loading state while data is being fetched
        // Mimics the structure of the HabitDetails component for smooth transition
        <Card className="my-8 border shadow-md">
          {/* Skeleton header section */}
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-10 w-24" />
          </div>
          {/* Skeleton form section */}
          <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
            <div className="space-y-4 p-4">
              <Skeleton className="h-7 w-32" />
              <div className="space-y-4">
                {/* Input field skeletons */}
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                {/* Action button skeletons */}
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
}
