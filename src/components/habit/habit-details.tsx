"use client";

import { DayCell } from "@/components/calendar/day-cell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { getCompletionCount } from "@/utils/completion-utils";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ThemeInput } from "react-activity-calendar";
import ActivityCalendar from "react-activity-calendar";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

/**
 * Client-side component for displaying and managing habit details.
 * Features include:
 * - Habit name and timer duration editing
 * - Activity visualization using a calendar heatmap
 * - Habit deletion with confirmation
 * - Responsive design for different screen sizes
 */

/**
 * Timer duration options in minutes.
 * Provides a range from 1 minute to 2 hours for habit timer settings.
 * Used in the timer duration dropdown selection.
 */
const TIMER_VALUES = [
  { key: "1min", value: 1 },
  { key: "2min", value: 2 },
  { key: "5min", value: 5 },
  { key: "10min", value: 10 },
  { key: "15min", value: 15 },
  { key: "20min", value: 20 },
  { key: "30min", value: 30 },
  { key: "45min", value: 45 },
  { key: "1hour", value: 60 },
  { key: "1_5hour", value: 90 },
  { key: "2hour", value: 120 },
];

/**
 * Props interface for the HabitDetails component
 */
interface HabitDetailsProps {
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  calendar: {
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  };
  onDelete: () => void;
}

/**
 * Determines calendar block size and margin based on viewport width.
 * Optimized for readability across all device sizes:
 * - Desktop (lg): 12px blocks with 2px margin
 * - Tablet (md): 10px blocks with 2px margin
 * - Mobile: 8px blocks with 1px margin
 */
function getCalendarSize() {
  if (typeof window === "undefined")
    return {
      blockSize: 8,
      blockMargin: 2,
      showLabels: false,
    };

  const isLg = window.matchMedia("(min-width: 1024px)").matches;
  const isMd = window.matchMedia("(min-width: 768px)").matches;

  if (isLg) return { blockSize: 12, blockMargin: 2, showLabels: true };
  if (isMd) return { blockSize: 10, blockMargin: 2, showLabels: true };
  return { blockSize: 8, blockMargin: 1, showLabels: false };
}

const habitTheme: ThemeInput = {
  light: [
    "rgb(124 124 124 / 0.1)",
    "rgb(239 68 68 / 0.3)",
    "rgb(239 68 68 / 0.5)",
    "rgb(239 68 68 / 0.7)",
    "rgb(239 68 68 / 0.85)",
  ],
  dark: [
    "rgb(124 124 124 / 0.1)",
    "rgb(239 68 68 / 0.3)",
    "rgb(239 68 68 / 0.5)",
    "rgb(239 68 68 / 0.7)",
    "rgb(239 68 68 / 0.85)",
  ],
};

/**
 * Props interface for the SingleMonthCalendar component
 */
interface SingleMonthCalendarProps {
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  color: string;
  completions: Array<{
    habitId: Id<"habits">;
    completedAt: number;
  }>;
  onToggle: (habitId: Id<"habits">, date: string, count: number) => void;
}

/**
 * Single month calendar component for habit details view
 */
