import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

/**
 * Custom hook for managing calendar-related data and operations.
 * Provides centralized access to calendars, habits, and completions data,
 * along with mutation functions for CRUD operations.
 */

export function useCalendarData(startDate: Date, endDate: Date) {
  const { isAuthenticated } = useConvexAuth();

  // Database queries
  /**
   * Fetch user's calendars if authenticated, otherwise skip
   * Returns array of calendar objects with their metadata
   */
  const calendarsQuery = useQuery(api.calendars.list, isAuthenticated ? {} : "skip");

  /**
   * Fetch all habits across calendars if authenticated
   * calendarId: undefined fetches habits from all calendars
   */
  const habitsQuery = useQuery(api.habits.list, isAuthenticated ? { calendarId: undefined } : "skip");

  /**
   * Fetch habit completion data within the specified date range
   * Converts dates to timestamps for database query
   */
  const completionsQuery = useQuery(
    api.habits.getCompletions,
    isAuthenticated
      ? {
          startDate: startDate.getTime(),
          endDate: endDate.getTime(),
        }
      : "skip"
  );

  // Database mutations for CRUD operations
  const createCalendar = useMutation(api.calendars.create);
  const createHabit = useMutation(api.habits.create);
  const markComplete = useMutation(api.habits.markComplete);
  const updateCalendar = useMutation(api.calendars.update);
  const updateHabit = useMutation(api.habits.update);
  const deleteCalendar = useMutation(api.calendars.remove);
  const deleteHabit = useMutation(api.habits.remove);

  /**
   * Creates a new calendar with specified name and color theme
   * @param name - Calendar name
   * @param colorTheme - Color theme identifier for the calendar
   */
  const handleAddCalendar = async (name: string, colorTheme: string) => {
    if (!name.trim()) return;
    await createCalendar({
      name,
      colorTheme,
    });
  };

  /**
   * Creates a new habit within a specified calendar
   * @param name - Habit name
   * @param calendarId - ID of the parent calendar
   * @param timerDuration - Optional duration for habit timer in seconds
   */
  const handleAddHabit = async (name: string, calendarId: Id<"calendars">, timerDuration?: number) => {
    if (!name.trim()) return;
    await createHabit({
      name,
      calendarId,
      timerDuration,
    });
  };

  /**
   * Updates existing calendar properties
   * @param id - Calendar ID to update
   * @param name - New calendar name
   * @param colorTheme - New color theme
   */
  const handleEditCalendar = async (id: Id<"calendars">, name: string, colorTheme: string) => {
    if (!name.trim()) return;
    await updateCalendar({
      id,
      name,
      colorTheme,
    });
  };

  /**
   * Updates existing habit properties
   * @param id - Habit ID to update
   * @param name - New habit name
   * @param timerDuration - New timer duration in seconds
   */
  const handleEditHabit = async (id: Id<"habits">, name: string, timerDuration?: number) => {
    if (!name.trim()) return;
    await updateHabit({
      id,
      name,
      timerDuration,
    });
  };

  /**
   * Deletes a calendar and all associated habits
   * @param id - Calendar ID to delete
   */
  const handleDeleteCalendar = async (id: Id<"calendars">) => {
    await deleteCalendar({ id });
  };

  /**
   * Deletes a specific habit
   * @param id - Habit ID to delete
   */
  const handleDeleteHabit = async (id: Id<"habits">) => {
    await deleteHabit({ id });
  };

  /**
   * Toggles habit completion status for a specific date
   * @param habitId - Habit to toggle
   * @param date - ISO date string for the completion
   * @param count - Number of times completed (for habits that can be done multiple times)
   */
  const handleToggleHabit = async (habitId: Id<"habits">, date: string, count: number) => {
    const timestamp = new Date(date).getTime();
    await markComplete({
      habitId,
      completedAt: timestamp,
      count,
    });
  };

  // Loading state is true if any of the main queries haven't returned yet
  const isLoading = calendarsQuery === undefined || habitsQuery === undefined || completionsQuery === undefined;

  return {
    isAuthenticated,
    isLoading,
    calendars: calendarsQuery,
    habits: habitsQuery,
    completions: completionsQuery,
    handleAddCalendar,
    handleAddHabit,
    handleEditCalendar,
    handleEditHabit,
    handleDeleteCalendar,
    handleDeleteHabit,
    handleToggleHabit,
  };
}
