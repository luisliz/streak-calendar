"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ThemeInput } from "react-activity-calendar";
import ActivityCalendarBase from "react-activity-calendar";

import { Id } from "@server/convex/_generated/dataModel";

interface ActivityCalendarProps {
  habitId: Id<"habits">;
  completions: Array<{ completedAt: number; habitId: Id<"habits"> }> | undefined;
}

const habitTheme: ThemeInput = {
  light: [
    "rgb(124 124 124 / 0.1)",
    "rgb(239 68 68 / 0.3)",
    "rgb(239 68 68 / 0.5)",
    "rgb(239 68 68 / 0.7)",
    "rgb(239 68 68 / 0.85)",
  ],
  dark: [
    "rgb(124 124 124 / 0.1)",
    "rgb(239 68 68 / 0.3)",
    "rgb(239 68 68 / 0.5)",
    "rgb(239 68 68 / 0.7)",
    "rgb(239 68 68 / 0.85)",
  ],
};

/**
 * Determines calendar block size and margin based on viewport width.
 * Uses media queries to provide responsive sizing:
 * - Desktop (lg): 12px blocks, 4px margin
 * - Tablet (md): 10px blocks, 3px margin
 * - Mobile: 8px blocks, 2px margin
 */
function getCalendarSize() {
  if (typeof window === "undefined")
    return {
      blockSize: 5,
      blockMargin: 2,
      showLabels: false,
    };

  const isLg = window.matchMedia("(min-width: 1024px)").matches;
  const isMd = window.matchMedia("(min-width: 768px)").matches;

  if (isLg) return { blockSize: 12, blockMargin: 2, showLabels: true };
  if (isMd) return { blockSize: 8, blockMargin: 1, showLabels: true };
  return { blockSize: 6, blockMargin: 1, showLabels: false };
}

export function ActivityCalendar({ habitId, completions }: ActivityCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarSize, setCalendarSize] = useState(getCalendarSize());

  useEffect(() => {
    function handleResize() {
      setCalendarSize(getCalendarSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dateRange = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);

    return {
      startDate: start.getTime(),
      endDate: end.getTime(),
    };
  }, []);

  const calendarData = useMemo(() => {
    if (!completions) return [];

    // Initialize map with zero counts for all dates in range
    const dates = new Map();
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.set(d.toISOString().split("T")[0], 0);
    }

    // Count completions per day
    completions
      .filter((completion) => completion.habitId === habitId)
      .forEach((completion) => {
        const date = new Date(completion.completedAt).toISOString().split("T")[0];
        if (dates.has(date)) {
          dates.set(date, (dates.get(date) || 0) + 1);
        }
      });

    // Convert to activity calendar format
    const calendarDataResult = Array.from(dates).map(([date, count]) => {
      let level;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else level = 4;

      return {
        date,
        count,
        level,
      };
    });

    return calendarDataResult;
  }, [completions, habitId, dateRange]);

  useEffect(() => {
    if (containerRef.current && calendarData.length > 0) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: "smooth",
        });
      }, 150);
    }
  }, [calendarData]);

  if (!completions) {
    return <Skeleton className="h-[150px] w-[600px]" />;
  }

  if (calendarData.length === 0) {
    return null;
  }

  return (
    <Card className="max-w-[800px] border p-2 shadow-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0, 0.7, 0.1, 1] }}
        className="overflow-x-auto"
        ref={containerRef}
      >
        <div className="flex min-w-fit justify-center p-4">
          <ActivityCalendarBase
            data={calendarData}
            labels={{
              totalCount: "{{count}} completions in the last year",
            }}
            showWeekdayLabels={false}
            blockRadius={20}
            hideColorLegend={true}
            hideTotalCount={true}
            weekStart={0}
            blockSize={calendarSize.blockSize}
            blockMargin={calendarSize.blockMargin}
            fontSize={10}
            maxLevel={4}
            theme={habitTheme}
          />
        </div>
      </motion.div>
    </Card>
  );
}
