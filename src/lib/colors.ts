/**
 * Color system for habit completion visualization.
 * Each color has 3 intensity levels using opacity.
 * The intensity increases with the completion count:
 * - Level 1 (count = 1): 25% opacity
 * - Level 2 (count = 2): 50% opacity
 * - Level 3 (count ≥ 3): 100% opacity
 */
const COLOR_LEVELS = {
  red: {
    1: "bg-red-500/25 dark:bg-red-500/25",
    2: "bg-red-500/50 dark:bg-red-500/50",
    3: "bg-red-500 dark:bg-red-500",
  },
  orange: {
    1: "bg-orange-500/25 dark:bg-orange-500/25",
    2: "bg-orange-500/50 dark:bg-orange-500/50",
    3: "bg-orange-500 dark:bg-orange-500",
  },
  amber: {
    1: "bg-amber-500/25 dark:bg-amber-500/25",
    2: "bg-amber-500/50 dark:bg-amber-500/50",
    3: "bg-amber-500 dark:bg-amber-500",
  },
  yellow: {
    1: "bg-yellow-500/25 dark:bg-yellow-500/25",
    2: "bg-yellow-500/50 dark:bg-yellow-500/50",
    3: "bg-yellow-500 dark:bg-yellow-500",
  },
  lime: {
    1: "bg-lime-500/25 dark:bg-lime-500/25",
    2: "bg-lime-500/50 dark:bg-lime-500/50",
    3: "bg-lime-500 dark:bg-lime-500",
  },
  green: {
    1: "bg-green-500/25 dark:bg-green-500/25",
    2: "bg-green-500/50 dark:bg-green-500/50",
    3: "bg-green-500 dark:bg-green-500",
  },
  emerald: {
    1: "bg-emerald-500/25 dark:bg-emerald-500/25",
    2: "bg-emerald-500/50 dark:bg-emerald-500/50",
    3: "bg-emerald-500 dark:bg-emerald-500",
  },
  teal: {
    1: "bg-teal-500/25 dark:bg-teal-500/25",
    2: "bg-teal-500/50 dark:bg-teal-500/50",
    3: "bg-teal-500 dark:bg-teal-500",
  },
  cyan: {
    1: "bg-cyan-500/25 dark:bg-cyan-500/25",
    2: "bg-cyan-500/50 dark:bg-cyan-500/50",
    3: "bg-cyan-500 dark:bg-cyan-500",
  },
  sky: {
    1: "bg-sky-500/25 dark:bg-sky-500/25",
    2: "bg-sky-500/50 dark:bg-sky-500/50",
    3: "bg-sky-500 dark:bg-sky-500",
  },
  blue: {
    1: "bg-blue-500/25 dark:bg-blue-500/25",
    2: "bg-blue-500/50 dark:bg-blue-500/50",
    3: "bg-blue-500 dark:bg-blue-500",
  },
  indigo: {
    1: "bg-indigo-500/25 dark:bg-indigo-500/25",
    2: "bg-indigo-500/50 dark:bg-indigo-500/50",
    3: "bg-indigo-500 dark:bg-indigo-500",
  },
  violet: {
    1: "bg-violet-500/25 dark:bg-violet-500/25",
    2: "bg-violet-500/50 dark:bg-violet-500/50",
    3: "bg-violet-500 dark:bg-violet-500",
  },
  purple: {
    1: "bg-purple-500/25 dark:bg-purple-500/25",
    2: "bg-purple-500/50 dark:bg-purple-500/50",
    3: "bg-purple-500 dark:bg-purple-500",
  },
  fuchsia: {
    1: "bg-fuchsia-500/25 dark:bg-fuchsia-500/25",
    2: "bg-fuchsia-500/50 dark:bg-fuchsia-500/50",
    3: "bg-fuchsia-500 dark:bg-fuchsia-500",
  },
  pink: {
    1: "bg-pink-500/25 dark:bg-pink-500/25",
    2: "bg-pink-500/50 dark:bg-pink-500/50",
    3: "bg-pink-500 dark:bg-pink-500",
  },
  rose: {
    1: "bg-rose-500/25 dark:bg-rose-500/25",
    2: "bg-rose-500/50 dark:bg-rose-500/50",
    3: "bg-rose-500 dark:bg-rose-500",
  },
};

/**
 * Converts a color theme string (e.g., "bg-red-500") and completion count into a Tailwind CSS background color class.
 * The color intensity increases with the completion count using opacity levels.
 *
 * @param colorTheme - The base color theme (e.g., "bg-red-500")
 * @param count - Number of completions for the given day
 * @returns A Tailwind CSS background color class
 *
 * Examples:
 * - count = 0 -> "bg-neutral-100 dark:bg-neutral-800" (empty state)
 * - count = 1 -> "bg-{color}-500/25" (25% opacity)
 * - count = 2 -> "bg-{color}-500/50" (50% opacity)
 * - count ≥ 3 -> "bg-{color}-500" (100% opacity)
 */
export function getCompletionColorClass(colorTheme: string, count: number): string {
  // Return neutral background for zero completions
  if (count === 0) {
    return "bg-neutral-100 dark:bg-neutral-800";
  }

  // Extract color name from theme (e.g., "bg-red-500" -> "red")
  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  if (!colorMatch) {
    console.warn("Invalid color theme format:", colorTheme);
    return colorTheme;
  }

  const colorName = colorMatch[1];
  if (!(colorName in COLOR_LEVELS)) {
    console.warn("Color not found in COLOR_LEVELS:", colorName);
    return colorTheme;
  }

  // Map completion count to color intensity level (1-3)
  let level: 1 | 2 | 3;
  if (count >= 3) {
    level = 3;
  } else if (count === 2) {
    level = 2;
  } else {
    level = 1;
  }

  // Get the color class directly from the levels object
  return COLOR_LEVELS[colorName as keyof typeof COLOR_LEVELS][level];
}
