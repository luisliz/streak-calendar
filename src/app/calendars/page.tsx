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
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { Calendar, Completion, Day, EditingCalendar, EditingHabit, Habit, Id } from "@/types";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, GripHorizontal, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

const MotionCard = motion(Card);

// Authentication wrapper component
const AuthenticationWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex flex-col   items-center justify-center min-h-[50vh] gap-4">
          <h2 className="text-xl font-semibold">Please sign in to view your calendars</h2>
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
};

// View controls component
const ViewControls = ({
  calendarView,
  setCalendarView,
  setIsNewCalendarOpen,
}: {
  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  isPending: boolean;
  setIsNewCalendarOpen: (open: boolean) => void;
  startTransition: (callback: () => void) => void;
}) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-4">
        <Tabs value={calendarView} onValueChange={(value) => setCalendarView(value as CalendarView)}>
          <TabsList>
            <TabsTrigger value="monthGrid">
              <CalendarDays className="mr-2 h-4 w-4" />
              Monthly View
            </TabsTrigger>
            <TabsTrigger value="monthRow">
              <GripHorizontal className="mr-2 h-4 w-4" />
              Daily View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="hidden md:flex gap-2">
        <Button variant="outline" onClick={() => setIsNewCalendarOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Calendar
        </Button>
      </div>
    </div>
  );
};

