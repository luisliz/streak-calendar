"use client";

import { AuthenticationWrapper } from "@/components/authentication-wrapper";
import { CalendarContainer } from "@/components/calendar/calendar-container";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useDateRange } from "@/hooks/use-date-range";
import { useViewState } from "@/hooks/use-view-state";
import { memo, useMemo } from "react";

const MemoizedCalendarContainer = memo(CalendarContainer);
const MemoizedYearlyOverview = memo(YearlyOverview);

export default function CalendarPage() {
  const { view, setView } = useViewState();
  const isMonthView = view === "monthRow";

  // Keep both data sets loaded to prevent loading states during view changes
  const monthData = useDateRange(40);
  const yearData = useDateRange(365);
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  const days = isMonthView ? monthData.days : yearData.days;
  const memoizedData = useMemo(
    () => ({
      calendars: monthViewData.calendars || [],
      habits: monthViewData.habits || [],
      completions: monthViewData.completions || [],
    }),
    [monthViewData.calendars, monthViewData.habits, monthViewData.completions]
  );

  // Only show loading on initial load
  const isLoading = !monthViewData.calendars || !monthViewData.habits || !monthViewData.completions;

  return (
    <div className="container mx-auto max-w-7xl">
      <AuthenticationWrapper>
        <>
          <MemoizedYearlyOverview
            completions={yearViewData.completions || []}
            habits={memoizedData.habits}
            calendars={memoizedData.calendars}
            isLoading={isLoading}
          />
          <MemoizedCalendarContainer
            calendarView={view}
            calendars={memoizedData.calendars}
            completions={memoizedData.completions}
            days={days}
            habits={memoizedData.habits}
            monthViewData={monthViewData}
            onViewChange={setView}
            view={view}
            isLoading={isLoading}
          />
          <div className="mx-4 my-8 justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>
    </div>
  );
}
