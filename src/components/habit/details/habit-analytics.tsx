"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

import { Id } from "@server/convex/_generated/dataModel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      beginAtZero: true,
    },
  },
};

interface HabitAnalyticsProps {
  completions:
    | Array<{
        habitId: Id<"habits">;
        completedAt: number;
      }>
    | undefined;
}

export function HabitAnalytics({ completions }: HabitAnalyticsProps) {
  function calculateStreakHistory(completions: HabitAnalyticsProps["completions"]) {
    if (!completions) return { labels: [], activeData: [], offData: [] };

    const dates = completions.map((c) => new Date(c.completedAt).toISOString().split("T")[0]).sort();
    const uniqueDates = [...new Set(dates)];
    const streaks: { date: string; length: number; type: "active" | "off" }[] = [];

    if (uniqueDates.length === 0) return { labels: [], activeData: [], offData: [] };

    let currentStreak = 1;
    let streakStartDate = uniqueDates[0];

    // Check if there's an initial off-streak before the first completion
    const firstCompletionDate = new Date(uniqueDates[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceStart = Math.floor((firstCompletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceStart < -1) {
      streaks.push({ date: today.toISOString().split("T")[0], length: Math.abs(daysSinceStart), type: "off" });
    }

    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i - 1]);
      const dayDiff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        // Add the active streak
        streaks.push({ date: streakStartDate, length: currentStreak, type: "active" });
        // Add the off streak if there was a gap
        if (dayDiff > 1) {
          streaks.push({
            date: new Date(prev.getTime() + 86400000).toISOString().split("T")[0],
            length: dayDiff - 1,
            type: "off",
          });
        }
        currentStreak = 1;
        streakStartDate = uniqueDates[i];
      }
    }
    // Add the final active streak
    streaks.push({ date: streakStartDate, length: currentStreak, type: "active" });

    // Check if there's a final off-streak after the last completion
    const lastCompletionDate = new Date(uniqueDates[uniqueDates.length - 1]);
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastCompletion > 1) {
      streaks.push({
        date: new Date(lastCompletionDate.getTime() + 86400000).toISOString().split("T")[0],
        length: daysSinceLastCompletion - 1,
        type: "off",
      });
    }

    // Get last 10 streaks for better visibility
    const lastStreaks = streaks.slice(-10);

    return {
      labels: lastStreaks.map((s) =>
        new Date(s.date).toLocaleDateString("default", { month: "short", day: "numeric" })
      ),
      activeData: lastStreaks.map((s) => (s.type === "active" ? s.length : null)),
      offData: lastStreaks.map((s) => (s.type === "off" ? s.length : null)),
    };
  }

  function calculateWeeklyPattern(completions: HabitAnalyticsProps["completions"]) {
    if (!completions) return { labels: [], data: [] };

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const counts = new Array(7).fill(0);

    completions.forEach((c) => {
      const dayIndex = new Date(c.completedAt).getDay();
      counts[dayIndex]++;
    });

    return {
      labels: days,
      data: counts,
    };
  }

  function calculateMonthlyProgress(completions: HabitAnalyticsProps["completions"]) {
    if (!completions) return { labels: [], data: [] };

    const monthlyData = completions.reduce(
      (acc, c) => {
        const date = new Date(c.completedAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const sortedEntries = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b));

    return {
      labels: sortedEntries.map(([month]) => {
        const [year, monthNum] = month.split("-");
        return `${new Date(0, Number(monthNum) - 1).toLocaleString("default", { month: "short" })} ${year}`;
      }),
      data: sortedEntries.map(([, count]) => count),
    };
  }

  function calculateTimeOfDay(completions: HabitAnalyticsProps["completions"]) {
    if (!completions) return { labels: [], data: [] };

    const timeSlots = {
      Morning: 0, // 6am-12pm
      Afternoon: 0, // 12pm-6pm
      Evening: 0, // 6pm-12am
      Night: 0, // 12am-6am
    };

    completions.forEach((c) => {
      const hour = new Date(c.completedAt).getHours();
      if (hour >= 6 && hour < 12) timeSlots.Morning++;
      else if (hour >= 12 && hour < 18) timeSlots.Afternoon++;
      else if (hour >= 18) timeSlots.Evening++;
      else timeSlots.Night++;
    });

    return {
      labels: Object.keys(timeSlots),
      data: Object.values(timeSlots),
    };
  }

  const streakData = calculateStreakHistory(completions);
  const weeklyData = calculateWeeklyPattern(completions);
  const monthlyData = calculateMonthlyProgress(completions);
  const timeData = calculateTimeOfDay(completions);

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Analysis</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-[240px] rounded-lg border p-4 pb-8">
          <h3 className="mb-2 text-sm text-muted-foreground">Streak History</h3>
          <Bar
            data={{
              labels: streakData.labels,
              datasets: [
                {
                  label: "Active Streaks",
                  data: streakData.activeData,
                  backgroundColor: "rgb(147, 51, 234)",
                  borderColor: "rgb(147, 51, 234)",
                  borderWidth: 1,
                  borderRadius: 4,
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,
                },
                {
                  label: "Off Days",
                  data: streakData.offData,
                  backgroundColor: "rgb(239, 68, 68)",
                  borderColor: "rgb(239, 68, 68)",
                  borderWidth: 1,
                  borderRadius: 4,
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,
                },
              ],
            }}
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  display: true,
                  position: "top",
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  stacked: true,
                  title: {
                    display: true,
                    text: "Start Date",
                  },
                },
                y: {
                  stacked: false,
                  grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                  title: {
                    display: true,
                    text: "Days",
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        <div className="h-[240px] rounded-lg border p-4 pb-8">
          <h3 className="mb-2 text-sm text-muted-foreground">Weekly Pattern</h3>
          <Line
            data={{
              labels: weeklyData.labels,
              datasets: [
                {
                  data: weeklyData.data,
                  borderColor: "rgb(147, 51, 234)",
                  backgroundColor: "rgba(147, 51, 234, 0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: "rgb(147, 51, 234)",
                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div className="h-[240px] rounded-lg border p-4 pb-8">
          <h3 className="mb-2 text-sm text-muted-foreground">Monthly Progress</h3>
          <Line
            data={{
              labels: monthlyData.labels,
              datasets: [
                {
                  data: monthlyData.data,
                  borderColor: "rgb(147, 51, 234)",
                  backgroundColor: "rgba(147, 51, 234, 0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>

        <div className="h-[240px] rounded-lg border p-4 pb-8">
          <h3 className="mb-2 text-sm text-muted-foreground">Time of Day</h3>
          <Pie
            data={{
              labels: timeData.labels,
              datasets: [
                {
                  data: timeData.data,
                  backgroundColor: [
                    "rgba(147, 51, 234, 0.8)",
                    "rgba(147, 51, 234, 0.6)",
                    "rgba(147, 51, 234, 0.4)",
                    "rgba(147, 51, 234, 0.2)",
                  ],
                  borderColor: "rgb(147, 51, 234)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              ...chartOptions,
              plugins: {
                legend: {
                  display: true,
                  position: "right" as const,
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
