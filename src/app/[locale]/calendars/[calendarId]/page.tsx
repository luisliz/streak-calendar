import { CalendarDetails } from "@/components/calendar/calendar-details";

import { Id } from "@server/convex/_generated/dataModel";

interface PageProps {
  params: {
    locale: string;
    calendarId: Id<"calendars">;
  };
}

export default function CalendarPage({ params }: PageProps) {
  return <CalendarDetails calendarId={params.calendarId} />;
}

// Opt out of static rendering
export const dynamic = "force-dynamic";
