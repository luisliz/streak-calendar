"use client";

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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
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
 * Uses media queries to provide responsive sizing:
 * - Desktop (lg): 12px blocks, 4px margin
 * - Tablet (md): 10px blocks, 3px margin
 * - Mobile: 8px blocks, 2px margin
 */
function getCalendarSize() {
  if (typeof window === "undefined")
    return {
      blockSize: 5,
      blockMargin: 2,
      showLabels: false,
    };

  const isLg = window.matchMedia("(min-width: 1024px)").matches;
  const isMd = window.matchMedia("(min-width: 768px)").matches;

  if (isLg) return { blockSize: 12, blockMargin: 2, showLabels: true };
  if (isMd) return { blockSize: 8, blockMargin: 1, showLabels: true };
  return { blockSize: 6, blockMargin: 1, showLabels: false };
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
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
    // Level is calculated as ceil(count/2), capped at 4
    return Array.from(dates).map(([date, count]) => ({
      date,
      count,
      level: count > 0 ? Math.min(Math.ceil(count / 2), 4) : 0,
    }));
  }, [completions, habit._id, dateRange]);

  useEffect(() => {
    if (containerRef.current && calendarData.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }, 150);
    }
  }, [calendarData]);

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
      <Card className="my-8 border shadow-md">
        {/* Back navigation button */}
        <div className="flex items-center gap-2 p-2">
          <Button variant="ghost" onClick={() => router.push("/calendar")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("habit.edit.actions.back")}
          </Button>
        </div>

        <div className="mx-auto max-w-5xl p-6">
          <h1 className="mb-8 text-2xl font-bold">{name}</h1>
          {/* Activity calendar visualization with loading state */}
          <div className="mb-8">
            {!completions ? (
              // Loading skeleton
              <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted" />
            ) : calendarData.length > 0 ? (
              // Animated calendar container with horizontal scroll
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
                className="overflow-x-auto pb-4"
                ref={containerRef}
              >
                {/* Activity calendar component with responsive sizing and theme */}
                <div className="flex min-w-fit justify-center">
                  <ActivityCalendar
                    data={calendarData}
                    labels={{
                      totalCount: "{{count}} completions in the last year",
                    }}
                    showWeekdayLabels={calendarSize.showLabels}
                    weekStart={1}
                    blockSize={calendarSize.blockSize}
                    blockMargin={calendarSize.blockMargin}
                    fontSize={10}
                    hideColorLegend
                    theme={{
                      light: [
                        "var(--activity-level-0)",
                        "var(--activity-level-1)",
                        "var(--activity-level-2)",
                        "var(--activity-level-3)",
                        "var(--activity-level-4)",
                      ],
                      dark: [
                        "var(--activity-level-0)",
                        "var(--activity-level-1)",
                        "var(--activity-level-2)",
                        "var(--activity-level-3)",
                        "var(--activity-level-4)",
                      ],
                    }}
                  />
                </div>
              </motion.div>
            ) : null}
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
