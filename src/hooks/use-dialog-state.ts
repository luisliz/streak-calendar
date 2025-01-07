import { Calendar, EditingCalendar, Id } from "@/types";
import { useCallback, useState } from "react";

interface DialogState {
  calendar: {
    isNewOpen: boolean;
    isEditOpen: boolean;
    editingCalendar: EditingCalendar | null;
    name: string;
    color: string;
  };
  habit: {
    isNewOpen: boolean;
    isEditOpen: boolean;
    editingHabit: { _id: Id<"habits">; name: string; timerDuration?: number } | null;
    name: string;
    timerDuration?: number;
    selectedCalendar: Calendar | null;
  };
}

export function useDialogState() {
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

  const openNewCalendar = useCallback(() => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, isNewOpen: true },
    }));
  }, []);

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

  const updateCalendarName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, name },
    }));
  }, []);

  const updateCalendarColor = useCallback((color: string) => {
    setState((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, color },
    }));
  }, []);

  const updateHabitName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      habit: { ...prev.habit, name },
    }));
  }, []);

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
