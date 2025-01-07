import {
  EditCalendarDialog,
  EditHabitDialog,
  NewCalendarDialog,
  NewHabitDialog,
} from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ViewControls } from "@/components/ui/view-controls";
import { useDialogState } from "@/hooks/use-dialog-state";
import { useToastMessages } from "@/hooks/use-toast-messages";
import { Calendar, Completion, Day, Habit, Id } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

import { CalendarSkeletons } from "./calendar-skeletons";

const MotionCard = motion(Card);

type CalendarView = "monthRow" | "monthGrid";

interface CalendarData {
  handleAddCalendar: (name: string, color: string) => Promise<void>;
  handleAddHabit: (name: string, calendarId: Id<"calendars">, timerDuration?: number) => Promise<void>;
  handleEditCalendar: (id: Id<"calendars">, name: string, color: string) => Promise<void>;
  handleEditHabit: (id: Id<"habits">, name: string, timerDuration?: number) => Promise<void>;
  handleDeleteCalendar: (id: Id<"calendars">) => Promise<void>;
  handleDeleteHabit: (id: Id<"habits">) => Promise<void>;
  handleToggleHabit: (habitId: Id<"habits">, date: string, count: number) => Promise<void>;
}

interface CalendarContainerProps {
  calendarView: CalendarView;
  calendars: Calendar[];
  completions: Completion[];
  days: Day[];
  habits: Habit[];
  monthViewData: CalendarData;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  isLoading?: boolean;
}

const EmptyState = () => {
  const t = useTranslations("calendar.container.emptyState");
  const { openNewCalendar } = useDialogState();

  return (
    <div className="py-12 text-center text-muted-foreground">
      <p>{t("noCalendars")}</p>
      <p className="mt-2">{t("createOne")}</p>
      <Button variant="default" onClick={openNewCalendar} className="mt-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t("createButton")}
      </Button>
    </div>
  );
};

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
  const t = useTranslations("calendar.container");
  const toastMessages = useToastMessages();
  const {
    state,
    openNewCalendar,
    openEditCalendar,
    openNewHabit,
    openEditHabit,
    updateCalendarName,
    updateCalendarColor,
    updateHabitName,
    updateHabitTimer,
    resetCalendarState,
    resetHabitState,
  } = useDialogState();

  const handleAddCalendar = useCallback(async () => {
    const { name, color } = state.calendar;
    if (!name.trim()) return;

    await monthViewData.handleAddCalendar(name, color);
    toastMessages.calendar.created();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  const handleAddHabit = useCallback(async () => {
    const { name, timerDuration, selectedCalendar } = state.habit;
    if (!name.trim() || !selectedCalendar) return;

    try {
      await monthViewData.handleAddHabit(name, selectedCalendar._id, timerDuration);
      toastMessages.habit.created();
      resetHabitState();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add habit");
    }
  }, [monthViewData, state.habit, toastMessages, resetHabitState]);

  const handleEditCalendar = useCallback(async () => {
    const { name, color, editingCalendar } = state.calendar;
    if (!name.trim() || !editingCalendar) return;

    await monthViewData.handleEditCalendar(editingCalendar._id, name, color);
    toastMessages.calendar.updated();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  const handleEditHabit = useCallback(async () => {
    const { name, timerDuration, editingHabit } = state.habit;
    if (!name.trim() || !editingHabit) return;

    try {
      await monthViewData.handleEditHabit(editingHabit._id, name, timerDuration);
      toastMessages.habit.updated();
      resetHabitState();
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit habit");
    }
  }, [monthViewData, state.habit, toastMessages, resetHabitState]);

  const handleDeleteCalendar = useCallback(async () => {
    const { editingCalendar } = state.calendar;
    if (!editingCalendar) return;

    await monthViewData.handleDeleteCalendar(editingCalendar._id);
    toastMessages.calendar.deleted();
    resetCalendarState();
  }, [monthViewData, state.calendar, toastMessages, resetCalendarState]);

  const handleDeleteHabit = useCallback(async () => {
    const { editingHabit } = state.habit;
    if (!editingHabit) return;

    await monthViewData.handleDeleteHabit(editingHabit._id);
    toastMessages.habit.deleted();
    resetHabitState();
  }, [monthViewData, state.habit, toastMessages, resetHabitState]);

  const handleToggleHabit = useCallback(
    async (habitId: Id<"habits">, date: string, count: number) => {
      await monthViewData.handleToggleHabit(habitId, date, count);
    },
    [monthViewData]
  );

  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (state.calendar.editingCalendar) {
        handleEditCalendar();
      } else {
        handleAddCalendar();
      }
    }
  };

  const handleHabitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (state.habit.editingHabit) {
        handleEditHabit();
      } else {
        handleAddHabit();
      }
    }
  };

  if (isLoading) {
    return <CalendarSkeletons view={view} />;
  }

  if (calendars.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <MotionCard
          key={calendarView}
          className="space-y-8 border p-2 shadow-md"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
        >
          <ViewControls calendarView={calendarView} onViewChange={onViewChange} />
          <div className="flex w-full flex-col gap-4 md:px-8">
            <div className="w-full">
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
                    onEditHabit={openEditHabit}
                    onToggleHabit={handleToggleHabit}
                    view={view}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-center pb-16">
            <Button variant="default" onClick={openNewCalendar}>
              <PlusCircle className="h-4 w-4" />
              {t("addCalendar")}
            </Button>
          </div>
        </MotionCard>
      </AnimatePresence>

      <NewCalendarDialog
        isOpen={state.calendar.isNewOpen}
        onOpenChange={() => resetCalendarState()}
        name={state.calendar.name}
        onNameChange={updateCalendarName}
        color={state.calendar.color}
        onColorChange={updateCalendarColor}
        onSubmit={handleAddCalendar}
        onKeyDown={handleCalendarKeyDown}
      />
      <NewHabitDialog
        isOpen={state.habit.isNewOpen}
        onOpenChange={() => resetHabitState()}
        name={state.habit.name}
        onNameChange={updateHabitName}
        timerDuration={state.habit.timerDuration}
        onTimerDurationChange={updateHabitTimer}
        onSubmit={handleAddHabit}
        onKeyDown={handleHabitKeyDown}
      />
      <EditCalendarDialog
        isOpen={state.calendar.isEditOpen}
        onOpenChange={() => resetCalendarState()}
        name={state.calendar.name}
        onNameChange={updateCalendarName}
        color={state.calendar.color}
        onColorChange={updateCalendarColor}
        onSubmit={handleEditCalendar}
        onDelete={handleDeleteCalendar}
      />
      <EditHabitDialog
        isOpen={state.habit.isEditOpen}
        onOpenChange={() => resetHabitState()}
        name={state.habit.name}
        onNameChange={updateHabitName}
        timerDuration={state.habit.timerDuration}
        onTimerDurationChange={updateHabitTimer}
        onSubmit={handleEditHabit}
        onDelete={handleDeleteHabit}
        onKeyDown={handleHabitKeyDown}
      />
    </>
  );
}
