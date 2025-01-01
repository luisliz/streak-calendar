import {
  EditCalendarDialog,
  EditHabitDialog,
  NewCalendarDialog,
  NewHabitDialog,
} from "@/components/calendar/calendar-dialogs";
import { CalendarItem } from "@/components/calendar/calendar-item";
import { ViewControls } from "@/components/calendar/view-controls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Completion, Day, EditingCalendar, Habit, Id } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useCallback } from "react";
import { toast } from "react-hot-toast";

/**
 * CalendarContainer is the main component that manages the calendar UI and interactions.
 * It handles calendar and habit management, including creation, editing, and deletion.
 * The component uses a combination of dialogs for user interactions and displays calendars
 * in either a month row or month grid view.
 */

const MotionCard = motion.create(Card);

/**
 * Supported calendar view types
 */
type CalendarView = "monthRow" | "monthGrid";

/**
 * EmptyState component shown when no calendars exist
 * Prompts user to create their first calendar
 */
const EmptyState = ({
  handleAddCalendar,
  handleCalendarKeyDown,
  isNewCalendarOpen,
  newCalendarColor,
  newCalendarName,
  setIsNewCalendarOpen,
  setNewCalendarColor,
  setNewCalendarName,
}: {
  handleAddCalendar: (name: string, color: string) => Promise<void>;
  handleCalendarKeyDown: (e: React.KeyboardEvent) => void;
  isNewCalendarOpen: boolean;
  newCalendarColor: string;
  newCalendarName: string;
  setIsNewCalendarOpen: (open: boolean) => void;
  setNewCalendarColor: (color: string) => void;
  setNewCalendarName: (name: string) => void;
}) => (
  <>
    <div className="py-12 text-center text-muted-foreground">
      <p>You haven&apos;t created any calendars yet.</p>
      <p className="mt-2">Create one to start tracking your habits!</p>
      <Button variant="default" onClick={() => setIsNewCalendarOpen(true)} className="mt-4">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Calendar
      </Button>
    </div>
    <NewCalendarDialog
      color={newCalendarColor}
      isOpen={isNewCalendarOpen}
      name={newCalendarName}
      onColorChange={setNewCalendarColor}
      onKeyDown={handleCalendarKeyDown}
      onNameChange={setNewCalendarName}
      onOpenChange={setIsNewCalendarOpen}
      onSubmit={() => handleAddCalendar(newCalendarName, newCalendarColor)}
    />
  </>
);

/**
 * Interface for calendar CRUD operations and habit tracking
 * Defines handlers for adding, editing, deleting calendars/habits and toggling habit completion
 */
interface CalendarData {
  handleAddCalendar: (name: string, color: string) => Promise<void>;
  handleAddHabit: (name: string, calendarId: Id<"calendars">, timerDuration?: number) => Promise<void>;
  handleEditCalendar: (id: Id<"calendars">, name: string, color: string) => Promise<void>;
  handleEditHabit: (id: Id<"habits">, name: string, timerDuration?: number) => Promise<void>;
  handleDeleteCalendar: (id: Id<"calendars">) => Promise<void>;
  handleDeleteHabit: (id: Id<"habits">) => Promise<void>;
  handleToggleHabit: (habitId: Id<"habits">, date: string, count: number) => Promise<void>;
}

/**
 * Interface for managing calendar state including selection, creation, and editing
 */
interface CalendarState {
  selectedCalendar: Calendar | null;
  setSelectedCalendar: (calendar: Calendar | null) => void;
  newCalendarName: string;
  setNewCalendarName: (name: string) => void;
  newCalendarColor: string;
  setNewCalendarColor: (color: string) => void;
  editingCalendar: EditingCalendar | null;
  setEditingCalendar: (calendar: EditingCalendar | null) => void;
  editCalendarName: string;
  setEditCalendarName: (name: string) => void;
  editCalendarColor: string;
  setEditCalendarColor: (color: string) => void;
  isNewCalendarOpen: boolean;
  setIsNewCalendarOpen: (open: boolean) => void;
}

/**
 * Interface for managing habit state including creation and editing
 */
interface HabitState {
  newHabitName: string;
  setNewHabitName: (name: string) => void;
  newHabitTimerDuration: number | undefined;
  setNewHabitTimerDuration: (duration: number | undefined) => void;
  editingHabit: { _id: Id<"habits">; name: string; timerDuration?: number } | null;
  setEditingHabit: (habit: { _id: Id<"habits">; name: string; timerDuration?: number } | null) => void;
  editHabitName: string;
  setEditHabitName: (name: string) => void;
  editHabitTimerDuration: number | undefined;
  setEditHabitTimerDuration: (duration: number | undefined) => void;
  isNewHabitOpen: boolean;
  setIsNewHabitOpen: (open: boolean) => void;
}

/**
 * Props interface for the CalendarContainer component
 */
interface CalendarContainerProps {
  calendarView: CalendarView;
  calendars: Calendar[];
  completions: Completion[];
  days: Day[];
  habits: Habit[];
  monthViewData: CalendarData;
  view: CalendarView;
  calendarState: CalendarState;
  habitState: HabitState;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarContainer({
  calendarView,
  calendars,
  completions,
  days,
  habits,
  monthViewData,
  view,
  calendarState,
  habitState,
  onViewChange,
}: CalendarContainerProps) {
  /**
   * Destructure state management props for easier access
   */
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
  } = habitState;

