"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface Calendar {
  _id: Id<"calendars">;
  name: string;
  colorTheme: string;
  userId: string;
}

interface Habit {
  _id: Id<"habits">;
  name: string;
  userId: string;
  calendarId: Id<"calendars">;
}

const COLORS = [
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

const getDatesForRange = (daysBack: number) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack);

  const days = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    days.push(dateStr);
  }

  return {
    today,
    startDate,
    days,
  };
};

export default function CalendarsPage() {
  const { today, startDate, days } = useMemo(() => getDatesForRange(30), []);

  const calendarsQuery = useQuery(api.calendars.list);
  const habitsQuery = useQuery(api.habits.list, { calendarId: undefined });
  const completionsQuery = useQuery(api.habits.getCompletions, {
    startDate: startDate.getTime(),
    endDate: today.getTime(),
  });

  const createCalendar = useMutation(api.calendars.create);
  const createHabit = useMutation(api.habits.create);
  const markComplete = useMutation(api.habits.markComplete);

  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState(COLORS[0].value);
  const [newHabitName, setNewHabitName] = useState("");

  const calendars = calendarsQuery ?? [];
  const habits = habitsQuery ?? [];
  const completions = completionsQuery ?? [];

  const handleAddCalendar = async () => {
    if (!newCalendarName.trim()) return;

    await createCalendar({
      name: newCalendarName,
      colorTheme: newCalendarColor,
    });

    setNewCalendarName("");
    setNewCalendarColor(COLORS[0].value);
  };

  const handleAddHabit = async () => {
    if (!selectedCalendar || !newHabitName.trim()) return;

    await createHabit({
      name: newHabitName,
      calendarId: selectedCalendar._id,
    });

    setNewHabitName("");
  };

  const toggleHabitCompletion = async (habitId: Id<"habits">, date: string) => {
    const timestamp = new Date(date).getTime();
    await markComplete({
      habitId,
      completedAt: timestamp,
    });
  };

  const YearlyOverview = ({ habit, color }: { habit: Habit; color: string }) => {
    return (
      <div className="flex-1 overflow-x-auto">
        <div className="inline-flex gap-px bg-background border rounded-md p-1">
          {days.map((date) => {
            const timestamp = new Date(date).getTime();
            const isCompleted = completions.some(
              (completion) => completion.habitId === habit._id && completion.completedAt === timestamp
            );
            const formattedDate = new Date(date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });
            return (
              <button
                key={date}
                onClick={() => toggleHabitCompletion(habit._id, date)}
                className={`w-6 h-6 flex items-center justify-center rounded-sm transition-colors hover:opacity-80 ${
                  isCompleted ? color : "bg-gray-200"
                }`}
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
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`w-8 h-8 rounded-full transition-all ${color.value} ${
                          newCalendarColor === color.value ? "ring-2 ring-offset-2" : ""
                        }`}
                        onClick={() => setNewCalendarColor(color.value)}
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
            {calendars.map((calendar) => {
              const calendarHabits = habits.filter((habit) => habit.calendarId === calendar._id);
              return (
                <div key={calendar._id} className="rounded-lg border p-6">
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

                  {calendarHabits.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No habits added yet. Add one to start tracking!</p>
                  ) : (
                    <div className="space-y-1.5">
                      {calendarHabits.map((habit) => (
                        <div key={habit._id} className="flex items-center gap-4">
                          <h3 className="font-medium text-base w-48">{habit.name}</h3>
                          <YearlyOverview habit={habit} color={calendar.colorTheme} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
