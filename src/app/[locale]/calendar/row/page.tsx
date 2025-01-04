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
import { useParams, useRouter } from "next/navigation";
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

export default function CalendarRowPage() {
  const router = useRouter();
  const params = useParams();
  const { calendarView, ...calendarState } = useCalendarState();
  const habitState = useHabitState();

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
            calendarView="monthRow"
            calendars={calendars}
            completions={monthViewData.completions || []}
            days={days}
            habitState={habitState}
            habits={habits}
            monthViewData={monthViewData}
            onViewChange={(view) => {
              if (view === "monthGrid") {
                router.push(`/${params.locale}/calendar`);
              }
            }}
            view="monthRow"
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
