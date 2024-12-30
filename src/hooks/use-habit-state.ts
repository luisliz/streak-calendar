import { EditingHabit } from "@/types";
import { useState } from "react";

export function useHabitState() {
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTimerDuration, setNewHabitTimerDuration] = useState<number | undefined>(undefined);
  const [editingHabit, setEditingHabit] = useState<EditingHabit | null>(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [editHabitTimerDuration, setEditHabitTimerDuration] = useState<number | undefined>(undefined);
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);

  return {
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
  };
}
