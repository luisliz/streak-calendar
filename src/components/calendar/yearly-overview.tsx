import { Id } from "@server/convex/_generated/dataModel";

interface YearlyOverviewProps {
  habit: {
    _id: Id<"habits">;
  };
  color: string;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string) => void;
}

export const YearlyOverview = ({ habit, color, days, completions, onToggle }: YearlyOverviewProps) => {
  return (
    <div className="flex-1 overflow-x-auto">
      <div className="inline-flex gap-px bg-background border rounded-md p-1">
        {days.map((date) => {
          const timestamp = new Date(date).getTime();
          const isCompleted = completions.some(
            (completion) => completion.habitId === habit._id && completion.completedAt === timestamp
          );
          const formattedDate = new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          return (
            <button
              key={date}
              onClick={() => onToggle(habit._id, date)}
              className={`w-6 h-6 flex items-center justify-center rounded-sm transition-colors hover:opacity-80 ${
                isCompleted ? color : "bg-gray-200"
              }`}
              title={`${formattedDate}: ${isCompleted ? "Completed" : "Not completed"}`}
            />
          );
        })}
      </div>
    </div>
  );
};
