"use client";

import { CalendarContainer } from "@/components/calendar/calendar-container";
import { ImportExport } from "@/components/calendar/import-export";
import { YearlyOverview } from "@/components/calendar/yearly-overview";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { useCalendarState } from "@/hooks/use-calendar-state";
import { useDateRange } from "@/hooks/use-date-range";
import { useHabitState } from "@/hooks/use-habit-state";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

/**
 * Calendar Page Component
 *
 * This client-side component serves as the main calendar view page, featuring:
 * - Monthly and yearly calendar views
 * - Authentication protection
 * - Data prefetching for both view modes
 * - Habit and completion tracking
 */

/**
 * Authentication wrapper component that handles user authentication state
 * Shows sign-in button for unauthenticated users and renders children for authenticated users
 */
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

export default function CalendarsPage() {
  // Initialize calendar view state and habit management
  const { calendarView, setCalendarView, ...calendarState } = useCalendarState();
  const habitState = useHabitState();

  // Pre-fetch data for both monthly (40 days) and yearly (365 days) views
  // This ensures smooth transitions between views without loading states
  const monthData = useDateRange(40);
  const yearData = useDateRange(365);
  const monthViewData = useCalendarData(monthData.startDate, monthData.today);
  const yearViewData = useCalendarData(yearData.startDate, yearData.today);

  // Dynamically select date range based on current view
  const { days } = useMemo(
    () => (calendarView === "monthRow" ? monthData : yearData),
    [calendarView, monthData, yearData]
  );

  // Extract and memoize calendar and habit data to prevent unnecessary rerenders
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
          {/* Yearly overview component showing habit completion heatmap */}
          <YearlyOverview
            completions={yearViewData.completions || []}
            habits={habits}
            calendars={calendars}
            isLoading={yearViewData.isLoading}
          />
          {/* Main calendar component with month/year view toggle */}
          <CalendarContainer
            calendarState={calendarState}
            calendarView={calendarView}
            calendars={calendars}
            completions={monthViewData.completions || []}
            days={days}
            habitState={habitState}
            habits={habits}
            monthViewData={monthViewData}
            onViewChange={setCalendarView}
            view={calendarView}
            isLoading={monthViewData.isLoading}
          />
          {/* Import/Export functionality for calendar data */}
          <div className="mx-4 my-8 justify-center">
            <ImportExport />
          </div>
        </>
      </AuthenticationWrapper>
    </div>
  );
}
