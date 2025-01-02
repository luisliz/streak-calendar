import { EditingHabit } from "@/types";
import { useState } from "react";

/**
 * Custom hook for managing habit-related state in the application.
 * Handles both new habit creation and existing habit editing states.
 */

export function useHabitState() {
  // State for creating new habits
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTimerDuration, setNewHabitTimerDuration] = useState<number | undefined>(undefined);

  // State for editing existing habits
  const [editingHabit, setEditingHabit] = useState<EditingHabit | null>(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [editHabitTimerDuration, setEditHabitTimerDuration] = useState<number | undefined>(undefined);

  // Modal control state
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);

  return {
    // New habit form states
    newHabitName,
    setNewHabitName,
    newHabitTimerDuration,
    setNewHabitTimerDuration,

    // Edit habit form states
    editingHabit,
    setEditingHabit,
    editHabitName,
    setEditHabitName,
    editHabitTimerDuration,
    setEditHabitTimerDuration,

    // Modal control
    isNewHabitOpen,
    setIsNewHabitOpen,
  };
}
