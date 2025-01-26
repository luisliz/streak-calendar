"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

interface CompleteTimerProps {
  count: number;
  timerDuration: number;
  onComplete: () => Promise<void>;
  disabled?: boolean;
  habitId: Id<"habits">;
  variant?: "default" | "ghost";
}

export function CompleteTimer({
  count,
  timerDuration,
  onComplete,
  disabled = false,
  habitId,
  variant = "default",
}: CompleteTimerProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const hasCompletedRef = useRef(false);
  const t = useTranslations("calendar.controls");
  const schedule = useMutation(api.habits.scheduleHabitIncrement);
  const cancelSchedule = useMutation(api.habits.cancelScheduledIncrement);
  const habit = useQuery(api.habits.get, habitId ? { id: habitId } : "skip");

  const handleStartTimer = useCallback(
    async (durationMs: number) => {
      if (!habitId) return;

      setIsScheduling(true);
      try {
        if (habit?.scheduledTimer) {
          await cancelSchedule({ habitId });
        }
        await schedule({
          habitId,
          durationMs,
          clientNow: Date.now(),
        });
      } catch (error) {
        console.error("Schedule mutation failed:", error);
      } finally {
        setIsScheduling(false);
      }
    },
    [habitId, schedule, cancelSchedule, habit]
  );

  const handleStopTimer = useCallback(async () => {
    if (!habitId) return;
    try {
      await cancelSchedule({ habitId });
      setTimeLeft(null);
    } catch (error) {
      console.error("Failed to cancel schedule:", error);
    }
  }, [habitId, cancelSchedule]);

  useEffect(() => {
    if (!habit?.timerEnd) {
      setTimeLeft(null);
      hasCompletedRef.current = false;
      return;
    }

    const updateTime = () => {
      const remaining = habit.timerEnd! - Date.now();
      if (remaining <= 0) {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setTimeLeft(null);
          onComplete();
        }
        return;
      }
      setTimeLeft(remaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [habit?.timerEnd, onComplete]);

  // Always use the full width timer UI
  return (
    <Button
      variant={variant}
      size="sm"
      className="h-6 w-full text-xs"
      onClick={() => (!timeLeft ? handleStartTimer(timerDuration * 60 * 1000) : handleStopTimer())}
      disabled={disabled || isScheduling}
    >
      {timeLeft !== null && timeLeft > 0 ? (
        `${Math.ceil(timeLeft / 1000)}s`
      ) : isScheduling ? (
        t("scheduling")
      ) : count > 0 ? (
        <Timer className="h-4 w-4" />
      ) : (
        t("start")
      )}
    </Button>
  );
}
