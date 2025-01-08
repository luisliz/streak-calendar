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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * This module contains dialog components for managing calendars and habits.
 * It provides interfaces for creating, editing, and deleting both calendars and habits.
 * All dialogs use shadcn/ui components for consistent styling and behavior.
 */

/**
 * Available color themes for calendars using Tailwind's color system.
 * Each color is defined with a human-readable name and corresponding Tailwind class.
 * All colors use the 500 shade for consistency in the UI.
 */

const COLOR_VALUES = [
  { key: "red", value: "bg-red-500" },
  { key: "orange", value: "bg-orange-500" },
  { key: "amber", value: "bg-amber-500" },
  { key: "yellow", value: "bg-yellow-500" },
  { key: "lime", value: "bg-lime-500" },
  { key: "green", value: "bg-green-500" },
  { key: "emerald", value: "bg-emerald-500" },
  { key: "teal", value: "bg-teal-500" },
  { key: "cyan", value: "bg-cyan-500" },
  { key: "sky", value: "bg-sky-500" },
  { key: "blue", value: "bg-blue-500" },
  { key: "indigo", value: "bg-indigo-500" },
  { key: "violet", value: "bg-violet-500" },
  { key: "purple", value: "bg-purple-500" },
  { key: "fuchsia", value: "bg-fuchsia-500" },
  { key: "pink", value: "bg-pink-500" },
  { key: "rose", value: "bg-rose-500" },
];

/**
 * Predefined timer durations in minutes.
 * Starts with short durations and increases by 15-minute intervals up to 2 hours.
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

function useColors() {
  const t = useTranslations("dialogs.colors");
  return COLOR_VALUES.map(({ key, value }) => ({
    name: t(key),
    value,
  }));
}

function useTimerDurations() {
  const t = useTranslations("dialogs.timers");
  return TIMER_VALUES.map(({ key, value }) => ({
    name: t(key),
    value,
  }));
}

/**
 * Dialog component for creating a new calendar.
 * Provides form fields for:
 * - Calendar name input
 * - Color theme selection from predefined options
 * - Submit and cancel actions
 *
 * @param color - Currently selected color theme
 * @param isOpen - Dialog visibility state
 * @param name - Current value of calendar name input
 * @param onColorChange - Handler for color selection changes
 * @param onNameChange - Handler for name input changes
 * @param onOpenChange - Handler for dialog open/close state
 * @param onSubmit - Handler for form submission
 */
interface NewCalendarDialogProps {
  color: string;
  isOpen: boolean;
  name: string;
  onColorChange: (color: string) => void;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const NewCalendarDialog = ({
  color,
  isOpen,
  name,
  onColorChange,
  onNameChange,
  onOpenChange,
  onSubmit,
}: NewCalendarDialogProps) => {
  const t = useTranslations("dialogs");
  const colors = useColors();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("calendar.new.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="calendar-name">{t("calendar.new.name.label")}</Label>
            <Input
              id="calendar-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t("calendar.new.name.placeholder")}
            />
          </div>
          <div>
            <Label>{t("calendar.new.color.label")}</Label>
            <Select value={color} onValueChange={onColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("calendar.new.color.label")}>
                  <div className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${color}`} />
                    {colors.find((c) => c.value === color)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${c.value}`} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t("calendar.new.actions.cancel")}
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              {t("calendar.new.actions.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Dialog component for creating a new habit within a calendar.
 * Provides form fields for:
 * - Habit name input
 * - Optional timer duration in minutes (1-120 range)
 * - Submit and cancel actions
 *
 * The timer duration is optional and can be used for timed habits
 * like meditation or exercise routines.
 */
interface NewHabitDialogProps {
  isOpen: boolean;
  name: string;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onTimerDurationChange: (duration: number | undefined) => void;
  timerDuration: number | undefined;
}

export const NewHabitDialog = ({
  isOpen,
  name,
  onNameChange,
  onOpenChange,
  onSubmit,
  onTimerDurationChange,
  timerDuration,
}: NewHabitDialogProps) => {
  const t = useTranslations("dialogs");
  const timerDurations = useTimerDurations();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("habit.new.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="habit-name">{t("habit.new.name.label")}</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder={t("habit.new.name.placeholder")}
            />
          </div>
          <div>
            <Label>{t("habit.new.timer.label")}</Label>
            <Select
              value={timerDuration?.toString() ?? "none"}
              onValueChange={(value) => onTimerDurationChange(value === "none" ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("habit.new.timer.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("habit.new.timer.noTimer")}</SelectItem>
                {timerDurations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value.toString()}>
                    {duration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {t("habit.new.actions.cancel")}
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              {t("habit.new.actions.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Dialog component for editing an existing calendar.
 * Similar to NewCalendarDialog but includes delete option.
 */
interface EditCalendarDialogProps {
  color: string;
  isOpen: boolean;
  name: string;
  onColorChange: (color: string) => void;
  onDelete: () => void;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const EditCalendarDialog = ({
  isOpen,
  onOpenChange,
  name,
  onNameChange,
  color,
  onColorChange,
  onSubmit,
  onDelete,
}: EditCalendarDialogProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const t = useTranslations("dialogs");
  const colors = useColors();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("calendar.edit.title")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="edit-calendar-name">{t("calendar.edit.name.label")}</Label>
              <Input id="edit-calendar-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
            </div>
            <div>
              <Label>{t("calendar.edit.color.label")}</Label>
              <Select value={color} onValueChange={onColorChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("calendar.edit.color.label")}>
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${color}`} />
                      {colors.find((c) => c.value === color)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${c.value}`} />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                {t("calendar.edit.actions.cancel")}
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                {t("calendar.edit.actions.delete")}
              </Button>
              <Button onClick={onSubmit} className="flex-1">
                {t("calendar.edit.actions.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("calendar.edit.deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("calendar.edit.deleteConfirm.description", { name })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("calendar.edit.deleteConfirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("calendar.edit.deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
