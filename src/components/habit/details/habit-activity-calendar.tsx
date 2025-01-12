"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActivityCalendarTheme } from "@/lib/colors";
import { motion } from "framer-motion";
import { useRef } from "react";
import ActivityCalendar from "react-activity-calendar";

import { Id } from "@server/convex/_generated/dataModel";

interface HabitActivityCalendarProps {
  calendarData: Array<{
    date: string;
    count: number;
    level: number;
  }>;
  completions:
    | Array<{
        habitId: Id<"habits">;
        completedAt: number;
      }>
    | undefined;
  calendarSize: {
    blockSize: number;
    blockMargin: number;
    showLabels: boolean;
  };
  colorTheme: string;
}

export function HabitActivityCalendar({
  calendarData,
  completions,
  calendarSize,
  colorTheme,
}: HabitActivityCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = getActivityCalendarTheme(colorTheme);

  if (!completions) {
    return <Skeleton className="h-[150px] w-full" />;
  }

  if (calendarData.length === 0) {
    return null;
  }

  return (
    <Card className="border p-2 shadow-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
        onAnimationComplete={() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({
              left: containerRef.current.scrollWidth,
              behavior: "smooth",
            });
          }
        }}
      >
        <div className="overflow-x-auto" ref={containerRef}>
          <div className="inline-block">
            <ActivityCalendar
              data={calendarData}
              showWeekdayLabels={true}
              blockRadius={20}
              hideColorLegend={true}
              hideTotalCount={true}
              weekStart={0}
              blockSize={calendarSize.blockSize}
              blockMargin={calendarSize.blockMargin}
              fontSize={10}
              maxLevel={4}
              theme={theme}
            />
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
