import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type CalendarView = "monthGrid" | "monthRow";

export function useViewState() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Check if we're on the main calendar route
    if (window.location.pathname === `/${params.locale}/calendar`) {
      // Get last used view from localStorage
      const lastView = localStorage.getItem("calendarView") as CalendarView;

      // If user previously used row view, redirect them there
      if (lastView === "monthRow") {
        router.push(`/${params.locale}/calendar/row`);
      }
    }
  }, [params.locale, router]);

  const setView = (view: CalendarView) => {
    // Save view preference
    localStorage.setItem("calendarView", view);

    // Navigate to appropriate route
    if (view === "monthRow") {
      router.push(`/${params.locale}/calendar/row`);
    } else {
      router.push(`/${params.locale}/calendar`);
    }
  };

  return { setView };
}
