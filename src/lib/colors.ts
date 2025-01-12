/**
 * Available color themes for calendars and habits.
 * Each color has a key for translation and a Tailwind background class.
 */
export const COLOR_VALUES = [
  { key: "red", value: "bg-red-500" },
  { key: "orange", value: "bg-orange-500" },
  { key: "amber", value: "bg-amber-500" },
  { key: "yellow", value: "bg-yellow-500" },
  { key: "lime", value: "bg-lime-500" },
  { key: "green", value: "bg-green-500" },
  { key: "emerald", value: "bg-emerald-500" },
  { key: "teal", value: "bg-teal-500" },
  { key: "cyan", value: "bg-cyan-500" },
  { key: "sky", value: "bg-sky-500" },
  { key: "blue", value: "bg-blue-500" },
  { key: "indigo", value: "bg-indigo-500" },
  { key: "violet", value: "bg-violet-500" },
  { key: "purple", value: "bg-purple-500" },
  { key: "fuchsia", value: "bg-fuchsia-500" },
  { key: "pink", value: "bg-pink-500" },
  { key: "rose", value: "bg-rose-500" },
] as const;

/**
 * Color system for habit completion visualization.
 * Each color has 3 intensity levels using opacity.
 * The intensity increases with the completion count:
 * - Level 1 (count = 1): 50% opacity
 * - Level 2 (count = 2): 75% opacity
 * - Level 3 (count ≥ 3): 100% opacity
 */
const COLOR_LEVELS = {
  red: {
    1: "fill-red-500/50 dark:fill-red-500/50",
    2: "fill-red-500/75 dark:fill-red-500/75",
    3: "fill-red-500 dark:fill-red-500",
  },
  orange: {
    1: "fill-orange-500/50 dark:fill-orange-500/50",
    2: "fill-orange-500/75 dark:fill-orange-500/75",
    3: "fill-orange-500 dark:fill-orange-500",
  },
  amber: {
    1: "fill-amber-500/50 dark:fill-amber-500/50",
    2: "fill-amber-500/75 dark:fill-amber-500/75",
    3: "fill-amber-500 dark:fill-amber-500",
  },
  yellow: {
    1: "fill-yellow-500/50 dark:fill-yellow-500/50",
    2: "fill-yellow-500/75 dark:fill-yellow-500/75",
    3: "fill-yellow-500 dark:fill-yellow-500",
  },
  lime: {
    1: "fill-lime-500/50 dark:fill-lime-500/50",
    2: "fill-lime-500/75 dark:fill-lime-500/75",
    3: "fill-lime-500 dark:fill-lime-500",
  },
  green: {
    1: "fill-green-500/50 dark:fill-green-500/50",
    2: "fill-green-500/75 dark:fill-green-500/75",
    3: "fill-green-500 dark:fill-green-500",
  },
  emerald: {
    1: "fill-emerald-500/50 dark:fill-emerald-500/50",
    2: "fill-emerald-500/75 dark:fill-emerald-500/75",
    3: "fill-emerald-500 dark:fill-emerald-500",
  },
  teal: {
    1: "fill-teal-500/50 dark:fill-teal-500/50",
    2: "fill-teal-500/75 dark:fill-teal-500/75",
    3: "fill-teal-500 dark:fill-teal-500",
  },
  cyan: {
    1: "fill-cyan-500/50 dark:fill-cyan-500/50",
    2: "fill-cyan-500/75 dark:fill-cyan-500/75",
    3: "fill-cyan-500 dark:fill-cyan-500",
  },
  sky: {
    1: "fill-sky-500/50 dark:fill-sky-500/50",
    2: "fill-sky-500/75 dark:fill-sky-500/75",
    3: "fill-sky-500 dark:fill-sky-500",
  },
  blue: {
    1: "fill-blue-500/50 dark:fill-blue-500/50",
    2: "fill-blue-500/75 dark:fill-blue-500/75",
    3: "fill-blue-500 dark:fill-blue-500",
  },
  indigo: {
    1: "fill-indigo-500/50 dark:fill-indigo-500/50",
    2: "fill-indigo-500/75 dark:fill-indigo-500/75",
    3: "fill-indigo-500 dark:fill-indigo-500",
  },
  violet: {
    1: "fill-violet-500/50 dark:fill-violet-500/50",
    2: "fill-violet-500/75 dark:fill-violet-500/75",
    3: "fill-violet-500 dark:fill-violet-500",
  },
  purple: {
    1: "fill-purple-500/50 dark:fill-purple-500/50",
    2: "fill-purple-500/75 dark:fill-purple-500/75",
    3: "fill-purple-500 dark:fill-purple-500",
  },
  fuchsia: {
    1: "fill-fuchsia-500/50 dark:fill-fuchsia-500/50",
    2: "fill-fuchsia-500/75 dark:fill-fuchsia-500/75",
    3: "fill-fuchsia-500 dark:fill-fuchsia-500",
  },
  pink: {
    1: "fill-pink-500/50 dark:fill-pink-500/50",
    2: "fill-pink-500/75 dark:fill-pink-500/75",
    3: "fill-pink-500 dark:fill-pink-500",
  },
  rose: {
    1: "fill-rose-500/50 dark:fill-rose-500/50",
    2: "fill-rose-500/75 dark:fill-rose-500/75",
    3: "fill-rose-500 dark:fill-rose-500",
  },
};

/**
 * Gets the fill color class for SVG elements based on completion count.
 * The color intensity increases with the completion count using opacity levels.
 *
 * @param colorTheme - The base color theme (e.g., "bg-red-500")
 * @param count - Number of completions for this date
 * @returns A Tailwind CSS fill color class
 *
 * Examples:
 * - count = 0 -> "" (empty state)
 * - count = 1 -> "fill-{color}-500/50" (50% opacity)
 * - count = 2 -> "fill-{color}-500/75" (75% opacity)
 * - count ≥ 3 -> "fill-{color}-500" (100% opacity)
 */
export function getCompletionColorClass(colorTheme: string, count: number): string {
  if (count === 0) return "";

  // Extract color name from theme (e.g., "bg-red-500" -> "red")
  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  if (!colorMatch) {
    console.warn("Invalid color theme format:", colorTheme);
    return "";
  }

  const colorName = colorMatch[1];
  if (!(colorName in COLOR_LEVELS)) {
    console.warn("Color not found in COLOR_LEVELS:", colorName);
    return "";
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

  return COLOR_LEVELS[colorName as keyof typeof COLOR_LEVELS][level];
}

/**
 * Gets the background color class for calendar cells based on completion count.
 * Similar to getCompletionColorClass but for background colors instead of SVG fills.
 */
export function getBackgroundColorClass(colorTheme: string, count: number): string {
  if (count === 0) return "";

  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  if (!colorMatch) {
    console.warn("Invalid color theme format:", colorTheme);
    return "";
  }

  const colorName = colorMatch[1];
  const baseClass = `bg-${colorName}-500`;

  if (count >= 3) return baseClass;
  if (count === 2) return `${baseClass}/75`;
  return `${baseClass}/50`;
}
