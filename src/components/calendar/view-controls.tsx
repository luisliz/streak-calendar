import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, GripHorizontal } from "lucide-react";

export type CalendarView = "monthRow" | "monthGrid";

interface ViewControlsProps {
  calendarView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function ViewControls({ calendarView, onViewChange }: ViewControlsProps) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-4">
        <Tabs value={calendarView} onValueChange={(value) => onViewChange(value as CalendarView)}>
          <TabsList>
            <TabsTrigger value="monthRow">
              <GripHorizontal className="mr-2 h-4 w-4" />
              Rows View
            </TabsTrigger>
            <TabsTrigger value="monthGrid">
              <CalendarDays className="mr-2 h-4 w-4" />
              Grids View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
