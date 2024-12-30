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
import { toast } from "react-hot-toast";

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
  onViewChange,
}: {
  calendarView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-4">
        <Tabs value={calendarView} onValueChange={(value) => onViewChange(value as CalendarView)}>
          <TabsList>
            <TabsTrigger value="monthRow">
              <GripHorizontal className="mr-2 h-4 w-4" />
              Rows View
            </TabsTrigger>
            <TabsTrigger value="monthGrid">
              <CalendarDays className="mr-2 h-4 w-4" />
              Grids View
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
  habits,
  onAddHabit,
  onEditCalendar,
  onEditHabit,
  onToggleHabit,
  onViewChange,
  onNewCalendar,
  view,
}: {
  calendarView: CalendarView;
  calendars: Calendar[];
  completions: Completion[];
  days: Day[];
  habits: Habit[];
  onAddHabit: (calendar: Calendar) => void;
  onEditCalendar: (calendar: Calendar) => void;
  onEditHabit: (habit: EditingHabit) => void;
  onToggleHabit: (habitId: Id<"habits">, date: string, count: number) => void;
  onViewChange: (view: CalendarView) => void;
  onNewCalendar: () => void;
  view: CalendarView;
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
        <ViewControls calendarView={calendarView} onViewChange={onViewChange} />
        <div className="px-4 md:px-8">
          {calendars.map((calendar) => {
            const calendarHabits = habits.filter((h) => h.calendarId === calendar._id);
            return (
              <CalendarItem
                key={calendar._id}
                calendar={calendar}
                habits={calendarHabits}
                days={days}
                completions={completions}
                onAddHabit={() => onAddHabit(calendar)}
                onEditCalendar={() => onEditCalendar(calendar)}
                onEditHabit={onEditHabit}
                onToggleHabit={onToggleHabit}
                view={view}
              />
            );
          })}
        </div>
        <div className="flex justify-center pb-4">
          <Button variant="outline" onClick={onNewCalendar}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Calendar
          </Button>
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
  editHabitTimerDuration,
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
  newHabitTimerDuration,
  selectedCalendar,
  setEditCalendarColor,
  setEditCalendarName,
  setEditHabitName,
  setEditHabitTimerDuration,
  setEditingCalendar,
  setEditingHabit,
  setIsNewCalendarOpen,
  setIsNewHabitOpen,
  setNewCalendarColor,
  setNewCalendarName,
  setNewHabitName,
  setNewHabitTimerDuration,
}: {
  editCalendarColor: string;
  editCalendarName: string;
  editHabitName: string;
  editHabitTimerDuration: number | undefined;
  editingCalendar: EditingCalendar | null;
  editingHabit: EditingHabit | null;
  handleAddCalendar: (name: string, color: string) => Promise<void>;
  handleAddHabit: (name: string, calendarId: Id<"calendars">, timerDuration?: number) => Promise<void>;
  handleCalendarKeyDown: (e: React.KeyboardEvent) => void;
  handleDeleteCalendar: (id: Id<"calendars">) => Promise<void>;
  handleDeleteHabit: (id: Id<"habits">) => Promise<void>;
  handleEditCalendar: (id: Id<"calendars">, name: string, color: string) => Promise<void>;
  handleEditHabit: (id: Id<"habits">, name: string, timerDuration?: number) => Promise<void>;
  handleHabitKeyDown: (e: React.KeyboardEvent) => void;
  isNewCalendarOpen: boolean;
  isNewHabitOpen: boolean;
  newCalendarColor: string;
  newCalendarName: string;
  newHabitName: string;
  newHabitTimerDuration: number | undefined;
  selectedCalendar: Calendar | null;
  setEditCalendarColor: (color: string) => void;
  setEditCalendarName: (name: string) => void;
  setEditHabitName: (name: string) => void;
  setEditHabitTimerDuration: (duration: number | undefined) => void;
  setEditingCalendar: (calendar: EditingCalendar | null) => void;
  setEditingHabit: (habit: EditingHabit | null) => void;
  setIsNewCalendarOpen: (open: boolean) => void;
  setIsNewHabitOpen: (open: boolean) => void;
  setNewCalendarColor: (color: string) => void;
  setNewCalendarName: (name: string) => void;
  setNewHabitName: (name: string) => void;
  setNewHabitTimerDuration: (duration: number | undefined) => void;
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
        timerDuration={newHabitTimerDuration}
        onTimerDurationChange={setNewHabitTimerDuration}
        onSubmit={() => {
          if (selectedCalendar) {
            handleAddHabit(newHabitName, selectedCalendar._id, newHabitTimerDuration);
            setNewHabitName("");
            setNewHabitTimerDuration(undefined);
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
        timerDuration={editHabitTimerDuration}
        onTimerDurationChange={setEditHabitTimerDuration}
        onSubmit={() => {
          if (editingHabit) {
            handleEditHabit(editingHabit._id, editHabitName, editHabitTimerDuration);
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
    newHabitTimerDuration,
    setNewHabitTimerDuration,
    editingHabit,
    setEditingHabit,
    editHabitName,
    setEditHabitName,
    editHabitTimerDuration,
    setEditHabitTimerDuration,
    isNewHabitOpen,
    setIsNewHabitOpen,
  } = useHabitState();

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

  // Use appropriate data based on view
  const { calendars, habits } = useMemo(
    () => (calendarView === "monthRow" ? monthViewData : yearViewData),
    [calendarView, monthViewData, yearViewData]
  );

  const wrappedHandleAddCalendar = useCallback(
    async (name: string, color: string) => {
      startTransition(async () => {
        await monthViewData.handleAddCalendar(name, color);
        setNewCalendarName("");
        setNewCalendarColor("bg-red-500");
        setIsNewCalendarOpen(false);
      });
    },
    [monthViewData, setNewCalendarName, setNewCalendarColor, setIsNewCalendarOpen]
  );

  const wrappedHandleAddHabit = useCallback(
    async (name: string, calendarId: Id<"calendars">, timerDuration?: number) => {
      startTransition(async () => {
        try {
          await monthViewData.handleAddHabit(name, calendarId, timerDuration);
          setNewHabitName("");
          setNewHabitTimerDuration(undefined);
          setIsNewHabitOpen(false);
        } catch (error) {
          console.error(error);
          toast.error("Failed to add habit");
        }
      });
    },
    [monthViewData, setNewHabitName, setNewHabitTimerDuration, setIsNewHabitOpen]
  );

  const wrappedHandleEditCalendar = useCallback(
    async (id: Id<"calendars">, name: string, color: string) => {
      startTransition(async () => {
        await monthViewData.handleEditCalendar(id, name, color);
        setEditingCalendar(null);
      });
    },
    [monthViewData, setEditingCalendar]
  );

  const wrappedHandleEditHabit = useCallback(
    async (id: Id<"habits">, name: string, timerDuration?: number) => {
      startTransition(async () => {
        try {
          await monthViewData.handleEditHabit(id, name, timerDuration);
          setEditingHabit(null);
        } catch (error) {
          console.error(error);
          toast.error("Failed to edit habit");
        }
      });
    },
    [monthViewData, setEditingHabit]
  );

  const wrappedHandleDeleteCalendar = useCallback(
    async (id: Id<"calendars">) => {
      startTransition(async () => {
        await monthViewData.handleDeleteCalendar(id);
        setEditingCalendar(null);
      });
    },
    [monthViewData, setEditingCalendar]
  );

  const wrappedHandleDeleteHabit = useCallback(
    async (id: Id<"habits">) => {
      startTransition(async () => {
        await monthViewData.handleDeleteHabit(id);
        setEditingHabit(null);
      });
    },
    [monthViewData, setEditingHabit]
  );

  const wrappedHandleToggleHabit = useCallback(
    async (habitId: Id<"habits">, date: string, count: number) => {
      await monthViewData.handleToggleHabit(habitId, date, count);
    },
    [monthViewData]
  );

  const handleEditHabitClick = useCallback(
    (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => {
      setEditingHabit(habit);
      setEditHabitName(habit.name);
      setEditHabitTimerDuration(habit.timerDuration);
    },
    [setEditingHabit, setEditHabitName, setEditHabitTimerDuration]
  );

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      wrappedHandleAddCalendar(newCalendarName, newCalendarColor);
    }
  };

  const handleHabitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && selectedCalendar) {
      wrappedHandleAddHabit(newHabitName, selectedCalendar._id, newHabitTimerDuration);
    }
  };

  // Add console logs to track loading states
  useEffect(() => {
    console.log("Loading States:", { isPending, isLoading });
  }, [isPending, isLoading]);

  return (
    <div className="container max-w-7xl mx-auto">
      <AuthenticationWrapper>
        <>
          <YearlyOverview completions={yearViewData.completions || []} habits={habits} calendars={calendars} />
          <CalendarList
            calendarView={calendarView}
            calendars={monthViewData.calendars || []}
            completions={monthViewData.completions || []}
            days={days}
            habits={monthViewData.habits || []}
            onAddHabit={(calendar) => {
              setSelectedCalendar(calendar);
              setIsNewHabitOpen(true);
            }}
            onEditCalendar={(calendar) => {
              setEditingCalendar(calendar);
              setEditCalendarName(calendar.name);
              setEditCalendarColor(calendar.colorTheme);
            }}
            onEditHabit={handleEditHabitClick}
            onToggleHabit={wrappedHandleToggleHabit}
            onViewChange={setCalendarView}
            onNewCalendar={() => setIsNewCalendarOpen(true)}
            view={calendarView}
          />
          <DialogComponents
            editCalendarColor={editCalendarColor}
            editCalendarName={editCalendarName}
            editHabitName={editHabitName}
            editHabitTimerDuration={editHabitTimerDuration}
            editingCalendar={editingCalendar}
            editingHabit={editingHabit}
            handleAddCalendar={wrappedHandleAddCalendar}
            handleAddHabit={wrappedHandleAddHabit}
            handleCalendarKeyDown={handleCalendarKeyDown}
            handleDeleteCalendar={wrappedHandleDeleteCalendar}
            handleDeleteHabit={wrappedHandleDeleteHabit}
            handleEditCalendar={wrappedHandleEditCalendar}
            handleEditHabit={wrappedHandleEditHabit}
            handleHabitKeyDown={handleHabitKeyDown}
            isNewCalendarOpen={isNewCalendarOpen}
            isNewHabitOpen={isNewHabitOpen}
            newCalendarColor={newCalendarColor}
            newCalendarName={newCalendarName}
            newHabitName={newHabitName}
            newHabitTimerDuration={newHabitTimerDuration}
            selectedCalendar={selectedCalendar}
            setEditCalendarColor={setEditCalendarColor}
            setEditCalendarName={setEditCalendarName}
            setEditHabitName={setEditHabitName}
            setEditHabitTimerDuration={setEditHabitTimerDuration}
            setEditingCalendar={setEditingCalendar}
            setEditingHabit={setEditingHabit}
            setIsNewCalendarOpen={setIsNewCalendarOpen}
            setIsNewHabitOpen={setIsNewHabitOpen}
            setNewCalendarColor={setNewCalendarColor}
            setNewCalendarName={setNewCalendarName}
            setNewHabitName={setNewHabitName}
            setNewHabitTimerDuration={setNewHabitTimerDuration}
          />
          <div className="mt-8 flex justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>
    </div>
  );
}
