const COLOR_LEVELS = {
  red: {
    1: "bg-red-100 dark:bg-red-900/30",
    2: "bg-red-200 dark:bg-red-900/50",
    3: "bg-red-300 dark:bg-red-900/70",
    4: "bg-red-400 dark:bg-red-900/85",
    5: "bg-red-500 dark:bg-red-900",
  },
  orange: {
    1: "bg-orange-100 dark:bg-orange-900/30",
    2: "bg-orange-200 dark:bg-orange-900/50",
    3: "bg-orange-300 dark:bg-orange-900/70",
    4: "bg-orange-400 dark:bg-orange-900/85",
    5: "bg-orange-500 dark:bg-orange-900",
  },
  amber: {
    1: "bg-amber-100 dark:bg-amber-900/30",
    2: "bg-amber-200 dark:bg-amber-900/50",
    3: "bg-amber-300 dark:bg-amber-900/70",
    4: "bg-amber-400 dark:bg-amber-900/85",
    5: "bg-amber-500 dark:bg-amber-900",
  },
  yellow: {
    1: "bg-yellow-100 dark:bg-yellow-900/30",
    2: "bg-yellow-200 dark:bg-yellow-900/50",
    3: "bg-yellow-300 dark:bg-yellow-900/70",
    4: "bg-yellow-400 dark:bg-yellow-900/85",
    5: "bg-yellow-500 dark:bg-yellow-900",
  },
  lime: {
    1: "bg-lime-100 dark:bg-lime-900/30",
    2: "bg-lime-200 dark:bg-lime-900/50",
    3: "bg-lime-300 dark:bg-lime-900/70",
    4: "bg-lime-400 dark:bg-lime-900/85",
    5: "bg-lime-500 dark:bg-lime-900",
  },
  green: {
    1: "bg-green-100 dark:bg-green-900/30",
    2: "bg-green-200 dark:bg-green-900/50",
    3: "bg-green-300 dark:bg-green-900/70",
    4: "bg-green-400 dark:bg-green-900/85",
    5: "bg-green-500 dark:bg-green-900",
  },
  emerald: {
    1: "bg-emerald-100 dark:bg-emerald-900/30",
    2: "bg-emerald-200 dark:bg-emerald-900/50",
    3: "bg-emerald-300 dark:bg-emerald-900/70",
    4: "bg-emerald-400 dark:bg-emerald-900/85",
    5: "bg-emerald-500 dark:bg-emerald-900",
  },
  teal: {
    1: "bg-teal-100 dark:bg-teal-900/30",
    2: "bg-teal-200 dark:bg-teal-900/50",
    3: "bg-teal-300 dark:bg-teal-900/70",
    4: "bg-teal-400 dark:bg-teal-900/85",
    5: "bg-teal-500 dark:bg-teal-900",
  },
  cyan: {
    1: "bg-cyan-100 dark:bg-cyan-900/30",
    2: "bg-cyan-200 dark:bg-cyan-900/50",
    3: "bg-cyan-300 dark:bg-cyan-900/70",
    4: "bg-cyan-400 dark:bg-cyan-900/85",
    5: "bg-cyan-500 dark:bg-cyan-900",
  },
  sky: {
    1: "bg-sky-100 dark:bg-sky-900/30",
    2: "bg-sky-200 dark:bg-sky-900/50",
    3: "bg-sky-300 dark:bg-sky-900/70",
    4: "bg-sky-400 dark:bg-sky-900/85",
    5: "bg-sky-500 dark:bg-sky-900",
  },
  blue: {
    1: "bg-blue-100 dark:bg-blue-900/30",
    2: "bg-blue-200 dark:bg-blue-900/50",
    3: "bg-blue-300 dark:bg-blue-900/70",
    4: "bg-blue-400 dark:bg-blue-900/85",
    5: "bg-blue-500 dark:bg-blue-900",
  },
  indigo: {
    1: "bg-indigo-100 dark:bg-indigo-900/30",
    2: "bg-indigo-200 dark:bg-indigo-900/50",
    3: "bg-indigo-300 dark:bg-indigo-900/70",
    4: "bg-indigo-400 dark:bg-indigo-900/85",
    5: "bg-indigo-500 dark:bg-indigo-900",
  },
  violet: {
    1: "bg-violet-100 dark:bg-violet-900/30",
    2: "bg-violet-200 dark:bg-violet-900/50",
    3: "bg-violet-300 dark:bg-violet-900/70",
    4: "bg-violet-400 dark:bg-violet-900/85",
    5: "bg-violet-500 dark:bg-violet-900",
  },
  purple: {
    1: "bg-purple-100 dark:bg-purple-900/30",
    2: "bg-purple-200 dark:bg-purple-900/50",
    3: "bg-purple-300 dark:bg-purple-900/70",
    4: "bg-purple-400 dark:bg-purple-900/85",
    5: "bg-purple-500 dark:bg-purple-900",
  },
  fuchsia: {
    1: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    2: "bg-fuchsia-200 dark:bg-fuchsia-900/50",
    3: "bg-fuchsia-300 dark:bg-fuchsia-900/70",
    4: "bg-fuchsia-400 dark:bg-fuchsia-900/85",
    5: "bg-fuchsia-500 dark:bg-fuchsia-900",
  },
  pink: {
    1: "bg-pink-100 dark:bg-pink-900/30",
    2: "bg-pink-200 dark:bg-pink-900/50",
    3: "bg-pink-300 dark:bg-pink-900/70",
    4: "bg-pink-400 dark:bg-pink-900/85",
    5: "bg-pink-500 dark:bg-pink-900",
  },
  rose: {
    1: "bg-rose-100 dark:bg-rose-900/30",
    2: "bg-rose-200 dark:bg-rose-900/50",
    3: "bg-rose-300 dark:bg-rose-900/70",
    4: "bg-rose-400 dark:bg-rose-900/85",
    5: "bg-rose-500 dark:bg-rose-900",
  },
} as const;

type ColorName = keyof typeof COLOR_LEVELS;

export function getCompletionColorClass(colorTheme: string, count: number): string {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";

  // Extract color name from the theme (e.g., "bg-indigo-500" -> "indigo")
  const colorMatch = colorTheme.match(/bg-(\w+)-\d+/);
  if (!colorMatch) return colorTheme;

  const colorName = colorMatch[1] as ColorName;
  const levels = COLOR_LEVELS[colorName];
  if (!levels) return colorTheme;

  // Map count to intensity level:
  // Light mode: 100->500 (lighter to darker)
  // Dark mode: 900 with opacity 30%->100% (more transparent to solid)
  const level = Math.min(count, 5);
  return levels[level as keyof typeof levels];
}
