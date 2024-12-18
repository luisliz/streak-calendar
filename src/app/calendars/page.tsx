"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

type Calendar = {
  id: string;
  name: string;
  color: string;
  habits: Habit[];
};

type Habit = {
  id: string;
  name: string;
  completions: { [date: string]: boolean };
};

const COLORS = [
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
];

export default function CalendarsPage() {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState(COLORS[0]);
  const [newHabitName, setNewHabitName] = useState("");

  const handleAddCalendar = () => {
    if (!newCalendarName.trim()) return;

    const newCalendar: Calendar = {
      id: crypto.randomUUID(),
      name: newCalendarName,
      color: newCalendarColor,
      habits: [],
    };

    setCalendars([...calendars, newCalendar]);
    setNewCalendarName("");
    setNewCalendarColor(COLORS[0]);
  };

  const handleAddHabit = () => {
    if (!selectedCalendar || !newHabitName.trim()) return;

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      completions: {},
    };

    const updatedCalendars = calendars.map((cal) =>
      cal.id === selectedCalendar.id ? { ...cal, habits: [...cal.habits, newHabit] } : cal
    );

    setCalendars(updatedCalendars);
    setNewHabitName("");
  };

  const toggleHabitCompletion = (calendarId: string, habitId: string, date: string) => {
    setCalendars((prevCalendars) =>
      prevCalendars.map((cal) =>
        cal.id === calendarId
          ? {
              ...cal,
              habits: cal.habits.map((habit) =>
                habit.id === habitId
                  ? {
                      ...habit,
                      completions: {
                        ...habit.completions,
                        [date]: !habit.completions[date],
                      },
                    }
                  : habit
              ),
            }
          : cal
      )
    );
  };

  const YearlyOverview = ({ habit, color }: { habit: Habit; color: string }) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    const days = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      days.push(dateStr);
    }

    return (
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-px bg-background border rounded-md p-1">
          {days.map((date) => {
            const isCompleted = habit.completions[date];
            const formattedDate = new Date(date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
            return (
              <button
                key={date}
                onClick={() => toggleHabitCompletion(selectedCalendar!.id, habit.id, date)}
                className="w-6 h-6 flex items-center justify-center rounded-sm transition-colors hover:opacity-80"
                style={{
                  backgroundColor: isCompleted ? color : "#e5e7eb",
                }}
                title={`${formattedDate}: ${isCompleted ? "Completed" : "Not completed"}`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container max-w-7xl px-4 py-8">
      <SignedIn>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Calendars</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Calendar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Calendar</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="calendar-name">Calendar Name</Label>
                  <Input
                    id="calendar-name"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                    placeholder="e.g., Fitness Goals"
                  />
                </div>
                <div>
                  <Label>Color Theme</Label>
                  <div className="flex gap-2 mt-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full transition-all ${
                          newCalendarColor === color ? "ring-2 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCalendarColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddCalendar}>Create Calendar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {calendars.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>You haven&apos;t created any calendars yet.</p>
            <p className="mt-2">Create one to start tracking your habits!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="rounded-lg border p-6" style={{ borderColor: calendar.color }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{calendar.name}</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedCalendar(calendar)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Habit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Habit</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="habit-name">Habit Name</Label>
                          <Input
                            id="habit-name"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="e.g., Morning Run"
                          />
                        </div>
                        <Button onClick={handleAddHabit}>Add Habit</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {calendar.habits.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
                ) : (
                  <div className="space-y-3">
                    {calendar.habits.map((habit) => (
                      <div key={habit.id} className="flex items-center gap-4">
                        <h3 className="font-medium text-base w-48">{habit.name}</h3>
                        <YearlyOverview habit={habit} color={calendar.color} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h2 className="text-xl font-semibold">Please sign in to view your calendars</h2>
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
