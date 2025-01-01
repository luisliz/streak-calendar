import { Calendar, EditingCalendar } from "@/types";
import { useState } from "react";

/**
 * Defines the two possible calendar visualization modes:
 * - monthRow: Displays habits in a horizontal timeline view
 * - monthGrid: Shows a traditional calendar grid layout (3 months on desktop, 1 on mobile)
 */
type CalendarView = "monthRow" | "monthGrid";

/**
 * Custom hook for managing calendar-related state in the application.
 * Handles all state management for:
 * - Calendar view mode (grid vs row layout)
 * - Calendar selection and editing
 * - New calendar creation
 * - Color theme management
 *
 * This hook centralizes all calendar UI state to make it easier to manage
 * across different components without prop drilling.
 */
export function useCalendarState() {
  // View mode state - controls how calendars are displayed
  // Change this value to switch between default views: "monthRow" | "monthGrid"
  const [calendarView, setCalendarView] = useState<CalendarView>("monthGrid");

  // Currently selected calendar for operations like adding habits
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);

  // States for creating new calendars
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState("bg-red-500"); // Default to red theme
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false);

  // States for editing existing calendars
  const [editingCalendar, setEditingCalendar] = useState<EditingCalendar | null>(null);
  const [editCalendarName, setEditCalendarName] = useState("");
  const [editCalendarColor, setEditCalendarColor] = useState("bg-red-500");

  // Return all state values and setters as a single object
  // This makes it easy to destructure only the needed states in components
  return {
    // View control
    calendarView,
    setCalendarView,
    // Selection management
    selectedCalendar,
    setSelectedCalendar,
    // New calendar creation
    newCalendarName,
    setNewCalendarName,
    newCalendarColor,
    setNewCalendarColor,
    isNewCalendarOpen,
    setIsNewCalendarOpen,
    // Calendar editing
    editingCalendar,
    setEditingCalendar,
    editCalendarName,
    setEditCalendarName,
    editCalendarColor,
    setEditCalendarColor,
  };
}
