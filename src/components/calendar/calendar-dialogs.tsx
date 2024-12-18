import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface NewCalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
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
        <div className="grid gap-4 py-4">
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
            <div className="grid grid-cols-6 gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full transition-all ${c.value} ${
                    color === c.value ? "ring-2 ring-offset-2" : ""
                  }`}
                  onClick={() => onColorChange(c.value)}
                />
              ))}
            </div>
          </div>
          <Button onClick={onSubmit}>Create Calendar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface NewHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
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
        <div className="grid gap-4 py-4">
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
          <Button onClick={onSubmit}>Add Habit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditCalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
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
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="edit-calendar-name">Calendar Name</Label>
            <Input id="edit-calendar-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
          </div>
          <div>
            <Label>Color Theme</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full transition-all ${c.value} ${
                    color === c.value ? "ring-2 ring-offset-2" : ""
                  }`}
                  onClick={() => onColorChange(c.value)}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              Save Changes
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditHabitDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
  onDelete: () => void;
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
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="edit-habit-name">Habit Name</Label>
            <Input id="edit-habit-name" value={name} onChange={(e) => onNameChange(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSubmit} className="flex-1">
              Save Changes
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
