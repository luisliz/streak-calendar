/**
 * Color system for habit completion visualization.
 * Each color has 3 intensity levels using Tailwind CSS classes.
 * The intensity increases with the completion count:
 * - Level 1 (count = 1): 200/400 shade (light/dark)
 * - Level 2 (count = 2): 300/500 shade (light/dark)
 * - Level 3 (count ≥ 3): 400/600 shade (light/dark)
 */
const COLOR_LEVELS = {
  red: {
    1: "bg-red-200 dark:bg-red-400",
    2: "bg-red-300 dark:bg-red-500",
    3: "bg-red-400 dark:bg-red-600",
  },
  orange: {
    1: "bg-orange-200 dark:bg-orange-400",
    2: "bg-orange-300 dark:bg-orange-500",
    3: "bg-orange-400 dark:bg-orange-600",
  },
  amber: {
    1: "bg-amber-200 dark:bg-amber-400",
    2: "bg-amber-300 dark:bg-amber-500",
    3: "bg-amber-400 dark:bg-amber-600",
  },
  yellow: {
    1: "bg-yellow-200 dark:bg-yellow-400",
    2: "bg-yellow-300 dark:bg-yellow-500",
    3: "bg-yellow-400 dark:bg-yellow-600",
  },
  lime: {
    1: "bg-lime-200 dark:bg-lime-400",
    2: "bg-lime-300 dark:bg-lime-500",
    3: "bg-lime-400 dark:bg-lime-600",
  },
  green: {
    1: "bg-green-200 dark:bg-green-400",
    2: "bg-green-300 dark:bg-green-500",
    3: "bg-green-400 dark:bg-green-600",
  },
  emerald: {
    1: "bg-emerald-200 dark:bg-emerald-400",
    2: "bg-emerald-300 dark:bg-emerald-500",
    3: "bg-emerald-400 dark:bg-emerald-600",
  },
  teal: {
    1: "bg-teal-200 dark:bg-teal-400",
    2: "bg-teal-300 dark:bg-teal-500",
    3: "bg-teal-400 dark:bg-teal-600",
  },
  cyan: {
    1: "bg-cyan-200 dark:bg-cyan-400",
    2: "bg-cyan-300 dark:bg-cyan-500",
    3: "bg-cyan-400 dark:bg-cyan-600",
  },
  sky: {
    1: "bg-sky-200 dark:bg-sky-400",
    2: "bg-sky-300 dark:bg-sky-500",
    3: "bg-sky-400 dark:bg-sky-600",
  },
  blue: {
    1: "bg-blue-200 dark:bg-blue-400",
    2: "bg-blue-300 dark:bg-blue-500",
    3: "bg-blue-400 dark:bg-blue-600",
  },
  indigo: {
    1: "bg-indigo-200 dark:bg-indigo-400",
    2: "bg-indigo-300 dark:bg-indigo-500",
    3: "bg-indigo-400 dark:bg-indigo-600",
  },
  violet: {
    1: "bg-violet-200 dark:bg-violet-400",
    2: "bg-violet-300 dark:bg-violet-500",
    3: "bg-violet-400 dark:bg-violet-600",
  },
  purple: {
    1: "bg-purple-200 dark:bg-purple-400",
    2: "bg-purple-300 dark:bg-purple-500",
    3: "bg-purple-400 dark:bg-purple-600",
  },
  fuchsia: {
    1: "bg-fuchsia-200 dark:bg-fuchsia-400",
    2: "bg-fuchsia-300 dark:bg-fuchsia-500",
    3: "bg-fuchsia-400 dark:bg-fuchsia-600",
  },
  pink: {
    1: "bg-pink-200 dark:bg-pink-400",
    2: "bg-pink-300 dark:bg-pink-500",
    3: "bg-pink-400 dark:bg-pink-600",
  },
  rose: {
    1: "bg-rose-200 dark:bg-rose-400",
    2: "bg-rose-300 dark:bg-rose-500",
    3: "bg-rose-400 dark:bg-rose-600",
  },
};

/**
 * Converts a color theme string (e.g., "bg-red-500") and completion count into a Tailwind CSS background color class.
 * The color intensity increases with the completion count, maxing out at 3 completions.
 *
 * @param colorTheme - The base color theme (e.g., "bg-red-500")
 * @param count - Number of completions for the given day
 * @returns A Tailwind CSS background color class
 *
 * Examples:
 * - count = 0 -> "bg-neutral-100 dark:bg-neutral-800" (empty state)
 * - count = 1 -> "bg-{color}-400" (light intensity)
 * - count = 2 -> "bg-{color}-500" (medium intensity)
 * - count ≥ 3 -> "bg-{color}-600" (high intensity)
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
