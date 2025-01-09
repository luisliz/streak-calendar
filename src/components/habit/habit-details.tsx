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
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

import { ActivityCalendar } from "./activity-calendar";

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

  const updateHabit = useMutation(api.habits.update);
  const deleteHabit = useMutation(api.habits.remove);
  const completions = useQuery(api.habits.getCompletions, {
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime(),
    endDate: new Date().getTime(),
  });

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

      {/* Habit details container */}
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex flex-col items-center">
          <h1 className="mb-8 text-2xl font-bold">{name}</h1>
          {/* Activity calendar visualization */}
          <div className="mb-8">
            <ActivityCalendar habitId={habit._id} completions={completions} />
          </div>
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
