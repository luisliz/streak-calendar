import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Id } from "@server/convex/_generated/dataModel";

import { MonthGridView } from "./month-grid-view";
import { MonthRowView } from "./month-row-view";

type CalendarViewType = "monthRow" | "monthGrid";

interface CalendarItemProps {
  calendar: {
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  };
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  }>;
  days: string[];
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onAddHabit: () => void;
  onEditCalendar: () => void;
  onEditHabit: (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => void;
  onToggleHabit: (habitId: Id<"habits">, date: string, count: number) => void;
  view: CalendarViewType;
}

export const CalendarItem = ({
  calendar,
  habits,
  days,
  completions,
  onAddHabit,
  onEditCalendar,
  onEditHabit,
  onToggleHabit,
  view,
}: CalendarItemProps) => {
  const t = useTranslations("calendar");
  const colorTheme = calendar.colorTheme.startsWith("bg-") ? calendar.colorTheme : `bg-${calendar.colorTheme}-500`;

  return (
    <div className="space-y-8">
      {/* Calendar Header Section */}
      <div className="flex justify-center">
        {/* Editable calendar name with hover effect */}
        <div
          className="group flex cursor-pointer items-center justify-center gap-2 pt-4 transition-colors hover:text-muted-foreground"
          onClick={onEditCalendar}
        >
          <h2
            className={`text-4xl font-semibold underline decoration-wavy decoration-4 ${colorTheme.replace(
              "bg-",
              "decoration-"
            )}`}
          >
            {calendar.name}
          </h2>
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            <Pencil className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* Main Calendar Content */}
      {habits.length === 0 ? (
        // Empty state when no habits exist
        <div className="flex w-full flex-col items-center justify-center space-y-8 pb-16">
          <p className="text-sm text-muted-foreground">{t("emptyState.noHabits")}</p>
          <Button size="sm" onClick={onAddHabit}>
            {t("controls.addHabit")}
          </Button>
        </div>
      ) : view === "monthRow" ? (
        <MonthRowView
          habit={habits[0]}
          habits={habits}
          color={colorTheme}
          days={days}
          completions={completions}
          onToggle={onToggleHabit}
          onEditHabit={onEditHabit}
          onAddHabit={onAddHabit}
        />
      ) : (
        <MonthGridView
          habit={habits[0]}
          habits={habits}
          color={colorTheme}
          days={days}
          completions={completions}
          onToggle={onToggleHabit}
          onEditHabit={onEditHabit}
          onAddHabit={onAddHabit}
        />
      )}
    </div>
  );
};
