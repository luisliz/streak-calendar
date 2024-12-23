import { useState } from "react";

import { Id } from "@server/convex/_generated/dataModel";

type CalendarView = "monthRow" | "monthGrid";

export function useCalendarState() {
  const [selectedCalendar, setSelectedCalendar] = useState<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  } | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState("bg-red-500");
  const [editingCalendar, setEditingCalendar] = useState<{
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  } | null>(null);
  const [editCalendarName, setEditCalendarName] = useState("");
  const [editCalendarColor, setEditCalendarColor] = useState("");
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<CalendarView>("monthRow");

  return {
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
    calendarView,
    setCalendarView,
  };
}