  /**
   * Handles calendar creation with validation and state reset
   */
  const handleAddCalendar = useCallback(
    async (name: string, color: string) => {
      await monthViewData.handleAddCalendar(name, color);
      setNewCalendarName("");
      setNewCalendarColor("bg-red-500");
      setIsNewCalendarOpen(false);
    },
    [monthViewData, setNewCalendarName, setNewCalendarColor, setIsNewCalendarOpen]
  );

  /**
   * Handles habit creation with error handling and state reset
   */
  const handleAddHabit = useCallback(
    async (name: string, calendarId: Id<"calendars">, timerDuration?: number) => {
      try {
        await monthViewData.handleAddHabit(name, calendarId, timerDuration);
        setNewHabitName("");
        setNewHabitTimerDuration(undefined);
        setIsNewHabitOpen(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add habit");
      }
    },
    [monthViewData, setNewHabitName, setNewHabitTimerDuration, setIsNewHabitOpen]
  );

  /**
   * Handles calendar updates and resets editing state
   */
  const handleEditCalendar = useCallback(
    async (id: Id<"calendars">, name: string, color: string) => {
      await monthViewData.handleEditCalendar(id, name, color);
      setEditingCalendar(null);
    },
    [monthViewData, setEditingCalendar]
  );

  /**
   * Handles habit updates with error handling and resets editing state
   */
  const handleEditHabit = useCallback(
    async (id: Id<"habits">, name: string, timerDuration?: number) => {
      try {
        await monthViewData.handleEditHabit(id, name, timerDuration);
        setEditingHabit(null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to edit habit");
      }
    },
    [monthViewData, setEditingHabit]
  );

  /**
   * Handles calendar deletion and resets editing state
   */
  const handleDeleteCalendar = useCallback(
    async (id: Id<"calendars">) => {
      await monthViewData.handleDeleteCalendar(id);
      setEditingCalendar(null);
    },
    [monthViewData, setEditingCalendar]
  );

  /**
   * Handles habit deletion and resets editing state
   */
  const handleDeleteHabit = useCallback(
    async (id: Id<"habits">) => {
      await monthViewData.handleDeleteHabit(id);
      setEditingHabit(null);
    },
    [monthViewData, setEditingHabit]
  );

  /**
   * Handles toggling habit completion for a specific date
   */
  const handleToggleHabit = useCallback(
    async (habitId: Id<"habits">, date: string, count: number) => {
      await monthViewData.handleToggleHabit(habitId, date, count);
    },
    [monthViewData]
  );

  /**
   * Sets up habit editing state when edit is initiated
   */
  const handleEditHabitClick = useCallback(
    (habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => {
      setEditingHabit(habit);
      setEditHabitName(habit.name);
      setEditHabitTimerDuration(habit.timerDuration);
    },
    [setEditingHabit, setEditHabitName, setEditHabitTimerDuration]
  );

  /**
   * Handles keyboard events for calendar creation/editing
   * Submits on Enter key press
   */
  const handleCalendarKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingCalendar) {
        handleEditCalendar(editingCalendar._id, editCalendarName, editCalendarColor);
      } else {
        handleAddCalendar(newCalendarName, newCalendarColor);
      }
    }
  };

  /**
   * Handles keyboard events for habit creation/editing
   * Submits on Enter key press
   */
  const handleHabitKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editingHabit) {
        handleEditHabit(editingHabit._id, editHabitName, editHabitTimerDuration);
      } else if (selectedCalendar) {
        handleAddHabit(newHabitName, selectedCalendar._id, newHabitTimerDuration);
      }
    }
  };

  /**
   * Show empty state if no calendars exist
   */
  if (calendars.length === 0) {
    return (
      <EmptyState
        isNewCalendarOpen={isNewCalendarOpen}
        setIsNewCalendarOpen={setIsNewCalendarOpen}
        newCalendarName={newCalendarName}
        setNewCalendarName={setNewCalendarName}
        newCalendarColor={newCalendarColor}
        setNewCalendarColor={setNewCalendarColor}
        handleAddCalendar={handleAddCalendar}
        handleCalendarKeyDown={handleCalendarKeyDown}
      />
    );
  }

  return (
    <>
      {/* Animated calendar view container */}
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
          className="space-y-8 border p-2 shadow-md"
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
                    onAddHabit={() => {
                      setSelectedCalendar(calendar);
                      setIsNewHabitOpen(true);
                    }}
                    onEditCalendar={() => {
                      setEditingCalendar(calendar);
                      setEditCalendarName(calendar.name);
                      setEditCalendarColor(calendar.colorTheme);
                    }}
                    onEditHabit={handleEditHabitClick}
                    onToggleHabit={handleToggleHabit}
                    view={view}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-center pb-4">
            <Button variant="default" onClick={() => setIsNewCalendarOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Calendar
            </Button>
          </div>
        </MotionCard>
      </AnimatePresence>

      <NewCalendarDialog
        isOpen={isNewCalendarOpen}
        onOpenChange={setIsNewCalendarOpen}
        name={newCalendarName}
        onNameChange={setNewCalendarName}
        color={newCalendarColor}
        onColorChange={setNewCalendarColor}
        onSubmit={() => handleAddCalendar(newCalendarName, newCalendarColor)}
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
          }
        }}
        onDelete={() => {
          if (editingCalendar) {
            handleDeleteCalendar(editingCalendar._id);
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
          }
        }}
        onDelete={() => {
          if (editingHabit) {
            handleDeleteHabit(editingHabit._id);
          }
        }}
        onKeyDown={handleHabitKeyDown}
      />
    </>
  );
}
