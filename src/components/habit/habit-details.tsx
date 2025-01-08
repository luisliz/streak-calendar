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
import { useEffect, useMemo, useState } from "react";
import ActivityCalendar from "react-activity-calendar";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

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

function getCalendarSize() {
  if (typeof window === "undefined") return { blockSize: 8, blockMargin: 2 };

  const isLg = window.matchMedia("(min-width: 1024px)").matches;
  const isMd = window.matchMedia("(min-width: 768px)").matches;

  if (isLg) return { blockSize: 12, blockMargin: 4 };
  if (isMd) return { blockSize: 10, blockMargin: 3 };
  return { blockSize: 8, blockMargin: 2 };
}

export function HabitDetails({ habit }: HabitDetailsProps) {
  const t = useTranslations("dialogs");
  const tToast = useTranslations("toast");
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [name, setName] = useState(habit.name);
  const [timerDuration, setTimerDuration] = useState<number | undefined>(habit.timerDuration);
  const [calendarSize, setCalendarSize] = useState(getCalendarSize());

  const updateHabit = useMutation(api.habits.update);
  const deleteHabit = useMutation(api.habits.remove);

  useEffect(() => {
    function handleResize() {
      setCalendarSize(getCalendarSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize date range
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

  // Transform completions into activity calendar data
  const calendarData = useMemo(() => {
    if (!completions) return [];

    // Create a map of all dates in the range
    const dates = new Map();
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.set(d.toISOString().split("T")[0], 0);
    }

    // Fill in completion counts
    completions
      .filter((completion) => completion.habitId === habit._id)
      .forEach((completion) => {
        const date = new Date(completion.completedAt).toISOString().split("T")[0];
        if (dates.has(date)) {
          dates.set(date, (dates.get(date) || 0) + 1);
        }
      });

    // Convert to required format
    return Array.from(dates).map(([date, count]) => ({
      date,
      count,
      level: count > 0 ? Math.min(Math.ceil(count / 2), 4) : 0,
    }));
  }, [completions, habit._id, dateRange]);

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
      <Card className="my-8 border shadow-md">
        <div className="flex items-center gap-2 p-2">
          <Button variant="ghost" onClick={() => router.push("/calendar")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("habit.edit.actions.back")}
          </Button>
        </div>

        <div className="mx-auto max-w-5xl p-6">
          <h1 className="mb-8 text-2xl font-bold">{name}</h1>
          <div className="mb-8">
            {!completions ? (
              <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted" />
            ) : calendarData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
                className="overflow-x-auto pb-4"
              >
                <ActivityCalendar
                  data={calendarData}
                  labels={{
                    totalCount: "{{count}} completions in the last year",
                  }}
                  showWeekdayLabels
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
              </motion.div>
            ) : null}
          </div>
        </div>

        <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
          <div className="p-4">
            <h2 className="mb-6 text-lg font-semibold">{t("habit.edit.title")}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-habit-name">{t("habit.edit.name.label")}</Label>
                <Input id="edit-habit-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
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
