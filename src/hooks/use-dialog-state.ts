/**
 * Custom hook for managing dialog states in the application.
 * Handles state for both calendar and habit dialogs including:
 * - New/Edit modal visibility
 * - Form data (name, color, duration)
 * - Selected/Editing items
 */
import { Calendar, EditingCalendar, Id } from "@/types";
import { useCallback, useState } from "react";

/**
 * Interface defining the structure of dialog states
 * Includes separate states for calendar and habit dialogs
 */
interface DialogState {
  calendar: {
    /** Whether new calendar dialog is open */
    isNewOpen: boolean;
    /** Whether edit calendar dialog is open */
    isEditOpen: boolean;
    /** Currently editing calendar data */
    editingCalendar: EditingCalendar | null;
    /** Calendar name input value */
    name: string;
    /** Calendar color theme value */
    color: string;
  };
  habit: {
    /** Whether new habit dialog is open */
    isNewOpen: boolean;
    /** Whether edit habit dialog is open */
    isEditOpen: boolean;
    /** Currently editing habit data */
    editingHabit: { _id: Id<"habits">; name: string; timerDuration?: number } | null;
    /** Habit name input value */
    name: string;
    /** Optional timer duration in minutes */
    timerDuration?: number;
    /** Calendar selected for new habit */
    selectedCalendar: Calendar | null;
  };
}

/**
 * Hook for managing dialog states and actions
 * Provides functions for opening dialogs and updating form values
 */
export function useDialogState() {
  // Initialize dialog state with default values
  const [state, setState] = useState<DialogState>({
    calendar: {
      isNewOpen: false,
      isEditOpen: false,
      editingCalendar: null,
      name: "",
      color: "bg-red-500",
    },
    habit: {
      isNewOpen: false,
      isEditOpen: false,
      editingHabit: null,
      name: "",
      timerDuration: undefined,
      selectedCalendar: null,
    },
  });

  /**
   * Resets calendar dialog state to initial values
   * Used when closing calendar dialogs
   */
  const resetCalendarState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        isNewOpen: false,
        isEditOpen: false,
        editingCalendar: null,
        name: "",
        color: "bg-red-500",
      },
    }));
  }, []);

  /**
   * Resets habit dialog state to initial values
   * Used when closing habit dialogs
   */
  const resetHabitState = useCallback(() => {
    setState((prev) => ({
      ...prev,
      habit: {
        ...prev.habit,
        isNewOpen: false,
        isEditOpen: false,
        editingHabit: null,
        name: "",
        timerDuration: undefined,
      },
    }));
  }, []);

  /**
   * Opens the new calendar dialog
   */
  const openNewCalendar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, isNewOpen: true },
    }));
  }, []);

  /**
   * Opens the edit calendar dialog with existing calendar data
   */
  const openEditCalendar = useCallback((calendar: EditingCalendar) => {
    setState((prev) => ({
      ...prev,
      calendar: {
        ...prev.calendar,
        isEditOpen: true,
        editingCalendar: calendar,
        name: calendar.name,
        color: calendar.colorTheme,
      },
    }));
  }, []);

  /**
   * Opens the new habit dialog with selected calendar
   */
  const openNewHabit = useCallback((calendar: Calendar) => {
    setState((prev) => ({
      ...prev,
      habit: {
        ...prev.habit,
        isNewOpen: true,
        selectedCalendar: calendar,
      },
    }));
  }, []);

  /**
   * Opens the edit habit dialog with existing habit data
   */
  const openEditHabit = useCallback((habit: { _id: Id<"habits">; name: string; timerDuration?: number }) => {
    setState((prev) => ({
      ...prev,
      habit: {
        ...prev.habit,
        isEditOpen: true,
        editingHabit: habit,
        name: habit.name,
        timerDuration: habit.timerDuration,
      },
    }));
  }, []);

  /**
   * Updates calendar name in state
   */
  const updateCalendarName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, name },
    }));
  }, []);

  /**
   * Updates calendar color theme in state
   */
  const updateCalendarColor = useCallback((color: string) => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, color },
    }));
  }, []);

  /**
   * Updates habit name in state
   */
  const updateHabitName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      habit: { ...prev.habit, name },
    }));
  }, []);

  /**
   * Updates habit timer duration in state
   */
  const updateHabitTimer = useCallback((timerDuration?: number) => {
    setState((prev) => ({
      ...prev,
      habit: { ...prev.habit, timerDuration },
    }));
  }, []);

  return {
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
  };
}
