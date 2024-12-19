"use client";

import {
  EditCalendarDialog,
  EditHabitDialog,
  NewCalendarDialog,
  NewHabitDialog,
} from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

// Helper function to generate date range for habit tracking
// Returns today's date, start date, and array of date strings in ISO format
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

// Main calendar page component for managing habit tracking calendars and completions
export default function CalendarsPage() {
  // Generate 30-day date range for calendar view
  const { today, startDate, days } = useMemo(() => getDatesForRange(30), []);

  // Database queries for calendars, habits, and completions
  const calendarsQuery = useQuery(api.calendars.list);
  const habitsQuery = useQuery(api.habits.list, { calendarId: undefined });
  const completionsQuery = useQuery(api.habits.getCompletions, {
    startDate: startDate.getTime(),
    endDate: today.getTime(),
  });

  // Database mutation hooks for CRUD operations
  const createCalendar = useMutation(api.calendars.create);
  const createHabit = useMutation(api.habits.create);
  const markComplete = useMutation(api.habits.markComplete);
  const updateCalendar = useMutation(api.calendars.update);
  const updateHabit = useMutation(api.habits.update);
  const deleteCalendar = useMutation(api.calendars.remove);
  const deleteHabit = useMutation(api.habits.remove);

  // State management for UI interactions and form data
  const [selectedCalendar, setSelectedCalendar] = useState<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  } | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState("bg-red-500");
  const [newHabitName, setNewHabitName] = useState("");
  const [editingCalendar, setEditingCalendar] = useState<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  } | null>(null);
  const [editingHabit, setEditingHabit] = useState<{ _id: Id<"habits">; name: string } | null>(null);
  const [editCalendarName, setEditCalendarName] = useState("");
  const [editCalendarColor, setEditCalendarColor] = useState("");
  const [editHabitName, setEditHabitName] = useState("");
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false);
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);

  // Safely access query results with fallback to empty arrays
  const calendars = calendarsQuery ?? [];
  const habits = habitsQuery ?? [];
  const completions = completionsQuery ?? [];

  // Handler for creating new calendar
  const handleAddCalendar = async () => {
    if (!newCalendarName.trim()) return;

    await createCalendar({
      name: newCalendarName,
      colorTheme: newCalendarColor,
    });

    setNewCalendarName("");
    setNewCalendarColor("bg-red-500");
    setIsNewCalendarOpen(false);
  };

  // Handler for creating new habit within a calendar
  const handleAddHabit = async () => {
    if (!selectedCalendar || !newHabitName.trim()) return;

    await createHabit({
      name: newHabitName,
      calendarId: selectedCalendar._id,
    });

    setNewHabitName("");
    setIsNewHabitOpen(false);
  };

  // Handlers for updating calendars and habits
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

  // Handlers for deleting calendars and habits
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

  // Keyboard event handlers for form submission
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

  return (
    <div className="container max-w-7xl px-4 py-8">
      {/* Authentication-gated content */}
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
              </Dialog>
            </div>

            {/* Empty state or calendar list */}
            {calendars.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>You haven&apos;t created any calendars yet.</p>
                <p className="mt-2">Create one to start tracking your habits!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {calendars.map((calendar) => (
                  <CalendarItem
                    key={calendar._id}
                    calendar={calendar}
                    habits={habits.filter((h) => h.calendarId === calendar._id)}
                    days={days}
                    completions={completions}
                    onAddHabit={() => {
                      setSelectedCalendar(calendar);
                      setIsNewHabitOpen(true);
                    }}
                    onEditCalendar={() => {
                      setEditingCalendar(calendar);
                      setEditCalendarName(calendar.name);
                      setEditCalendarColor(calendar.colorTheme);
                    }}
                    onEditHabit={(habit) => {
                      setEditingHabit(habit);
                      setEditHabitName(habit.name);
                    }}
                    onToggleHabit={(habitId, date, count) => {
                      const timestamp = new Date(date).getTime();
                      markComplete({
                        habitId,
                        completedAt: timestamp,
                        count,
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </SignedIn>

      {/* Sign-in prompt for unauthenticated users */}
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

      {/* Dialog components for creating/editing calendars and habits */}
      <NewCalendarDialog
        isOpen={isNewCalendarOpen}
        onOpenChange={setIsNewCalendarOpen}
        name={newCalendarName}
        onNameChange={setNewCalendarName}
        color={newCalendarColor}
        onColorChange={setNewCalendarColor}
        onSubmit={handleAddCalendar}
        onKeyDown={handleCalendarKeyDown}
      />

      <NewHabitDialog
        isOpen={isNewHabitOpen}
        onOpenChange={setIsNewHabitOpen}
        name={newHabitName}
        onNameChange={setNewHabitName}
        onSubmit={handleAddHabit}
        onKeyDown={handleHabitKeyDown}
      />

      <EditCalendarDialog
        isOpen={!!editingCalendar}
        onOpenChange={() => setEditingCalendar(null)}
        name={editCalendarName}
        onNameChange={setEditCalendarName}
        color={editCalendarColor}
        onColorChange={setEditCalendarColor}
        onSubmit={handleEditCalendar}
        onDelete={handleDeleteCalendar}
      />

      <EditHabitDialog
        isOpen={!!editingHabit}
        onOpenChange={() => setEditingHabit(null)}
        name={editHabitName}
        onNameChange={setEditHabitName}
        onSubmit={handleEditHabit}
        onDelete={handleDeleteHabit}
      />
    </div>
  );
}
