import { EditingHabit } from "@/types";
import { useState } from "react";

export function useHabitState() {
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabit, setEditingHabit] = useState<EditingHabit | null>(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [isNewHabitOpen, setIsNewHabitOpen] = useState(false);

  return {
    newHabitName,
    setNewHabitName,
    editingHabit,
    setEditingHabit,
    editHabitName,
    setEditHabitName,
    isNewHabitOpen,
    setIsNewHabitOpen,
  };
}
