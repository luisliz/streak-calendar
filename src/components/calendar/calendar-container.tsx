import { EditCalendarDialog, NewCalendarDialog, NewHabitDialog } from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ViewControls } from "@/components/ui/view-controls";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useToastMessages } from "@/hooks/use-toast-messages";
import { useRouter } from "@/i18n/routing";
import { Calendar, Completion, Day, Habit, Id } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { CalendarSkeletons } from "./calendar-skeletons";

/**
 * Main calendar container component that manages the display and interaction of calendars and habits.
 * Handles calendar/habit CRUD operations and view switching between month row and grid layouts.
 */

const MotionCard = motion(Card);

/**
 * Type for calendar view modes - either month row or month grid layout
 */
type CalendarView = "monthRow" | "monthGrid";

/**
 * Props interface for the CalendarContainer component
 */
interface CalendarContainerProps {
  /** Current calendar view mode */
  calendarView: CalendarView;
  /** Array of user's calendars */
  calendars: Array<Calendar>;
  /** Array of habit completion records */
  completions: Array<Completion>;
  /** Array of dates to display */
  days: Array<Day>;
  /** Array of habits across all calendars */
  habits: Array<Habit>;
  /** Data and handlers for month view operations */
  monthViewData: {
    handleAddCalendar: (name: string, color: string) => Promise<void>;
    handleAddHabit: (name: string, calendarId: Id<"calendars">, timerDuration?: number) => Promise<void>;
    handleEditCalendar: (id: Id<"calendars">, name: string, color: string) => Promise<void>;
    handleEditHabit: (id: Id<"habits">, name: string, timerDuration?: number) => Promise<void>;
    handleDeleteCalendar: (id: Id<"calendars">) => Promise<void>;
    handleDeleteHabit: (id: Id<"habits">) => Promise<void>;
    handleToggleHabit: (habitId: Id<"habits">, date: string, count: number) => Promise<void>;
  };
  /** Current view mode */
  view: CalendarView;
  /** Callback for changing view mode */
  onViewChange: (view: CalendarView) => void;
  /** Loading state flag */
  isLoading?: boolean;
}

/**
 * Empty state component shown when no calendars exist
 */
function EmptyState({
  monthViewData,
}: {
  monthViewData: {
    handleAddCalendar: (name: string, color: string) => Promise<void>;
  };
}) {
  const t = useTranslations("calendar.container");
  const toastMessages = useToastMessages();
  const { state, openNewCalendar, updateCalendarName, updateCalendarColor, resetCalendarState } = useDialogState();

  const handleAddCalendar = useCallback(async () => {
    const { name, color } = state.calendar;
    if (!name.trim()) return;

    await monthViewData.handleAddCalendar(name, color);
    toastMessages.calendar.created();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16">
      <p className="text-sm text-muted-foreground">{t("emptyState.noCalendars")}</p>
      <Button onClick={openNewCalendar} size="sm">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("controls.addCalendar")}
      </Button>
      <NewCalendarDialog
        isOpen={state.calendar.isNewOpen}
        name={state.calendar.name}
        color={state.calendar.color}
        onOpenChange={resetCalendarState}
        onNameChange={updateCalendarName}
        onColorChange={updateCalendarColor}
        onSubmit={handleAddCalendar}
      />
    </div>
  );
}

/**
 * Main calendar container component that orchestrates the display and interaction
 * of calendars, habits, and their associated dialogs
 */
