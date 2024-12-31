/**
 * This module contains dialog components for managing calendars and habits.
 * It provides interfaces for creating, editing, and deleting both calendars and habits.
 * All dialogs use shadcn/ui components for consistent styling and behavior.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

/**
 * Available color themes for calendars using Tailwind's color system.
 * Each color is defined with a human-readable name and corresponding Tailwind class.
 * All colors use the 500 shade for consistency in the UI.
 */
export const COLORS = [
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Lime", value: "bg-lime-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Violet", value: "bg-violet-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Fuchsia", value: "bg-fuchsia-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Rose", value: "bg-rose-500" },
];

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
 * @param onKeyDown - Keyboard event handler (e.g., for Enter key submission)
 * @param onNameChange - Handler for name input changes
 * @param onOpenChange - Handler for dialog open/close state
 * @param onSubmit - Handler for form submission
 */
interface NewCalendarDialogProps {
  color: string;
  isOpen: boolean;
  name: string;
  onColorChange: (color: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const NewCalendarDialog = ({
  color,
  isOpen,
  name,
  onColorChange,
  onKeyDown,
  onNameChange,
  onOpenChange,
  onSubmit,
}: NewCalendarDialogProps) => {
  const [localName, setLocalName] = useState(name);
  const debouncedName = useDebounce(localName);

  useEffect(() => {
    onNameChange(debouncedName);
  }, [debouncedName, onNameChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Calendar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="calendar-name">Calendar Name</Label>
            <Input
              id="calendar-name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g., Fitness Goals"
            />
          </div>
          <div>
            <Label>Color Theme</Label>
            <Select value={color} onValueChange={onColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color}`} />
                    {COLORS.find((c) => c.value === color)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${c.value}`} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              Create Calendar
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
  onKeyDown: (e: React.KeyboardEvent) => void;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onTimerDurationChange: (duration: number | undefined) => void;
  timerDuration: number | undefined;
}

export const NewHabitDialog = ({
  isOpen,
  name,
  onKeyDown,
  onNameChange,
  onOpenChange,
  onSubmit,
  onTimerDurationChange,
  timerDuration,
}: NewHabitDialogProps) => {
  const [localName, setLocalName] = useState(name);
  const [localDuration, setLocalDuration] = useState<string>(timerDuration?.toString() || "");
  const debouncedName = useDebounce(localName);
  const debouncedDuration = useDebounce(localDuration);

  useEffect(() => {
    onNameChange(debouncedName);
  }, [debouncedName, onNameChange]);

  useEffect(() => {
    const val = debouncedDuration ? parseInt(debouncedDuration) : undefined;
    if (!val || (val >= 1 && val <= 120)) {
      onTimerDurationChange(val);
    }
  }, [debouncedDuration, onTimerDurationChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g., Morning Run"
            />
          </div>
          <div>
            <Label htmlFor="timer-duration">Timer Duration (minutes)</Label>
            <Input
              id="timer-duration"
              type="number"
              min={1}
              max={120}
              value={localDuration}
              onChange={(e) => setLocalDuration(e.target.value)}
              placeholder="Optional timer duration"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              Add Habit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Dialog component for editing an existing calendar.
 * Similar to NewCalendarDialog but includes:
 * - Pre-filled values for name and color
 * - Additional delete option for removing the calendar
 * - Modified button layout with destructive delete action
 *
 * Changes are only applied when explicitly saved.
 */
interface EditCalendarDialogProps {
  color: string; // Current color theme
  isOpen: boolean;
  name: string; // Current calendar name
  onColorChange: (color: string) => void; // Callback when color changes
  onDelete: () => void; // Callback to delete calendar
  onNameChange: (name: string) => void; // Callback when name changes
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void; // Callback to save changes
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
  const [localName, setLocalName] = useState(name);
  const debouncedName = useDebounce(localName);

  useEffect(() => {
    onNameChange(debouncedName);
  }, [debouncedName, onNameChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Calendar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="edit-calendar-name">Calendar Name</Label>
            <Input id="edit-calendar-name" value={localName} onChange={(e) => setLocalName(e.target.value)} />
          </div>
          <div>
            <Label>Color Theme</Label>
            <Select value={color} onValueChange={onColorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a color">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color}`} />
                    {COLORS.find((c) => c.value === color)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${c.value}`} />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Dialog component for editing an existing habit.
 * Similar to NewHabitDialog but includes:
 * - Pre-filled values for name and timer duration
 * - Additional delete option for removing the habit
 * - Modified button layout with destructive delete action
 *
 * Timer duration remains optional and validates range (1-120 minutes).
 * Changes are only applied when explicitly saved.
 */
interface EditHabitDialogProps {
  isOpen: boolean;
  name: string;
  onDelete: () => void;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  onTimerDurationChange: (duration: number | undefined) => void;
  timerDuration: number | undefined;
}

export const EditHabitDialog = ({
  isOpen,
  name,
  onDelete,
  onNameChange,
  onOpenChange,
  onSubmit,
  onTimerDurationChange,
  timerDuration,
}: EditHabitDialogProps) => {
  const [localName, setLocalName] = useState(name);
  const [localDuration, setLocalDuration] = useState<string>(timerDuration?.toString() || "");
  const debouncedName = useDebounce(localName);
  const debouncedDuration = useDebounce(localDuration);

  useEffect(() => {
    onNameChange(debouncedName);
  }, [debouncedName, onNameChange]);

  useEffect(() => {
    const val = debouncedDuration ? parseInt(debouncedDuration) : undefined;
    if (!val || (val >= 1 && val <= 120)) {
      onTimerDurationChange(val);
    }
  }, [debouncedDuration, onTimerDurationChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="edit-habit-name">Habit Name</Label>
            <Input id="edit-habit-name" value={localName} onChange={(e) => setLocalName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="edit-timer-duration">Timer Duration (minutes)</Label>
            <Input
              id="edit-timer-duration"
              type="number"
              min={1}
              max={120}
              value={localDuration}
              onChange={(e) => setLocalDuration(e.target.value)}
              placeholder="Optional timer duration"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
            <Button onClick={onSubmit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
