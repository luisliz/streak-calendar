import { Id } from "@server/convex/_generated/dataModel";

export function getCompletionCount(
  date: string,
  habitId: Id<"habits">,
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>
) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  const dayStartTime = dayStart.getTime();
  const dayEndTime = dayEnd.getTime();

  return completions.filter(
    (completion) =>
      completion.habitId === habitId && completion.completedAt >= dayStartTime && completion.completedAt <= dayEndTime
  ).length;
}
