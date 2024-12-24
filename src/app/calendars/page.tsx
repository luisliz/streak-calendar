"use client";

import {
  EditCalendarDialog,
  EditHabitDialog,
  NewCalendarDialog,
  NewHabitDialog,
} from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

type CalendarView = "monthRow" | "monthGrid";

// Main calendar page component for managing habit tracking calendars and completions
export default function CalendarsPage() {
  const [isPending, startTransition] = useTransition();
  const { calendarView, setCalendarView, ...calendarState } = useCalendarState();
  const [isLoading, setIsLoading] = useState(true);

  // Pre-fetch data for both views
  const monthData = useDateRange(30);
  const yearData = useDateRange(365);

  // Use appropriate data based on view with deferred loading
  const { days } = useMemo(
    () => (calendarView === "monthRow" ? monthData : yearData),
    [calendarView, monthData, yearData]
  );

  // Prefetch both views' data
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  // Update loading state based on data availability
  useEffect(() => {
    setIsLoading(!monthViewData.calendars || !monthViewData.habits || !monthViewData.completions);
  }, [monthViewData.calendars, monthViewData.habits, monthViewData.completions]);

  // Add this temporarily to see the loading state
  console.log("Loading state:", isLoading);
  console.log("Calendar data:", monthViewData);

  // Use appropriate data based on view
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
  } = useMemo(
    () => (calendarView === "monthRow" ? monthViewData : yearViewData),
    [calendarView, monthViewData, yearViewData]
  );

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
  } = calendarState;

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

  // Memoize filtered habits by calendar to prevent re-computation
  const habitsByCalendar = useMemo(() => {
    if (!habits || !calendars) return new Map();

    return new Map(calendars.map((calendar) => [calendar._id, habits.filter((h) => h.calendarId === calendar._id)]));
  }, [habits, calendars]);

  // Memoize handlers to prevent re-renders
  const handleEditCalendarMemo = useCallback(
    (calendar: (typeof calendars)[0]) => {
      setEditingCalendar(calendar);
      setEditCalendarName(calendar.name);
      setEditCalendarColor(calendar.colorTheme);
    },
    [setEditingCalendar, setEditCalendarName, setEditCalendarColor]
  );

  const handleEditHabitMemo = useCallback(
    (habit: { _id: (typeof habits)[0]["_id"]; name: string }) => {
      setEditingHabit(habit);
      setEditHabitName(habit.name);
    },
    [setEditingHabit, setEditHabitName]
  );

  // Memoize the calendar list with optimized handlers and data access
  const calendarList = useMemo(() => {
    if (!calendars) return null;

    return calendars.map((calendar) => (
      <CalendarItem
        key={calendar._id}
        calendar={calendar}
        habits={habitsByCalendar.get(calendar._id) || []}
        days={days}
        completions={completions}
        onAddHabit={() => {
          setSelectedCalendar(calendar);
          setIsNewHabitOpen(true);
        }}
        onEditCalendar={() => handleEditCalendarMemo(calendar)}
        onEditHabit={handleEditHabitMemo}
        onToggleHabit={handleToggleHabit}
        view={calendarView}
      />
    ));
  }, [
    calendars,
    habitsByCalendar,
    days,
    completions,
    calendarView,
    handleEditCalendarMemo,
    handleEditHabitMemo,
    handleToggleHabit,
    setSelectedCalendar,
    setIsNewHabitOpen,
  ]);

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
        <>
          {/* Yearly Overview Section */}
          <YearlyOverview completions={yearViewData.completions || []} habits={habits} calendars={calendars} />

          {/* Calendar View Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Tabs
                value={calendarView}
                onValueChange={(value) => {
                  startTransition(() => {
                    setCalendarView(value as CalendarView);
                  });
                }}
              >
                <TabsList className="relative">
                  <motion.div
                    className="absolute inset-0 bg-background pointer-events-none"
                    animate={{ opacity: isPending ? 0.5 : 0 }}
                    transition={{ duration: 0.15 }}
                  />
                  <TabsTrigger value="monthRow" className="relative z-10">
                    Days View
                  </TabsTrigger>
                  <TabsTrigger value="monthGrid" className="relative z-10">
                    Months View
                  </TabsTrigger>
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={calendarView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                className="space-y-8"
              >
                {calendarList}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Import/Export UI */}
          <div className="mt-8 flex justify-center">
            <ImportExport />
          </div>
        </>
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
