import { CalendarDetails } from "@/components/calendar/calendar-details";

import { Id } from "@server/convex/_generated/dataModel";

interface PageProps {
  params: Promise<{
    locale: string;
    calendarId: Id<"calendars">;
  }>;
}

export default async function CalendarPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CalendarDetails calendarId={resolvedParams.calendarId} />;
}

// Opt out of static rendering
export const dynamic = "force-dynamic";
