import { Calendar, EditingCalendar } from "@/types";
import { useState } from "react";

type CalendarView = "monthRow" | "monthGrid";

export function useCalendarState() {
  const [calendarView, setCalendarView] = useState<CalendarView>("monthRow");
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [newCalendarName, setNewCalendarName] = useState("");
  const [newCalendarColor, setNewCalendarColor] = useState("bg-red-500");
  const [editingCalendar, setEditingCalendar] = useState<EditingCalendar | null>(null);
  const [editCalendarName, setEditCalendarName] = useState("");
  const [editCalendarColor, setEditCalendarColor] = useState("bg-red-500");
  const [isNewCalendarOpen, setIsNewCalendarOpen] = useState(false);

  return {
    calendarView,
    setCalendarView,
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
  };
}
