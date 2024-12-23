import { useMemo } from "react";

// Helper function to generate date range for habit tracking
// Returns today's date, start date, and array of date strings in ISO format
const getDatesForRange = (daysBack: number) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysBack);

  const days = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    days.push(dateStr);
  }

  return {
    today,
    startDate,
    days,
  };
};

export function useDateRange(daysBack: number = 30) {
  const { today, startDate, days } = useMemo(() => getDatesForRange(daysBack), [daysBack]);

  return {
    today,
    startDate,
    days,
  };
}
