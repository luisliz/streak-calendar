"use client";

import { CalendarContainer } from "@/components/calendar/calendar-container";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { useViewState } from "@/hooks/use-view-state";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const AuthenticationWrapper = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("auth");
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">{t("signInPrompt")}</h2>
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              {t("signIn")}
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
};

export default function CalendarPage() {
  const { calendarView, ...calendarState } = useCalendarState();
  const habitState = useHabitState();
  const { setView } = useViewState();

  const monthData = useDateRange(40);
  const yearData = useDateRange(365);
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  const { days } = useMemo(
    () => (calendarView === "monthRow" ? monthData : yearData),
    [calendarView, monthData, yearData]
  );

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
            calendarState={calendarState}
            calendarView="monthGrid"
            calendars={calendars}
            completions={monthViewData.completions || []}
            days={days}
            habitState={habitState}
            habits={habits}
            monthViewData={monthViewData}
            onViewChange={setView}
            view="monthGrid"
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
