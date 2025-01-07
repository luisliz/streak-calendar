import { useCallback, useState } from "react";

type CalendarView = "monthGrid" | "monthRow";

export function useViewState() {
  const [localView, setLocalView] = useState<CalendarView>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("calendarView") as CalendarView) || "monthGrid";
    }
    return "monthGrid";
  });

  const setView = useCallback((newView: CalendarView) => {
    setLocalView(newView);
    if (typeof window !== "undefined") {
      localStorage.setItem("calendarView", newView);
    }
  }, []);

  return { view: localView, setView };
}
