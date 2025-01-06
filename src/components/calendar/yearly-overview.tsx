import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { XLogo } from "@/components/ui/x-logo";
import { eachDayOfInterval, format, getDay, subYears } from "date-fns";
import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo } from "react";

import { Id } from "@server/convex/_generated/dataModel";

import { YearlyOverviewSkeleton } from "./calendar-skeletons";

/**
 * YearlyOverview Component
 * Displays a GitHub-style contribution graph showing habit completions over the past year.
 * The graph uses different shades of red to indicate completion intensity per day.
 */

// Type definitions for the component's props
interface YearlyOverviewProps {
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  habits: Array<{
    _id: Id<"habits">;
    name: string;
    calendarId: Id<"calendars">;
  }>;
  calendars: Array<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  }>;
  isLoading?: boolean;
}

export const YearlyOverview = ({ completions, isLoading = false }: YearlyOverviewProps) => {
  const t = useTranslations("calendar.yearlyOverview");

  // Calculate and memoize the calendar grid structure and month labels
  // This only needs to be calculated once since it's based on static dates
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const yearAgo = subYears(today, 1);
    // Generate array of dates for the past year in yyyy-MM-dd format
    const days = eachDayOfInterval({ start: yearAgo, end: today }).map((date) => format(date, "yyyy-MM-dd"));

    // Create week arrays with padding for proper calendar alignment
    const firstDayOfWeek = getDay(yearAgo);
    const emptyStartDays = Array(firstDayOfWeek).fill(null);
    const weeks: (string | null)[][] = [];
    let currentWeek: (string | null)[] = [...emptyStartDays];

    // Group days into weeks of 7
    days.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    // Pad the last week with null values if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    // Generate month labels for the calendar header
    const monthLabels = [];
    const firstMonth = new Date(yearAgo);
    firstMonth.setDate(1);

    let currentDate = firstMonth;
    while (monthLabels.length <= 12) {
      const month = format(currentDate, "MMM").toLowerCase();
      monthLabels.push({
        key: `${format(currentDate, "MMM yyyy")}-${monthLabels.length}`,
        label: t(`months.${month.slice(0, 3)}`),
      });
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return { weeks, monthLabels };
  }, [t]);

  // Calculate and memoize the number of completions per day
  const completionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    completions.forEach((completion) => {
      const date = new Date(completion.completedAt);
      const dateKey = format(date, "yyyy-MM-dd");
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return counts;
  }, [completions]);

  // Determine the color intensity based on the number of completions
  const getColorClass = useCallback((count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "fill-red-500/40 dark:fill-red-500/40";
    if (count <= 3) return "fill-red-500/70 dark:fill-red-500/70";
    if (count <= 5) return "fill-red-500/80 dark:fill-red-500/80";
    if (count <= 8) return "fill-red-500/90 dark:fill-red-500/90";
    return "fill-red-500 dark:fill-red-500";
  }, []);

  // Memoized grid cell component for better performance
  // Renders either an empty cell, a blank day, or a completion indicator
  const GridCell = memo(({ day }: { day: string | null }) => {
    if (!day) return <div className="aspect-square w-[5px] sm:w-[11px] md:w-[13px] xl:w-4" />;

    const count = completionCounts[day] || 0;
    const colorClass = getColorClass(count);
    const date = new Date(day);
    const formattedDate = `${t(`months.${format(date, "MMM").toLowerCase()}`)} ${format(date, "d, yyyy")}`;

    // Render empty cell for days with no completions
    if (count === 0) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`aspect-square w-[5px] rounded-full sm:w-[11px] md:w-[13px] xl:w-4 ${colorClass}`} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltip", { date: formattedDate, count })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Render completion indicator for days with completions
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative aspect-square w-[5px] transition-colors hover:opacity-80 sm:w-[11px] md:w-[13px] xl:w-4">
              <svg viewBox="0 0 15 15" className={`h-full w-full ${colorClass}`}>
                <XLogo />
              </svg>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("tooltip", { date: formattedDate, count })}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  });
  GridCell.displayName = "GridCell";

  // Calculate total number of completions for the year
  const totalCompletions = useMemo(() => {
    return Object.values(completionCounts).reduce((sum, count) => sum + count, 0);
  }, [completionCounts]);

  if (isLoading) {
    return <YearlyOverviewSkeleton />;
  }

  return (
    <div className="mt-2 flex flex-col items-center sm:mt-4">
      <div className="w-[350px] pb-1 pl-2 text-[5px] text-muted-foreground/75 sm:w-[700px] sm:text-[8px] md:w-[800px] md:text-[10px] xl:w-[1000px] xl:text-xs">
        <span className="font-bold">{t("title")}</span>{" "}
        <span className="text-muted-foreground/75">{t("thingsDone", { count: totalCompletions })}</span>
      </div>
      <Card className="mx-auto mb-4 w-fit rounded-lg p-1 shadow-md xl:mb-16 xl:w-[1000px] xl:rounded-2xl xl:p-2 xl:pb-4">
        <div className="w-full">
          <div className="flex justify-end">
            {/* Left day labels (Mon/Wed/Fri) */}
            <div className="mt-3 flex flex-col pr-1 text-muted-foreground/75 md:mt-4 xl:mt-6">
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.mon")}
              </div>
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.wed")}
              </div>
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-right text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.fri")}
              </div>
            </div>
            <div className="flex-1">
              {/* Month labels row */}
              <div className="mx-auto flex justify-center pb-[2px] text-[5px] text-muted-foreground sm:text-[8px] md:text-[10px] xl:pb-2 xl:text-xs">
                {monthLabels.map((month, index) => (
                  <div key={month.key} className={`${index === 0 ? "mr-auto pl-1" : "flex-1 text-center"}`}>
                    {month.label}
                  </div>
                ))}
              </div>
              {/* Main contribution grid */}
              <div className="flex justify-start gap-[1px] pl-0">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[1px]">
                    {week.map((day, dayIndex) => (
                      <GridCell key={day || `empty-${weekIndex}-${dayIndex}`} day={day} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Right day labels (Mon/Wed/Fri) */}
            <div className="mt-3 flex flex-col pl-1 text-muted-foreground/75 md:mt-4 xl:mt-6">
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.mon")}
              </div>
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.wed")}
              </div>
              <div className="h-[3px] md:h-[12px] xl:h-[18px]" />
              <div className="text-left text-[5px] text-muted-foreground/75 sm:text-[8px] md:text-[10px] xl:text-xs">
                {t("days.fri")}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