// Calendar list component
const CalendarList = ({
  calendarView,
  calendars,
  completions,
  days,
  habitsByCalendar,
  handleEditCalendarMemo,
  handleEditHabitMemo,
  handleToggleHabit,
  isPending,
  setCalendarView,
  setIsNewCalendarOpen,
  setIsNewHabitOpen,
  setSelectedCalendar,
  startTransition,
}: {
  calendars: Calendar[];
  calendarView: CalendarView;
  habitsByCalendar: Map<Id<"calendars">, Habit[]>;
  days: Day[];
  completions: Completion[];
  handleEditCalendarMemo: (calendar: Calendar) => void;
  handleEditHabitMemo: (habit: EditingHabit) => void;
  handleToggleHabit: (habitId: Id<"habits">, date: string, count: number) => Promise<void>;
  setSelectedCalendar: (calendar: Calendar) => void;
  setIsNewHabitOpen: (open: boolean) => void;
  setCalendarView: (view: CalendarView) => void;
  isPending: boolean;
  setIsNewCalendarOpen: (open: boolean) => void;
  startTransition: (callback: () => void) => void;
}) => {
  if (calendars.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>You haven&apos;t created any calendars yet.</p>
        <p className="mt-2">Create one to start tracking your habits!</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionCard
        key={calendarView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="space-y-8 shadow-md border p-2"
      >
        <ViewControls
          calendarView={calendarView}
          setCalendarView={setCalendarView}
          isPending={isPending}
          setIsNewCalendarOpen={setIsNewCalendarOpen}
          startTransition={startTransition}
        />
        <div className="px-4 md:px-8">
          {calendars.map((calendar) => (
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
          ))}
        </div>
      </MotionCard>
    </AnimatePresence>
  );
};

// Dialog components wrapper
const DialogComponents = ({
  editCalendarColor,
  editCalendarName,
  editHabitName,
  editingCalendar,
  editingHabit,
  handleAddCalendar,
  handleAddHabit,
  handleCalendarKeyDown,
  handleDeleteCalendar,
  handleDeleteHabit,
  handleEditCalendar,
  handleEditHabit,
  handleHabitKeyDown,
  isNewCalendarOpen,
  isNewHabitOpen,
  newCalendarColor,
  newCalendarName,
  newHabitName,
  selectedCalendar,
  setEditCalendarColor,
  setEditCalendarName,
  setEditHabitName,
  setEditingCalendar,
  setEditingHabit,
  setIsNewCalendarOpen,
  setIsNewHabitOpen,
  setNewCalendarColor,
  setNewCalendarName,
  setNewHabitName,
}: {
  editCalendarColor: string;
  editCalendarName: string;
  editHabitName: string;
  editingCalendar: EditingCalendar | null;
  editingHabit: EditingHabit | null;
  handleAddCalendar: (name: string, color: string) => Promise<void>;
  handleAddHabit: (name: string, calendarId: Id<"calendars">) => Promise<void>;
  handleCalendarKeyDown: (e: React.KeyboardEvent) => void;
  handleDeleteCalendar: (id: Id<"calendars">) => Promise<void>;
  handleDeleteHabit: (id: Id<"habits">) => Promise<void>;
  handleEditCalendar: (id: Id<"calendars">, name: string, color: string) => Promise<void>;
  handleEditHabit: (id: Id<"habits">, name: string) => Promise<void>;
  handleHabitKeyDown: (e: React.KeyboardEvent) => void;
  isNewCalendarOpen: boolean;
  isNewHabitOpen: boolean;
  newCalendarColor: string;
  newCalendarName: string;
  newHabitName: string;
  selectedCalendar: Calendar | null;
  setEditCalendarColor: (color: string) => void;
  setEditCalendarName: (name: string) => void;
  setEditHabitName: (name: string) => void;
  setEditingCalendar: (calendar: EditingCalendar | null) => void;
  setEditingHabit: (habit: EditingHabit | null) => void;
  setIsNewCalendarOpen: (open: boolean) => void;
  setIsNewHabitOpen: (open: boolean) => void;
  setNewCalendarColor: (color: string) => void;
  setNewCalendarName: (name: string) => void;
  setNewHabitName: (name: string) => void;
}) => {
  return (
    <>
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
    </>
  );
};

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
    <div className="container max-w-7xl w-full mx-auto">
      {/* Authentication-gated content */}
      <AuthenticationWrapper>
        <>
          {/* Yearly Overview Section */}
          <YearlyOverview completions={yearViewData.completions || []} habits={habits} calendars={calendars} />

          {/* Calendar list with view controls inside */}
          <CalendarList
            calendarView={calendarView}
            calendars={calendars}
            completions={completions}
            days={days}
            habitsByCalendar={habitsByCalendar}
            handleEditCalendarMemo={handleEditCalendarMemo}
            handleEditHabitMemo={handleEditHabitMemo}
            handleToggleHabit={handleToggleHabit}
            isPending={isPending}
            setCalendarView={setCalendarView}
            setIsNewCalendarOpen={setIsNewCalendarOpen}
            setIsNewHabitOpen={setIsNewHabitOpen}
            setSelectedCalendar={setSelectedCalendar}
            startTransition={startTransition}
          />

          {/* Import/Export UI */}
          <div className="mt-8 flex justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>

      {/* Dialog components for creating/editing calendars and habits */}
      <DialogComponents
        editCalendarColor={editCalendarColor}
        editCalendarName={editCalendarName}
        editHabitName={editHabitName}
        editingCalendar={editingCalendar}
        editingHabit={editingHabit}
        handleAddCalendar={handleAddCalendar}
        handleAddHabit={handleAddHabit}
        handleCalendarKeyDown={handleCalendarKeyDown}
        handleDeleteCalendar={handleDeleteCalendar}
        handleDeleteHabit={handleDeleteHabit}
        handleEditCalendar={handleEditCalendar}
        handleEditHabit={handleEditHabit}
        handleHabitKeyDown={handleHabitKeyDown}
        isNewCalendarOpen={isNewCalendarOpen}
        isNewHabitOpen={isNewHabitOpen}
        newCalendarColor={newCalendarColor}
        newCalendarName={newCalendarName}
        newHabitName={newHabitName}
        selectedCalendar={selectedCalendar}
        setEditCalendarColor={setEditCalendarColor}
        setEditCalendarName={setEditCalendarName}
        setEditHabitName={setEditHabitName}
        setEditingCalendar={setEditingCalendar}
        setEditingHabit={setEditingHabit}
        setIsNewCalendarOpen={setIsNewCalendarOpen}
        setIsNewHabitOpen={setIsNewHabitOpen}
        setNewCalendarColor={setNewCalendarColor}
        setNewCalendarName={setNewCalendarName}
        setNewHabitName={setNewHabitName}
      />
    </div>
  );
}
