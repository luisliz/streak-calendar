"use client";

import TimerModal from "@/components/timer-modal";
import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import { xIconPath } from "@/components/ui/x-icon";
import NumberFlow from "@number-flow/react";
import confettiLib from "canvas-confetti";
import { Minus, Plus, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";

/**
 * A versatile control component that handles completion tracking with optional timer functionality.
 * Supports increment/decrement operations and displays confetti animations on completion.
 */

interface CompleteControlsProps {
  /** Current count value */
  count: number;
  /** Callback to increment the count */
  onIncrement: () => Promise<void>;
  /** Callback to decrement the count */
  onDecrement: () => Promise<void>;
  /** Visual style variant for the buttons */
  variant?: "default" | "ghost";
  /** Timer duration in minutes (optional) */
  timerDuration?: number;
  /** Callback triggered on completion (increment/decrement/timer finish) */
  onComplete?: () => void;
  /** Name of the habit */
  habitName?: string;
  /** Whether the controls are disabled */
  disabled?: boolean;
}

export function CompleteControls({
  count,
  onIncrement,
  onDecrement,
  variant = "default",
  timerDuration,
  onComplete,
  habitName = "Timer",
  disabled = false,
}: CompleteControlsProps) {
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const timerButtonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("calendar.controls");

  // Handlers for increment/decrement with completion callback
  const handleIncrement = useCallback(async () => {
    await onIncrement();
    onComplete?.();
  }, [onIncrement, onComplete]);

  const handleDecrement = useCallback(async () => {
    await onDecrement();
    onComplete?.();
  }, [onDecrement, onComplete]);

  // Create custom X-shaped confetti particle
  const confettiShape = useMemo(() => confettiLib.shapeFromPath(xIconPath), []);

  /**
   * Configures confetti animation options
   * @param origin Optional origin point for the confetti animation
   */
  const getConfettiOptions = useCallback(
    (origin?: { x: number; y: number }) => ({
      angle: 90 + (Math.random() - 0.5) * 90,
      particleCount: 17,
      spread: 45 + Math.random() * 75,
      startVelocity: 35,
      gravity: 0.7,
      decay: 0.9,
      ticks: 200,
      colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
      shapes: [confettiShape],
      scalar: 1.5,
      origin: origin || { x: 0.5, y: 1 },
      disableForReducedMotion: false,
    }),
    [confettiShape]
  );

  const handleTimerComplete = useCallback(async () => {
    // Trigger confetti at the timer button's position
    if (timerButtonRef.current) {
      const rect = timerButtonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = rect.top / window.innerHeight;
      confettiLib(getConfettiOptions({ x, y }));
    }
    await handleIncrement();
  }, [getConfettiOptions, handleIncrement]);

  // Timer mode with count = 0: Show start button
  if (timerDuration) {
    if (count === 0) {
      return (
        <div className="flex w-[96px] flex-col gap-px">
          <Button
            ref={timerButtonRef}
            variant={variant}
            size="sm"
            className="flex h-6 w-[96px] items-center justify-center text-xs"
            onClick={() => setIsTimerModalOpen(true)}
            disabled={disabled}
          >
            {t("start")}
          </Button>
          <TimerModal
            isOpen={isTimerModalOpen}
            setIsOpen={setIsTimerModalOpen}
            onComplete={handleTimerComplete}
            timerDuration={timerDuration}
            habitName={habitName}
          />
        </div>
      );
    }

    // Timer mode with count > 0: Show decrement and timer controls
    return (
      <div className="flex w-[96px] flex-col gap-px">
        <div className="flex w-[96px] items-center justify-between">
          <Button
            variant={variant}
            size="icon"
            className="aspect-square h-6 w-6 rounded-full p-0"
            onClick={handleDecrement}
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-[72px] text-center font-medium">
            <NumberFlow value={count} format={{ style: "decimal" }} />
          </span>
          <Button
            ref={timerButtonRef}
            variant={variant}
            size="icon"
            className="aspect-square h-6 w-6 rounded-full p-0"
            onClick={() => setIsTimerModalOpen(true)}
            disabled={disabled}
          >
            <Timer className="h-4 w-4" />
          </Button>
          <TimerModal
            isOpen={isTimerModalOpen}
            setIsOpen={setIsTimerModalOpen}
            onComplete={handleTimerComplete}
            timerDuration={timerDuration}
            habitName={habitName}
          />
        </div>
      </div>
    );
  }

  // Non-timer mode with count = 0: Show complete button
  if (count === 0) {
    return (
      <div className="flex w-[96px] flex-col gap-px">
        <ConfettiButton
          variant={variant}
          size="sm"
          className="h-6 w-[96px] text-xs"
          onClick={handleIncrement}
          options={getConfettiOptions()}
          disabled={disabled}
        >
          {t("complete")}
        </ConfettiButton>
      </div>
    );
  }

  // Non-timer mode with count > 0: Show increment/decrement controls
  return (
    <div className="flex w-[96px] flex-col gap-px">
      <div className="flex w-[96px] items-center justify-between">
        <Button
          variant={variant}
          size="icon"
          className="aspect-square h-6 w-6 rounded-full p-0"
          onClick={handleDecrement}
          disabled={disabled}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-[72px] text-center font-medium">
          <NumberFlow value={count} format={{ style: "decimal" }} />
        </span>
        <ConfettiButton
          variant={variant}
          size="icon"
          className="aspect-square h-6 w-6 rounded-full p-0"
          onClick={handleIncrement}
          options={getConfettiOptions()}
          disabled={disabled}
        >
          <Plus className="h-4 w-4" />
        </ConfettiButton>
      </div>
    </div>
  );
}