function SingleMonthCalendar({ habit, color, completions, onToggle }: SingleMonthCalendarProps) {
  const t = useTranslations("calendar");

  // Get current month's days
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    return format(day, "yyyy-MM-dd");
  });

  // Get the date range for completions
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Set to end of today
  const start = new Date(end);
  start.setFullYear(start.getFullYear() - 1);
  const days = monthDays.filter((d) => {
    const date = new Date(d);
    return date >= start && date <= end;
  });

  // Calculate padding days
  const firstDay = new Date(monthDays[0]);
  const lastDay = new Date(monthDays[monthDays.length - 1]);
  const startPadding = firstDay.getDay();
  const endPadding = 6 - lastDay.getDay();
  const emptyStartDays = Array(startPadding).fill(null);
  const emptyEndDays = Array(endPadding).fill(null);

  // Get localized day and month names
  const dayLabels = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((d) => t(`weekDays.${d}`));
  const monthName = t(`monthNames.${format(firstDay, "MMMM").toLowerCase()}`);
  const year = format(firstDay, "yyyy");

  return (
    <Card className="max-w-[350px] border p-2 shadow-md">
      <div className="p-4">
        <h3 className="mb-4 text-center text-lg font-semibold">{`${monthName} ${year}`}</h3>
        <div className="mx-auto w-fit">
          <div className="grid grid-cols-7 gap-1">
            {/* Day name labels */}
            {dayLabels.map((label) => (
              <div key={label} className="text-center text-xs text-muted-foreground">
                {label}
              </div>
            ))}
            {/* Empty cells for start padding */}
            {emptyStartDays.map((_, index) => (
              <div key={`empty-start-${index}`} className="h-9 w-9">
                <div className="h-full w-full" />
              </div>
            ))}
            {/* Day cells with completion tracking */}
            {monthDays.map((dateStr) => {
              const isInRange = days.includes(dateStr);
              const count = getCompletionCount(dateStr, habit._id, completions);
              return (
                <div key={dateStr} className="h-9 w-9">
                  <DayCell
                    habitId={habit._id}
                    date={dateStr}
                    count={count}
                    onCountChange={(newCount) => onToggle(habit._id, dateStr, newCount)}
                    colorClass={color}
                    size="medium"
                    disabled={!isInRange}
                  />
                </div>
              );
            })}
            {/* Empty cells for end padding */}
            {emptyEndDays.map((_, index) => (
              <div key={`empty-end-${index}`} className="h-9 w-9">
                <div className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Main component for displaying and editing habit details.
 * Manages state for:
 * - Habit name and timer duration
 * - Delete confirmation dialog
 * - Activity calendar visualization
 * - Responsive calendar sizing
 */
export function HabitDetails({ habit }: HabitDetailsProps) {
  const t = useTranslations("dialogs");
  const tToast = useTranslations("toast");
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [name, setName] = useState(habit.name);
  const [timerDuration, setTimerDuration] = useState<number | undefined>(habit.timerDuration);
  const [calendarSize, setCalendarSize] = useState(getCalendarSize());
  const containerRef = useRef<HTMLDivElement>(null);

  const updateHabit = useMutation(api.habits.update);
  const deleteHabit = useMutation(api.habits.remove);
  const markComplete = useMutation(api.habits.markComplete);

  useEffect(() => {
    function handleResize() {
      setCalendarSize(getCalendarSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Memoized date range calculation for the activity calendar.
   * Calculates start and end dates for the past year's activity display.
   * Updates only when component mounts to prevent unnecessary recalculations.
   */
  const dateRange = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);

    return {
      startDate: start.getTime(),
      endDate: end.getTime(),
    };
  }, []);

  // Fetch completions for the activity calendar
  const completions = useQuery(api.habits.getCompletions, dateRange);

  /**
   * Transforms habit completion data into activity calendar format.
   * Process:
   * 1. Creates a map with zero counts for all dates in range
   * 2. Counts completions per day for the specific habit
   * 3. Converts to activity calendar format with level calculations
   * Level is calculated as ceil(count/2), capped at 4
   */
  const calendarData = useMemo(() => {
    if (!completions) return [];

    // Initialize map with zero counts for all dates in range
    const dates = new Map();
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.set(d.toISOString().split("T")[0], 0);
    }

    // Count completions per day
    completions
      .filter((completion) => completion.habitId === habit._id)
      .forEach((completion) => {
        const date = new Date(completion.completedAt).toISOString().split("T")[0];
        if (dates.has(date)) {
          dates.set(date, (dates.get(date) || 0) + 1);
        }
      });

    // Convert to activity calendar format
    const calendarDataResult = Array.from(dates).map(([date, count]) => {
      // Force distinct levels based on count
      let level;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else level = 4;

      if (count > 0) {
        console.log(`Date: ${date}, Count: ${count}, Level: ${level}`);
      }
      return {
        date,
        count,
        level,
      };
    });

    // Debug log a sample of high-count days
    const highCountDays = calendarDataResult.filter((d) => d.count > 1);
    if (highCountDays.length > 0) {
      console.log("High count days:", highCountDays);
    }

    return calendarDataResult;
  }, [completions, habit._id, dateRange]);

  /**
   * Handles habit updates with optimistic navigation.
   * Validates input, updates the habit, shows success/error toast,
   * and navigates back to calendar view.
   */
  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await updateHabit({
        id: habit._id,
        name,
        timerDuration,
      });
      toast({ description: tToast("habit.updated") });
      router.push("/calendar");
    } catch (error) {
      toast({
        description: `Failed to update habit: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  /**
   * Handles habit deletion with optimistic UI update.
   * Flow:
   * 1. Closes delete confirmation dialog
   * 2. Navigates away immediately for better UX
   * 3. Performs actual deletion
   * 4. Shows success/error toast
   */
  const handleDelete = async () => {
    try {
      setShowDeleteAlert(false);
      router.replace("/calendar");
      await new Promise((resolve) => setTimeout(resolve, 0));
      await deleteHabit({ id: habit._id });
      toast({ description: tToast("habit.deleted"), variant: "destructive" });
    } catch (error) {
      toast({
        description: `Failed to delete habit: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Main card container with navigation and content */}
      {/* Back navigation button */}
      <div className="flex items-center gap-2 p-2">
        <Button variant="ghost" onClick={() => router.push("/calendar")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("habit.edit.actions.back")}
        </Button>
      </div>

      {/* Habit title */}
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">{name}</h1>
      </div>

      {/* Calendar and Statistics Section */}
      <div className="mx-auto max-w-[7xl] space-y-8 md:space-y-6 lg:flex lg:items-start lg:justify-center lg:space-x-6 lg:space-y-0">
        {/* Monthly Calendar Container */}
        <div className="mx-auto w-full max-w-[300px] lg:mx-0 lg:w-[300px]">
          <SingleMonthCalendar
            habit={habit}
            color="bg-red-500"
            completions={completions ?? []}
            onToggle={async (habitId, date, count) => {
              try {
                const completedAt = new Date(date).getTime();
                await markComplete({ habitId, completedAt, count });
              } catch (error) {
                toast({
                  description: `Failed to update completion: ${error instanceof Error ? error.message : "Unknown error"}`,
                  variant: "destructive",
                });
              }
            }}
          />
        </div>

        {/* Activity Calendar and Statistics Container */}
        <div className="mx-auto w-[800px] space-y-4">
          {/* Activity Calendar Card */}
          {!completions ? (
            <Skeleton className="h-[150px] w-full" />
          ) : calendarData.length > 0 ? (
            <Card className="border p-2 shadow-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
                onAnimationComplete={() => {
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      left: containerRef.current.scrollWidth,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <div className="overflow-x-auto" ref={containerRef}>
                  <div className="inline-block">
                    <ActivityCalendar
                      data={calendarData}
                      labels={{
                        totalCount: "{{count}} completions in the last year",
                      }}
                      showWeekdayLabels={true}
                      blockRadius={20}
                      hideColorLegend={true}
                      hideTotalCount={true}
                      weekStart={0}
                      blockSize={calendarSize.blockSize}
                      blockMargin={calendarSize.blockMargin}
                      fontSize={10}
                      maxLevel={4}
                      theme={habitTheme}
                    />
                  </div>
                </div>
              </motion.div>
            </Card>
          ) : null}

          {/* Statistics Card */}
          <Card className="w-[800px] border p-2 shadow-md">
            <div className="p-4">
              <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Completions Counter */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Completions</p>
                  <p className="text-2xl font-bold">
                    {completions?.filter((c) => c.habitId === habit._id).length ?? 0}
                  </p>
                </div>
                {/* Current Month Stats */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {completions?.filter((c) => {
                      const date = new Date(c.completedAt);
                      const now = new Date();
                      return (
                        c.habitId === habit._id &&
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                      );
                    }).length ?? 0}
                  </p>
                </div>
                {/* Current Streak Calculator */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      if (!completions) return 0;

                      // Get all completion dates for this habit
                      const dates = completions
                        .filter((c) => c.habitId === habit._id)
                        .map((c) => new Date(c.completedAt).toISOString().split("T")[0])
                        .sort();

                      if (dates.length === 0) return 0;

                      const today = new Date().toISOString().split("T")[0];
                      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

                      // Get unique dates (in case of multiple completions per day)
                      const uniqueDates = [...new Set(dates)];

                      // Start from the most recent date
                      let streak = 0;

                      // If neither today nor yesterday has completion, streak is 0
                      if (!uniqueDates.includes(today) && !uniqueDates.includes(yesterday)) {
                        return 0;
                      }

                      // Count backwards until we find a gap
                      for (let i = uniqueDates.length - 1; i >= 0; i--) {
                        const date = new Date(uniqueDates[i]);

                        // If this is not the first date we're checking
                        if (i < uniqueDates.length - 1) {
                          const prevDate = new Date(uniqueDates[i + 1]);
                          const dayDiff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

                          // If gap is more than 1 day, break the streak
                          if (dayDiff > 1) break;
                        }

                        streak++;
                      }

                      return streak;
                    })()}
                  </p>
                </div>
                {/* Average Completions Calculator
                 * Shows average completions per active day
                 * Excludes days with no completions
                 */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Avg. Per Active Day</p>
                  <p className="text-2xl font-bold">
                    {(() => {
                      if (!completions) return "0.0";
                      const habitCompletions = completions.filter((c) => c.habitId === habit._id);
                      if (habitCompletions.length === 0) return "0.0";

                      const uniqueDays = new Set(
                        habitCompletions.map((c) => new Date(c.completedAt).toISOString().split("T")[0])
                      );

                      return (habitCompletions.length / uniqueDays.size).toFixed(1);
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Habit edit form card */}
      <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
        <div className="p-4">
          <h2 className="mb-6 text-lg font-semibold">{t("habit.edit.title")}</h2>
          <div className="space-y-4">
            {/* Habit name input field */}
            <div>
              <Label htmlFor="edit-habit-name">{t("habit.edit.name.label")}</Label>
              <Input id="edit-habit-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* Timer duration selection dropdown */}
            <div>
              <Label>{t("habit.edit.timer.label")}</Label>
              <Select
                value={timerDuration?.toString() ?? "none"}
                onValueChange={(value) => setTimerDuration(value === "none" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("habit.edit.timer.placeholder")} />
                </SelectTrigger>
                <SelectContent className="max-h-40">
                  <SelectItem value="none">{t("habit.edit.timer.noTimer")}</SelectItem>
                  {TIMER_VALUES.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {t(`timers.${duration.key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Action buttons container */}
            <div className="flex gap-2 pt-4">
              <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                {t("habit.edit.actions.delete")}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {t("habit.edit.actions.save")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("habit.edit.deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("habit.edit.deleteConfirm.description", { name })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("habit.edit.deleteConfirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("habit.edit.deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
