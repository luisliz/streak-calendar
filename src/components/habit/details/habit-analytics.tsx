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
import { Bar, Line } from "react-chartjs-2";

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
  colorTheme: string;
  completions:
    | Array<{
        habitId: Id<"habits">;
        completedAt: number;
      }>
    | undefined;
}

export function HabitAnalytics({ colorTheme, completions }: HabitAnalyticsProps) {
  // Extract RGB values from colorTheme
  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  const colorName = colorMatch ? colorMatch[1] : "purple";
  const rgbValues = {
    red: {
      300: "252 165 165",
      400: "248 113 113",
      500: "239 68 68",
      600: "220 38 38",
    },
    orange: {
      300: "253 186 116",
      400: "251 146 60",
      500: "249 115 22",
      600: "234 88 12",
    },
    amber: {
      300: "252 211 77",
      400: "251 191 36",
      500: "245 158 11",
      600: "217 119 6",
    },
    yellow: {
      300: "253 224 71",
      400: "250 204 21",
      500: "234 179 8",
      600: "202 138 4",
    },
    lime: {
      300: "190 242 100",
      400: "163 230 53",
      500: "132 204 22",
      600: "101 163 13",
    },
    green: {
      300: "134 239 172",
      400: "74 222 128",
      500: "34 197 94",
      600: "22 163 74",
    },
    emerald: {
      300: "110 231 183",
      400: "52 211 153",
      500: "16 185 129",
      600: "5 150 105",
    },
    teal: {
      300: "94 234 212",
      400: "45 212 191",
      500: "20 184 166",
      600: "13 148 136",
    },
    cyan: {
      300: "103 232 249",
      400: "34 211 238",
      500: "6 182 212",
      600: "8 145 178",
    },
    sky: {
      300: "125 211 252",
      400: "56 189 248",
      500: "14 165 233",
      600: "2 132 199",
    },
    blue: {
      300: "147 197 253",
      400: "96 165 250",
      500: "59 130 246",
      600: "37 99 235",
    },
    indigo: {
      300: "165 180 252",
      400: "129 140 248",
      500: "99 102 241",
      600: "79 70 229",
    },
    violet: {
      300: "196 181 253",
      400: "167 139 250",
      500: "139 92 246",
      600: "124 58 237",
    },
    purple: {
      300: "216 180 254",
      400: "192 132 252",
      500: "168 85 247",
      600: "147 51 234",
    },
    fuchsia: {
      300: "240 171 252",
      400: "232 121 249",
      500: "217 70 239",
      600: "192 38 211",
    },
    pink: {
      300: "249 168 212",
      400: "244 114 182",
      500: "236 72 153",
      600: "219 39 119",
    },
    rose: {
      300: "253 164 175",
      400: "251 113 133",
      500: "244 63 94",
      600: "225 29 72",
    },
  }[colorName] || {
    300: "216 180 254",
    400: "192 132 252",
    500: "168 85 247",
    600: "147 51 234",
  }; // Default to purple if color not found

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
                  backgroundColor: `rgb(${rgbValues[500]})`,
                  borderColor: `rgb(${rgbValues[600]})`,
                  borderWidth: 1,
                  borderRadius: {
                    topLeft: 4,
                    topRight: 4,
                    bottomLeft: 4,
                    bottomRight: 4,
                  },
                  categoryPercentage: 0.8,
                  barPercentage: 0.9,
                },
                {
                  label: "Off Days",
                  data: streakData.offData,
                  backgroundColor: `rgb(${rgbValues[500]} / 0.2)`,
                  borderColor: `rgb(${rgbValues[500]} / 0.5)`,
                  borderWidth: 2,
                  borderRadius: {
                    topLeft: 20,
                    topRight: 20,
                    bottomLeft: 0,
                    bottomRight: 0,
                  },
                  borderSkipped: false,
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
                  borderColor: `rgb(${rgbValues[500]})`,
                  backgroundColor: `rgb(${rgbValues[300]} / 0.2)`,
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: `rgb(${rgbValues[500]})`,
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
                  borderColor: `rgb(${rgbValues[500]})`,
                  backgroundColor: `rgb(${rgbValues[300]} / 0.2)`,
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
          <Line
            data={{
              labels: timeData.labels,
              datasets: [
                {
                  data: timeData.data,
                  borderColor: `rgb(${rgbValues[500]})`,
                  backgroundColor: `rgb(${rgbValues[300]} / 0.2)`,
                  borderWidth: 2,
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: `rgb(${rgbValues[500]})`,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            }}
            options={chartOptions}
          />
        </div>
      </div>
    </>
  );
}
