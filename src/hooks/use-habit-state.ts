import { useState } from "react";

import { Id } from "@server/convex/_generated/dataModel";

export function useHabitState() {
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabit, setEditingHabit] = useState<{ _id: Id<"habits">; name: string } | null>(null);
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
