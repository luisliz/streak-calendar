/**
 * Color system for habit completion visualization.
 * Each color has 3 intensity levels using Tailwind CSS classes.
 * The intensity increases with the completion count:
 * - Level 1 (count = 1): 200 shade
 * - Level 2 (count = 2): 300 shade
 * - Level 3 (count ≥ 3): 400 shade
 */
const COLOR_LEVELS = {
  red: {
    1: "bg-red-200",
    2: "bg-red-300",
    3: "bg-red-400",
  },
  orange: {
    1: "bg-orange-200",
    2: "bg-orange-300",
    3: "bg-orange-400",
  },
  amber: {
    1: "bg-amber-200",
    2: "bg-amber-300",
    3: "bg-amber-400",
  },
  yellow: {
    1: "bg-yellow-200",
    2: "bg-yellow-300",
    3: "bg-yellow-400",
  },
  lime: {
    1: "bg-lime-200",
    2: "bg-lime-300",
    3: "bg-lime-400",
  },
  green: {
    1: "bg-green-200",
    2: "bg-green-300",
    3: "bg-green-400",
  },
  emerald: {
    1: "bg-emerald-200",
    2: "bg-emerald-300",
    3: "bg-emerald-400",
  },
  teal: {
    1: "bg-teal-200",
    2: "bg-teal-300",
    3: "bg-teal-400",
  },
  cyan: {
    1: "bg-cyan-200",
    2: "bg-cyan-300",
    3: "bg-cyan-400",
  },
  sky: {
    1: "bg-sky-200",
    2: "bg-sky-300",
    3: "bg-sky-400",
  },
  blue: {
    1: "bg-blue-200",
    2: "bg-blue-300",
    3: "bg-blue-400",
  },
  indigo: {
    1: "bg-indigo-200",
    2: "bg-indigo-300",
    3: "bg-indigo-400",
  },
  violet: {
    1: "bg-violet-200",
    2: "bg-violet-300",
    3: "bg-violet-400",
  },
  purple: {
    1: "bg-purple-200",
    2: "bg-purple-300",
    3: "bg-purple-400",
  },
  fuchsia: {
    1: "bg-fuchsia-200",
    2: "bg-fuchsia-300",
    3: "bg-fuchsia-400",
  },
  pink: {
    1: "bg-pink-200",
    2: "bg-pink-300",
    3: "bg-pink-400",
  },
  rose: {
    1: "bg-rose-200",
    2: "bg-rose-300",
    3: "bg-rose-400",
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