export function CalendarContainer({
  calendarView,
  calendars,
  completions,
  days,
  habits,
  monthViewData,
  view,
  onViewChange,
  isLoading = false,
}: CalendarContainerProps) {
  const toastMessages = useToastMessages();
  const router = useRouter();
  const [loadingCells, setLoadingCells] = useState<Record<string, boolean>>({});

  // Dialog state management for calendar and habit operations
  const {
    state,
    openEditCalendar,
    openNewHabit,
    updateCalendarName,
    updateCalendarColor,
    updateHabitName,
    updateHabitTimer,
    resetCalendarState,
    resetHabitState,
  } = useDialogState();

  /**
   * Handles creation of a new calendar
   * Validates name and triggers toast notification on success
   */
  const handleAddCalendar = useCallback(async () => {
    const { name, color } = state.calendar;
    if (!name.trim()) return;

    await monthViewData.handleAddCalendar(name, color);
    toastMessages.calendar.created();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  /**
   * Handles creation of a new habit
   * Validates name and triggers toast notification on success
   */
  const handleAddHabit = useCallback(async () => {
    const { name, timerDuration, selectedCalendar } = state.habit;
    if (!name.trim() || !selectedCalendar) return;

    await monthViewData.handleAddHabit(name, selectedCalendar._id, timerDuration);
    toastMessages.habit.created();
    resetHabitState();
  }, [monthViewData, state.habit, toastMessages, resetHabitState]);

  /**
   * Handles editing an existing calendar
   * Validates name and triggers toast notification on success
   */
  const handleEditCalendar = useCallback(async () => {
    const { name, color, editingCalendar } = state.calendar;
    if (!name.trim() || !editingCalendar) return;

    await monthViewData.handleEditCalendar(editingCalendar._id, name, color);
    toastMessages.calendar.updated();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  /**
   * Handles deleting a calendar
   */
  const handleDeleteCalendar = useCallback(async () => {
    const { editingCalendar } = state.calendar;
    if (!editingCalendar) return;

    await monthViewData.handleDeleteCalendar(editingCalendar._id);
    toastMessages.calendar.deleted();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  /**
   * Handles toggling habit completion for a specific date
   * Updates completion count in the database
   */
  const handleToggleHabit = useCallback(
    async (habitId: Id<"habits">, date: string, count: number) => {
      const cellKey = `${habitId}-${date}`;
      setLoadingCells((prev) => ({ ...prev, [cellKey]: true }));
      try {
        await monthViewData.handleToggleHabit(habitId, date, count);
      } finally {
        setLoadingCells((prev) => ({ ...prev, [cellKey]: false }));
      }
    },
    [monthViewData]
  );

  // Show loading skeletons while data is being fetched
  if (isLoading) {
    return <CalendarSkeletons view={view} />;
  }

  // Show empty state when no calendars exist
  if (calendars.length === 0) {
    return <EmptyState monthViewData={monthViewData} />;
  }

  return (
    <>
      {/* Animated container for calendar view with smooth transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <MotionCard
          key={calendarView}
          className="space-y-8 border p-2 shadow-md"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          exit={{ y: 0 }}
          transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
        >
          {/* Controls for switching between month row and grid views */}
          <ViewControls calendarView={calendarView} onViewChange={onViewChange} />

          {/* Container for all calendar items */}
          <div className="flex w-full flex-col gap-4 md:px-8">
            <div className="w-full">
              {/* Map through calendars and render individual calendar items */}
              {calendars.map((calendar) => {
                const calendarHabits = habits.filter((h) => h.calendarId === calendar._id);
                return (
                  <CalendarItem
                    calendar={calendar}
                    completions={completions}
                    days={days}
                    habits={calendarHabits}
                    key={calendar._id}
                    onAddHabit={() => openNewHabit(calendar)}
                    onEditCalendar={() => openEditCalendar(calendar)}
                    onEditHabit={(habit) => router.push(`/habits/${habit._id}`)}
                    onToggleHabit={handleToggleHabit}
                    view={view}
                    loadingCells={loadingCells}
                  />
                );
              })}
            </div>
          </div>
        </MotionCard>
      </AnimatePresence>

      {/* Dialogs for calendar and habit operations */}
      <NewCalendarDialog
        isOpen={state.calendar.isNewOpen}
        name={state.calendar.name}
        color={state.calendar.color}
        onOpenChange={resetCalendarState}
        onNameChange={updateCalendarName}
        onColorChange={updateCalendarColor}
        onSubmit={handleAddCalendar}
      />
      <EditCalendarDialog
        isOpen={state.calendar.isEditOpen}
        name={state.calendar.name}
        color={state.calendar.color}
        onOpenChange={resetCalendarState}
        onNameChange={updateCalendarName}
        onColorChange={updateCalendarColor}
        onSubmit={handleEditCalendar}
        onDelete={handleDeleteCalendar}
      />
      <NewHabitDialog
        isOpen={state.habit.isNewOpen}
        name={state.habit.name}
        timerDuration={state.habit.timerDuration}
        onOpenChange={resetHabitState}
        onNameChange={updateHabitName}
        onTimerDurationChange={updateHabitTimer}
        onSubmit={handleAddHabit}
      />
    </>
  );
}
