"use client";

import { Card } from "@/components/ui/card";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryPolarAxis,
  VictoryScatter,
  VictoryTheme,
} from "victory";

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

  function calculateStreakDistribution(completions: HabitStatisticsProps["completions"]) {
    if (!completions) return [];

    const dates = completions.map((c) => new Date(c.completedAt).toISOString().split("T")[0]).sort();

    const uniqueDates = [...new Set(dates)];
    const streaks: number[] = [];
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i - 1]);
      const dayDiff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        streaks.push(currentStreak);
        currentStreak = 1;
      }
    }
    streaks.push(currentStreak);

    const distribution = streaks.reduce(
      (acc, streak) => {
        acc[streak] = (acc[streak] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    return Object.entries(distribution).map(([streakLength, frequency]) => ({
      streakLength: Number(streakLength),
      frequency,
    }));
  }

  function calculateWeeklyPattern(completions: HabitStatisticsProps["completions"], habitId: Id<"habits">) {
    if (!completions) return [];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = new Array(7).fill(0);

    completions
      .filter((c) => c.habitId === habitId)
      .forEach((c) => {
        const dayIndex = new Date(c.completedAt).getDay();
        counts[dayIndex]++;
      });

    return days.map((day, index) => ({
      day,
      count: counts[index],
    }));
  }

  function calculateMonthlyProgress(completions: HabitStatisticsProps["completions"], habitId: Id<"habits">) {
    if (!completions) return [];

    const monthlyData = completions
      .filter((c) => c.habitId === habitId)
      .reduce(
        (acc, c) => {
          const date = new Date(c.completedAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month: month.split("-")[1],
        count,
      }));
  }

  function calculateTimeGaps(completions: HabitStatisticsProps["completions"], habitId: Id<"habits">) {
    if (!completions) return [];

    const dates = completions
      .filter((c) => c.habitId === habitId)
      .map((c) => new Date(c.completedAt).getTime())
      .sort((a, b) => a - b);

    return dates.slice(1).map((date, index) => ({
      index,
      gap: Math.floor((date - dates[index]) / (1000 * 60 * 60 * 24)),
    }));
  }

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
    <div className="flex flex-col gap-8">
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

          <div className="mb-8 mt-8">
            <h2 className="mb-4 text-lg font-semibold">Analysis</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="h-[140px]">
                <h3 className="mb-2 text-sm text-muted-foreground">Streak Distribution</h3>
                {completions && (
                  <VictoryChart
                    theme={VictoryTheme.clean}
                    height={140}
                    width={180}
                    padding={{ top: 8, bottom: 25, left: 35, right: 10 }}
                  >
                    <VictoryAxis
                      label="Streak Length"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 15, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Frequency"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 20, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryArea
                      data={calculateStreakDistribution(completions)}
                      x="streakLength"
                      y="frequency"
                      style={{
                        data: {
                          fill: "hsl(var(--primary) / 0.2)",
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                        },
                      }}
                      animate={{
                        duration: 500,
                        onLoad: { duration: 500 },
                      }}
                      interpolation="natural"
                    />
                  </VictoryChart>
                )}
              </div>

              <div className="h-[140px]">
                <h3 className="mb-2 text-sm text-muted-foreground">Weekly Pattern</h3>
                {completions && (
                  <VictoryChart
                    polar
                    theme={VictoryTheme.clean}
                    height={140}
                    width={180}
                    padding={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    domain={{ y: [0, 10] }}
                  >
                    <VictoryPolarAxis
                      dependentAxis
                      style={{
                        axis: { stroke: "none" },
                        grid: { stroke: "hsl(var(--muted-foreground) / 0.2)" },
                        tickLabels: { fontSize: 0 },
                      }}
                    />
                    <VictoryPolarAxis
                      tickValues={[0, 1, 2, 3, 4, 5, 6]}
                      tickFormat={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                      }}
                    />
                    <VictoryGroup
                      style={{
                        data: { fillOpacity: 0.2, strokeWidth: 2 },
                      }}
                    >
                      <VictoryArea
                        data={calculateWeeklyPattern(completions, habitId)}
                        x="day"
                        y="count"
                        style={{
                          data: {
                            fill: "hsl(var(--primary) / 0.2)",
                            stroke: "hsl(var(--primary))",
                          },
                        }}
                        animate={{
                          duration: 500,
                          onLoad: { duration: 500 },
                        }}
                      />
                    </VictoryGroup>
                  </VictoryChart>
                )}
              </div>

              <div className="h-[140px]">
                <h3 className="mb-2 text-sm text-muted-foreground">Monthly Progress</h3>
                {completions && (
                  <VictoryChart
                    theme={VictoryTheme.clean}
                    height={140}
                    width={180}
                    padding={{ top: 8, bottom: 25, left: 35, right: 10 }}
                  >
                    <VictoryAxis
                      label="Month"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 15, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Completions"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 20, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryLine
                      data={calculateMonthlyProgress(completions, habitId)}
                      x="month"
                      y="count"
                      style={{
                        data: {
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                        },
                      }}
                      animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 },
                      }}
                    />
                  </VictoryChart>
                )}
              </div>

              <div className="h-[140px]">
                <h3 className="mb-2 text-sm text-muted-foreground">Time Between</h3>
                {completions && (
                  <VictoryChart
                    theme={VictoryTheme.clean}
                    height={140}
                    width={180}
                    padding={{ top: 8, bottom: 25, left: 35, right: 10 }}
                  >
                    <VictoryAxis
                      label="Completion"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 15, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryAxis
                      dependentAxis
                      label="Days Gap"
                      style={{
                        axis: { stroke: "hsl(var(--muted-foreground))" },
                        axisLabel: { padding: 20, fontSize: 10, fill: "hsl(var(--muted-foreground))" },
                        tickLabels: { fontSize: 8, fill: "hsl(var(--muted-foreground))" },
                        grid: { stroke: "transparent" },
                      }}
                    />
                    <VictoryScatter
                      data={calculateTimeGaps(completions, habitId)}
                      x="index"
                      y="gap"
                      size={3}
                      style={{
                        data: {
                          fill: "hsl(var(--primary))",
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 1,
                        },
                      }}
                      animate={{
                        duration: 500,
                        onLoad: { duration: 500 },
                      }}
                    />
                  </VictoryChart>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
