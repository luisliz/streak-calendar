import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

type CalendarView = "monthGrid" | "monthRow";

export function useViewState() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const view: CalendarView = useMemo(() => (pathname?.endsWith("/row") ? "monthRow" : "monthGrid"), [pathname]);

  const setView = (view: CalendarView) => {
    localStorage.setItem("calendarView", view);
    if (view === "monthRow") {
      router.push(`/${params.locale}/calendar/row`);
    } else {
      router.push(`/${params.locale}/calendar`);
    }
  };

  return { view, setView };
}
