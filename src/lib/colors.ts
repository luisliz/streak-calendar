const COLOR_LEVELS = {
  red: {
    1: "bg-red-100",
    2: "bg-red-200",
    3: "bg-red-300",
    4: "bg-red-400",
    5: "bg-red-500",
  },
  blue: {
    1: "bg-blue-100",
    2: "bg-blue-200",
    3: "bg-blue-300",
    4: "bg-blue-400",
    5: "bg-blue-500",
  },
  green: {
    1: "bg-green-100",
    2: "bg-green-200",
    3: "bg-green-300",
    4: "bg-green-400",
    5: "bg-green-500",
  },
  yellow: {
    1: "bg-yellow-100",
    2: "bg-yellow-200",
    3: "bg-yellow-300",
    4: "bg-yellow-400",
    5: "bg-yellow-500",
  },
  purple: {
    1: "bg-purple-100",
    2: "bg-purple-200",
    3: "bg-purple-300",
    4: "bg-purple-400",
    5: "bg-purple-500",
  },
  pink: {
    1: "bg-pink-100",
    2: "bg-pink-200",
    3: "bg-pink-300",
    4: "bg-pink-400",
    5: "bg-pink-500",
  },
  indigo: {
    1: "bg-indigo-100",
    2: "bg-indigo-200",
    3: "bg-indigo-300",
    4: "bg-indigo-400",
    5: "bg-indigo-500",
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

  // Map count directly to level (1-5), capping at 5
  const level = Math.min(count, 5);
  return levels[level as keyof typeof levels];
}
