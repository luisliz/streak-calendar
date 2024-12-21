const COLOR_LEVELS = {
  red: {
    1: "bg-red-100",
    2: "bg-red-200",
    3: "bg-red-300",
    4: "bg-red-400",
    5: "bg-red-500",
  },
  orange: {
    1: "bg-orange-100",
    2: "bg-orange-200",
    3: "bg-orange-300",
    4: "bg-orange-400",
    5: "bg-orange-500",
  },
  amber: {
    1: "bg-amber-100",
    2: "bg-amber-200",
    3: "bg-amber-300",
    4: "bg-amber-400",
    5: "bg-amber-500",
  },
  yellow: {
    1: "bg-yellow-100",
    2: "bg-yellow-200",
    3: "bg-yellow-300",
    4: "bg-yellow-400",
    5: "bg-yellow-500",
  },
  lime: {
    1: "bg-lime-100",
    2: "bg-lime-200",
    3: "bg-lime-300",
    4: "bg-lime-400",
    5: "bg-lime-500",
  },
  green: {
    1: "bg-green-100",
    2: "bg-green-200",
    3: "bg-green-300",
    4: "bg-green-400",
    5: "bg-green-500",
  },
  emerald: {
    1: "bg-emerald-100",
    2: "bg-emerald-200",
    3: "bg-emerald-300",
    4: "bg-emerald-400",
    5: "bg-emerald-500",
  },
  teal: {
    1: "bg-teal-100",
    2: "bg-teal-200",
    3: "bg-teal-300",
    4: "bg-teal-400",
    5: "bg-teal-500",
  },
  cyan: {
    1: "bg-cyan-100",
    2: "bg-cyan-200",
    3: "bg-cyan-300",
    4: "bg-cyan-400",
    5: "bg-cyan-500",
  },
  sky: {
    1: "bg-sky-100",
    2: "bg-sky-200",
    3: "bg-sky-300",
    4: "bg-sky-400",
    5: "bg-sky-500",
  },
  blue: {
    1: "bg-blue-100",
    2: "bg-blue-200",
    3: "bg-blue-300",
    4: "bg-blue-400",
    5: "bg-blue-500",
  },
  indigo: {
    1: "bg-indigo-100",
    2: "bg-indigo-200",
    3: "bg-indigo-300",
    4: "bg-indigo-400",
    5: "bg-indigo-500",
  },
  violet: {
    1: "bg-violet-100",
    2: "bg-violet-200",
    3: "bg-violet-300",
    4: "bg-violet-400",
    5: "bg-violet-500",
  },
  purple: {
    1: "bg-purple-100",
    2: "bg-purple-200",
    3: "bg-purple-300",
    4: "bg-purple-400",
    5: "bg-purple-500",
  },
  fuchsia: {
    1: "bg-fuchsia-100",
    2: "bg-fuchsia-200",
    3: "bg-fuchsia-300",
    4: "bg-fuchsia-400",
    5: "bg-fuchsia-500",
  },
  pink: {
    1: "bg-pink-100",
    2: "bg-pink-200",
    3: "bg-pink-300",
    4: "bg-pink-400",
    5: "bg-pink-500",
  },
  rose: {
    1: "bg-rose-100",
    2: "bg-rose-200",
    3: "bg-rose-300",
    4: "bg-rose-400",
    5: "bg-rose-500",
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
  // 1 completion -> level 1 (lightest)
  // 2 completions -> level 2
  // 3 completions -> level 3
  // 4 completions -> level 4
  // 5+ completions -> level 5 (darkest)
  const level = Math.min(count, 5);
  return levels[level as keyof typeof levels];
}
