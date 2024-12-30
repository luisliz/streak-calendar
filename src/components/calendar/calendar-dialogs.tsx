import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Available color themes for calendars.
 * Each color uses Tailwind's color classes with 500 shade.
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
 * Dialog for creating a new calendar.
 * Allows users to set a name and choose a color theme.
 */
interface NewCalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string; // Current calendar name input value
  onNameChange: (name: string) => void; // Callback when name changes
  color: string; // Selected color theme
  onColorChange: (color: string) => void; // Callback when color changes
  onSubmit: () => void; // Callback when form is submitted
  onKeyDown: (e: React.KeyboardEvent) => void; // Keyboard event handler (e.g., for Enter key)
}

export const NewCalendarDialog = ({
  isOpen,
  onOpenChange,
  name,
  onNameChange,
  color,
  onColorChange,
  onSubmit,
  onKeyDown,
}: NewCalendarDialogProps) => {
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
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
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
 * Dialog for adding a new habit to a calendar.
 * Simpler than calendar dialog - only requires a name.
 */
interface NewHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string; // Current habit name input value
  onNameChange: (name: string) => void; // Callback when name changes
  onSubmit: () => void; // Callback when form is submitted
  onKeyDown: (e: React.KeyboardEvent) => void; // Keyboard event handler
}

export const NewHabitDialog = ({
  isOpen,
  onOpenChange,
  name,
  onNameChange,
  onSubmit,
  onKeyDown,
}: NewHabitDialogProps) => {
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
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g., Morning Run"
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
 * Dialog for editing an existing calendar.
 * Similar to new calendar dialog but includes delete option.
 */
interface EditCalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string; // Current calendar name
  onNameChange: (name: string) => void; // Callback when name changes
  color: string; // Current color theme
  onColorChange: (color: string) => void; // Callback when color changes
  onSubmit: () => void; // Callback to save changes
  onDelete: () => void; // Callback to delete calendar
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Calendar</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="edit-calendar-name">Calendar Name</Label>
            <Input id="edit-calendar-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
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
 * Dialog for editing an existing habit.
 * Similar to new habit dialog but includes delete option.
 */
interface EditHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string; // Current habit name
  onNameChange: (name: string) => void; // Callback when name changes
  onSubmit: () => void; // Callback to save changes
  onDelete: () => void; // Callback to delete habit
}

export const EditHabitDialog = ({
  isOpen,
  onOpenChange,
  name,
  onNameChange,
  onSubmit,
  onDelete,
}: EditHabitDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="edit-habit-name">Habit Name</Label>
            <Input id="edit-habit-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
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
