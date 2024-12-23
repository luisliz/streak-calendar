"use client";

import {
  EditCalendarDialog,
  EditHabitDialog,
  NewCalendarDialog,
  NewHabitDialog,
} from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { ImportExport } from "@/components/calendar/import-export";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";

type CalendarView = "monthRow" | "monthGrid";

// Main calendar page component for managing habit tracking calendars and completions
export default function CalendarsPage() {
  const { today, startDate, days } = useDateRange();
  const {
    selectedCalendar,
    setSelectedCalendar,
    newCalendarName,
    setNewCalendarName,
    newCalendarColor,
    setNewCalendarColor,
    editingCalendar,
    setEditingCalendar,
    editCalendarName,
    setEditCalendarName,
    editCalendarColor,
    setEditCalendarColor,
    isNewCalendarOpen,
    setIsNewCalendarOpen,
    calendarView,
    setCalendarView,
  } = useCalendarState();

  const {
    newHabitName,
    setNewHabitName,
    editingHabit,
    setEditingHabit,
    editHabitName,
    setEditHabitName,
    isNewHabitOpen,
    setIsNewHabitOpen,
  } = useHabitState();

  const {
    calendars,
    habits,
    completions,
    handleAddCalendar,
    handleAddHabit,
    handleEditCalendar,
    handleEditHabit,
    handleDeleteCalendar,
    handleDeleteHabit,
    handleToggleHabit,
  } = useCalendarData(startDate, today);

  // Keyboard event handlers for form submission
  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCalendar(newCalendarName, newCalendarColor);
      setNewCalendarName("");
      setNewCalendarColor("bg-red-500");
      setIsNewCalendarOpen(false);
    }
  };

  const handleHabitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedCalendar) {
      handleAddHabit(newHabitName, selectedCalendar._id);
      setNewHabitName("");
      setIsNewHabitOpen(false);
    }
  };

  return (
    <div className="container max-w-7xl px-4 py-8">
      {/* Authentication-gated content */}
      <SignedIn>
        {calendars === undefined ? (
          <CalendarSkeleton />
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Tabs value={calendarView} onValueChange={(value) => setCalendarView(value as CalendarView)}>
                  <TabsList>
                    <TabsTrigger value="monthRow">Days View</TabsTrigger>
                    <TabsTrigger value="monthGrid">Months View</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsNewCalendarOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Calendar
                </Button>
              </div>
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
                    onToggleHabit={handleToggleHabit}
                    view={calendarView}
                  />
                ))}
              </div>
            )}

            {/* Import/Export UI */}
            <div className="mt-8 flex justify-center">
              <ImportExport />
            </div>
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
        onSubmit={() => {
          handleAddCalendar(newCalendarName, newCalendarColor);
          setNewCalendarName("");
          setNewCalendarColor("bg-red-500");
          setIsNewCalendarOpen(false);
        }}
        onKeyDown={handleCalendarKeyDown}
      />

      <NewHabitDialog
        isOpen={isNewHabitOpen}
        onOpenChange={setIsNewHabitOpen}
        name={newHabitName}
        onNameChange={setNewHabitName}
        onSubmit={() => {
          if (selectedCalendar) {
            handleAddHabit(newHabitName, selectedCalendar._id);
            setNewHabitName("");
            setIsNewHabitOpen(false);
          }
        }}
        onKeyDown={handleHabitKeyDown}
      />

      <EditCalendarDialog
        isOpen={!!editingCalendar}
        onOpenChange={() => setEditingCalendar(null)}
        name={editCalendarName}
        onNameChange={setEditCalendarName}
        color={editCalendarColor}
        onColorChange={setEditCalendarColor}
        onSubmit={() => {
          if (editingCalendar) {
            handleEditCalendar(editingCalendar._id, editCalendarName, editCalendarColor);
            setEditingCalendar(null);
          }
        }}
        onDelete={() => {
          if (editingCalendar) {
            handleDeleteCalendar(editingCalendar._id);
            setEditingCalendar(null);
          }
        }}
      />

      <EditHabitDialog
        isOpen={!!editingHabit}
        onOpenChange={() => setEditingHabit(null)}
        name={editHabitName}
        onNameChange={setEditHabitName}
        onSubmit={() => {
          if (editingHabit) {
            handleEditHabit(editingHabit._id, editHabitName);
            setEditingHabit(null);
          }
        }}
        onDelete={() => {
          if (editingHabit) {
            handleDeleteHabit(editingHabit._id);
            setEditingHabit(null);
          }
        }}
      />
    </div>
  );
}
