"use client";

import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import confettiLib from "canvas-confetti";
import { Minus, Plus, Timer } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const xLogoPath = `M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z`;

interface CompleteControlsProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  variant?: "default" | "ghost";
  timerDuration?: number;
}

export function CompleteControls({
  count,
  onIncrement,
  onDecrement,
  variant = "default",
  timerDuration,
}: CompleteControlsProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerButtonRef = useRef<HTMLButtonElement>(null);

  const confettiShape = useMemo(() => confettiLib.shapeFromPath(xLogoPath), []);

  const getConfettiOptions = useCallback(
    (origin?: { x: number; y: number }) => ({
      angle: 90 + (Math.random() - 0.5) * 90,
      particleCount: 25,
      spread: 45,
      startVelocity: 35,
      gravity: 0.7,
      decay: 0.9,
      ticks: 200,
      colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
      shapes: [confettiShape],
      scalar: 2,
      origin: origin || { x: 0.5, y: 1 },
      disableForReducedMotion: false,
    }),
    [confettiShape]
  );

  const startTimer = useCallback(() => {
    if (timerDuration) {
      setTimeLeft(timerDuration * 60);
      setIsTimerRunning(true);
    }
  }, [timerDuration]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          // Get the button position for confetti
          if (timerButtonRef.current) {
            const rect = timerButtonRef.current.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = rect.top / window.innerHeight;
            confettiLib(getConfettiOptions({ x, y }));
          }
          onIncrement();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, onIncrement, getConfettiOptions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (timerDuration) {
    if (count === 0) {
      return (
        <Button
          ref={timerButtonRef}
          variant={variant}
          size="sm"
          className="h-6 w-20 text-xs flex items-center gap-1"
          onClick={startTimer}
          disabled={isTimerRunning}
        >
          <Timer className="h-3 w-3" />
          {isTimerRunning ? formatTime(timeLeft) : `Start ${timerDuration}m`}
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-1 w-20">
        <Button variant={variant} size="icon" className="h-6 w-6" onClick={onDecrement}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-6 text-center font-medium">{count}</span>
        <Button
          ref={timerButtonRef}
          variant={variant}
          size="sm"
          className="h-6 w-6 p-0 flex items-center justify-center"
          onClick={startTimer}
          disabled={isTimerRunning}
        >
          {isTimerRunning ? (
            <span className="text-[10px] font-medium">{formatTime(timeLeft)}</span>
          ) : (
            <Timer className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  if (count === 0) {
    return (
      <ConfettiButton
        variant={variant}
        size="sm"
        className="h-6 w-20 text-xs"
        onClick={onIncrement}
        options={getConfettiOptions()}
      >
        Complete
      </ConfettiButton>
    );
  }

  return (
    <div className="flex items-center gap-1 w-20">
      <Button variant={variant} size="icon" className="h-6 w-6" onClick={onDecrement}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-medium">{count}</span>
      <ConfettiButton
        variant={variant}
        size="icon"
        className="h-6 w-6"
        onClick={onIncrement}
        options={getConfettiOptions()}
      >
        <Plus className="h-4 w-4" />
      </ConfettiButton>
    </div>
  );
}
