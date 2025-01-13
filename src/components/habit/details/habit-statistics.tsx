"use client";

import { Card } from "@/components/ui/card";

import { Id } from "@server/convex/_generated/dataModel";

interface HabitStatisticsProps {
  habitId: Id<"habits">;
  completions:
    | Array<{
        habitId: Id<"habits">;
        completedAt: number;
      }>
    | undefined;
}

export function HabitStatistics({ habitId, completions }: HabitStatisticsProps) {
  const totalCompletions = completions?.filter((c) => c.habitId === habitId).length ?? 0;

  const thisMonthCompletions =
    completions?.filter((c) => {
      const date = new Date(c.completedAt);
      const now = new Date();
      return c.habitId === habitId && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length ?? 0;

  const currentStreak = (() => {
    if (!completions) return 0;

    const dates = completions
      .filter((c) => c.habitId === habitId)
      .map((c) => new Date(c.completedAt).toISOString().split("T")[0])
      .sort();

    if (dates.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const uniqueDates = [...new Set(dates)];

    if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
      return 0;
    }

    let streak = 0;
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const date = new Date(uniqueDates[i]);

      if (i < uniqueDates.length - 1) {
        const prevDate = new Date(uniqueDates[i + 1]);
        const dayDiff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff > 1) break;
      }

      streak++;
    }

    return streak;
  })();

  const offStreak = (() => {
    if (!completions || currentStreak > 0) return 0;

    const dates = completions
      .filter((c) => c.habitId === habitId)
      .map((c) => new Date(c.completedAt).toISOString().split("T")[0])
      .sort();

    if (dates.length === 0) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return Math.floor((today.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    const lastCompletionDate = new Date(dates[dates.length - 1]);
    const today = new Date();
    return Math.floor((today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24));
  })();

  return (
    <Card className="w-[800px] border p-2 shadow-md">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{currentStreak}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Days Without Completion</p>
            <p className="text-2xl font-bold">{offStreak}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">{thisMonthCompletions}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Completions</p>
            <p className="text-2xl font-bold">{totalCompletions}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
