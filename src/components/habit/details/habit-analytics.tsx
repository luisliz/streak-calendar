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
import { Line, Pie } from "react-chartjs-2";

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
    if (!completions) return { labels: [], data: [] };

    const dates = completions.map((c) => new Date(c.completedAt).toISOString().split("T")[0]).sort();
    const uniqueDates = [...new Set(dates)];
    const streaks: { date: string; length: number }[] = [];
    let currentStreak = 1;
    let streakStartDate = uniqueDates[0];

    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i]);
      const prev = new Date(uniqueDates[i - 1]);
      const dayDiff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        streaks.push({ date: streakStartDate, length: currentStreak });
        currentStreak = 1;
        streakStartDate = uniqueDates[i];
      }
    }
    streaks.push({ date: streakStartDate, length: currentStreak });

    // Get last 10 streaks for better visibility
    const lastStreaks = streaks.slice(-10);

    return {
      labels: lastStreaks.map((s) =>
        new Date(s.date).toLocaleDateString("default", { month: "short", day: "numeric" })
      ),
      data: lastStreaks.map((s) => s.length),
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
          <Line
            data={{
              labels: streakData.labels,
              datasets: [
                {
                  data: streakData.data,
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
            options={{
              ...chartOptions,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Start Date",
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: "Streak Length (days)",
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
