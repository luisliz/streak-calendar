"use client";

import { AuthenticationWrapper } from "@/components/authentication-wrapper";
import { CalendarContainer } from "@/components/calendar/calendar-container";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useDateRange } from "@/hooks/use-date-range";
import { useViewState } from "@/hooks/use-view-state";
import { useMemo } from "react";

export default function CalendarPage() {
  const { view, setView } = useViewState();

  const monthData = useDateRange(40);
  const yearData = useDateRange(365);
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  const { days } = useMemo(() => (view === "monthRow" ? monthData : yearData), [view, monthData, yearData]);

  const { calendars, habits } = useMemo(
    () => ({
      calendars: monthViewData.calendars || [],
      habits: monthViewData.habits || [],
    }),
    [monthViewData.calendars, monthViewData.habits]
  );

  return (
    <div className="container mx-auto max-w-7xl">
      <AuthenticationWrapper>
        <>
          <YearlyOverview
            completions={yearViewData.completions || []}
            habits={habits}
            calendars={calendars}
            isLoading={yearViewData.isLoading}
          />
          <CalendarContainer
            calendarView={view}
            calendars={calendars}
            completions={monthViewData.completions || []}
            days={days}
            habits={habits}
            monthViewData={monthViewData}
            onViewChange={setView}
            view={view}
            isLoading={monthViewData.isLoading}
          />
          <div className="mx-4 my-8 justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>
    </div>
  );
}
