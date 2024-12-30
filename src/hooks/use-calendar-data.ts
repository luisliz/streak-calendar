import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

export function useCalendarData(startDate: Date, endDate: Date) {
  const { isAuthenticated } = useConvexAuth();

  // Database queries
  const calendars = useQuery(api.calendars.list, isAuthenticated ? {} : "skip");
  const habits = useQuery(api.habits.list, isAuthenticated ? { calendarId: undefined } : "skip");
  const completions = useQuery(
    api.habits.getCompletions,
    isAuthenticated
      ? {
          startDate: startDate.getTime(),
          endDate: endDate.getTime(),
        }
      : "skip"
  );

  // Database mutations
  const createCalendar = useMutation(api.calendars.create);
  const createHabit = useMutation(api.habits.create);
  const markComplete = useMutation(api.habits.markComplete);
  const updateCalendar = useMutation(api.calendars.update);
  const updateHabit = useMutation(api.habits.update);
  const deleteCalendar = useMutation(api.calendars.remove);
  const deleteHabit = useMutation(api.habits.remove);

  // Handler functions
  const handleAddCalendar = async (name: string, colorTheme: string) => {
    if (!name.trim()) return;
    await createCalendar({
      name,
      colorTheme,
    });
  };

  const handleAddHabit = async (name: string, calendarId: Id<"calendars">, timerDuration?: number) => {
    if (!name.trim()) return;
    await createHabit({
      name,
      calendarId,
      timerDuration,
    });
  };

  const handleEditCalendar = async (id: Id<"calendars">, name: string, colorTheme: string) => {
    if (!name.trim()) return;
    await updateCalendar({
      id,
      name,
      colorTheme,
    });
  };

  const handleEditHabit = async (id: Id<"habits">, name: string, timerDuration?: number) => {
    if (!name.trim()) return;
    await updateHabit({
      id,
      name,
      timerDuration,
    });
  };

  const handleDeleteCalendar = async (id: Id<"calendars">) => {
    await deleteCalendar({ id });
  };

  const handleDeleteHabit = async (id: Id<"habits">) => {
    await deleteHabit({ id });
  };

  const handleToggleHabit = async (habitId: Id<"habits">, date: string, count: number) => {
    const timestamp = new Date(date).getTime();
    await markComplete({
      habitId,
      completedAt: timestamp,
      count,
    });
  };

  return {
    isAuthenticated,
    calendars: calendars ?? [],
    habits: habits ?? [],
    completions: completions ?? [],
    handleAddCalendar,
    handleAddHabit,
    handleEditCalendar,
    handleEditHabit,
    handleDeleteCalendar,
    handleDeleteHabit,
    handleToggleHabit,
  };
}
