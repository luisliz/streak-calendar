import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, GripHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

export type CalendarView = "monthRow" | "monthGrid";

interface ViewControlsProps {
  calendarView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const ViewControls = memo(function ViewControls({ calendarView, onViewChange }: ViewControlsProps) {
  const t = useTranslations("calendar.views");

  const handleValueChange = (value: string) => {
    onViewChange(value as CalendarView);
  };

  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Tabs value={calendarView} onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger asChild value="monthGrid">
              <button className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                {t("calendar")}
              </button>
            </TabsTrigger>
            <TabsTrigger asChild value="monthRow">
              <button className="flex items-center">
                <GripHorizontal className="mr-2 h-4 w-4" />
                {t("row")}
              </button>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
});
