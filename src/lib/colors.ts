const COLOR_LEVELS = {
  red: {
    1: "bg-red-100 dark:bg-red-900/30",
    2: "bg-red-300 dark:bg-red-900/60",
    3: "bg-red-500 dark:bg-red-900",
  },
  orange: {
    1: "bg-orange-100 dark:bg-orange-900/30",
    2: "bg-orange-300 dark:bg-orange-900/60",
    3: "bg-orange-500 dark:bg-orange-900",
  },
  amber: {
    1: "bg-amber-100 dark:bg-amber-900/30",
    2: "bg-amber-300 dark:bg-amber-900/60",
    3: "bg-amber-500 dark:bg-amber-900",
  },
  yellow: {
    1: "bg-yellow-100 dark:bg-yellow-900/30",
    2: "bg-yellow-300 dark:bg-yellow-900/60",
    3: "bg-yellow-500 dark:bg-yellow-900",
  },
  lime: {
    1: "bg-lime-100 dark:bg-lime-900/30",
    2: "bg-lime-300 dark:bg-lime-900/60",
    3: "bg-lime-500 dark:bg-lime-900",
  },
  green: {
    1: "bg-green-100 dark:bg-green-900/30",
    2: "bg-green-300 dark:bg-green-900/60",
    3: "bg-green-500 dark:bg-green-900",
  },
  emerald: {
    1: "bg-emerald-100 dark:bg-emerald-900/30",
    2: "bg-emerald-300 dark:bg-emerald-900/60",
    3: "bg-emerald-500 dark:bg-emerald-900",
  },
  teal: {
    1: "bg-teal-100 dark:bg-teal-900/30",
    2: "bg-teal-300 dark:bg-teal-900/60",
    3: "bg-teal-500 dark:bg-teal-900",
  },
  cyan: {
    1: "bg-cyan-100 dark:bg-cyan-900/30",
    2: "bg-cyan-300 dark:bg-cyan-900/60",
    3: "bg-cyan-500 dark:bg-cyan-900",
  },
  sky: {
    1: "bg-sky-100 dark:bg-sky-900/30",
    2: "bg-sky-300 dark:bg-sky-900/60",
    3: "bg-sky-500 dark:bg-sky-900",
  },
  blue: {
    1: "bg-blue-100 dark:bg-blue-900/30",
    2: "bg-blue-300 dark:bg-blue-900/60",
    3: "bg-blue-500 dark:bg-blue-900",
  },
  indigo: {
    1: "bg-indigo-100 dark:bg-indigo-900/30",
    2: "bg-indigo-300 dark:bg-indigo-900/60",
    3: "bg-indigo-500 dark:bg-indigo-900",
  },
  violet: {
    1: "bg-violet-100 dark:bg-violet-900/30",
    2: "bg-violet-300 dark:bg-violet-900/60",
    3: "bg-violet-500 dark:bg-violet-900",
  },
  purple: {
    1: "bg-purple-100 dark:bg-purple-900/30",
    2: "bg-purple-300 dark:bg-purple-900/60",
    3: "bg-purple-500 dark:bg-purple-900",
  },
  fuchsia: {
    1: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    2: "bg-fuchsia-300 dark:bg-fuchsia-900/60",
    3: "bg-fuchsia-500 dark:bg-fuchsia-900",
  },
  pink: {
    1: "bg-pink-100 dark:bg-pink-900/30",
    2: "bg-pink-300 dark:bg-pink-900/60",
    3: "bg-pink-500 dark:bg-pink-900",
  },
  rose: {
    1: "bg-rose-100 dark:bg-rose-900/30",
    2: "bg-rose-300 dark:bg-rose-900/60",
    3: "bg-rose-500 dark:bg-rose-900",
  },
} as const;

type ColorName = keyof typeof COLOR_LEVELS;

export function getCompletionColorClass(colorTheme: string, count: number): string {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";

  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  if (!colorMatch) return colorTheme;

  const colorName = colorMatch[1] as ColorName;
  const levels = COLOR_LEVELS[colorName];
  if (!levels) return colorTheme;

  // Direct 1:1 mapping to 3 levels
  const level = Math.min(count, 3);
  return levels[level as keyof typeof levels];
}
