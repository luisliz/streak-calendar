"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
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

const CalendarSkeleton = () => (
  <div className="space-y-8">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex-1">
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

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
  const updateCalendar = useMutation(api.calendars.update);
  const updateHabit = useMutation(api.habits.update);
  const deleteCalendar = useMutation(api.calendars.remove);
  const deleteHabit = useMutation(api.habits.remove);

  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState(COLORS[0].value);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editCalendarName, setEditCalendarName] = useState("");
  const [editCalendarColor, setEditCalendarColor] = useState("");
  const [editHabitName, setEditHabitName] = useState("");
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false);
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);

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
    setIsNewCalendarOpen(false);
  };

  const handleAddHabit = async () => {
    if (!selectedCalendar || !newHabitName.trim()) return;

    await createHabit({
      name: newHabitName,
      calendarId: selectedCalendar._id,
    });

    setNewHabitName("");
    setIsNewHabitOpen(false);
  };

  const toggleHabitCompletion = async (habitId: Id<"habits">, date: string) => {
    const timestamp = new Date(date).getTime();
    await markComplete({
      habitId,
      completedAt: timestamp,
    });
  };

  const handleEditCalendar = async () => {
    if (!editingCalendar || !editCalendarName.trim()) return;
    await updateCalendar({
      id: editingCalendar._id,
      name: editCalendarName,
      colorTheme: editCalendarColor,
    });
    setEditingCalendar(null);
  };

  const handleEditHabit = async () => {
    if (!editingHabit || !editHabitName.trim()) return;
    await updateHabit({
      id: editingHabit._id,
      name: editHabitName,
    });
    setEditingHabit(null);
  };

  const handleDeleteCalendar = async () => {
    if (!editingCalendar) return;
    await deleteCalendar({ id: editingCalendar._id });
    setEditingCalendar(null);
  };

  const handleDeleteHabit = async () => {
    if (!editingHabit) return;
    await deleteHabit({ id: editingHabit._id });
    setEditingHabit(null);
  };

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCalendar();
    }
  };

  const handleHabitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddHabit();
    }
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
        {calendarsQuery === undefined ? (
          <CalendarSkeleton />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Your Calendars</h1>
              <Dialog open={isNewCalendarOpen} onOpenChange={setIsNewCalendarOpen}>
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
                        onKeyDown={handleCalendarKeyDown}
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
                        <div className="flex items-center gap-2 group">
                          <h2 className="text-2xl font-semibold">{calendar.name}</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setEditingCalendar(calendar);
                              setEditCalendarName(calendar.name);
                              setEditCalendarColor(calendar.colorTheme);
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                        <Dialog open={isNewHabitOpen} onOpenChange={setIsNewHabitOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedCalendar(calendar);
                                setIsNewHabitOpen(true);
                              }}
                            >
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
                                  onKeyDown={handleHabitKeyDown}
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
                              <div className="flex items-center gap-2 w-48 group">
                                <h3 className="font-medium text-base">{habit.name}</h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setEditingHabit(habit);
                                    setEditHabitName(habit.name);
                                  }}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
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
          </>
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

      <Dialog open={!!editingCalendar} onOpenChange={() => setEditingCalendar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Calendar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-calendar-name">Calendar Name</Label>
              <Input
                id="edit-calendar-name"
                value={editCalendarName}
                onChange={(e) => setEditCalendarName(e.target.value)}
              />
            </div>
            <div>
              <Label>Color Theme</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full transition-all ${color.value} ${
                      editCalendarColor === color.value ? "ring-2 ring-offset-2" : ""
                    }`}
                    onClick={() => setEditCalendarColor(color.value)}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditCalendar} className="flex-1">
                Save Changes
              </Button>
              <Button variant="destructive" onClick={handleDeleteCalendar}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingHabit} onOpenChange={() => setEditingHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-habit-name">Habit Name</Label>
              <Input id="edit-habit-name" value={editHabitName} onChange={(e) => setEditHabitName(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditHabit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="destructive" onClick={handleDeleteHabit}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
