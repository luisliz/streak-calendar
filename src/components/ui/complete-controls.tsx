"use client";

import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import confettiLib from "canvas-confetti";
import { Minus, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

const xLogoPath = `M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z`;

interface CompleteControlsProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  variant?: "default" | "ghost";
  showText?: boolean;
}

export const CompleteControls = ({ count, onIncrement, onDecrement, variant = "default" }: CompleteControlsProps) => {
  const confettiShape = useMemo(() => confettiLib.shapeFromPath(xLogoPath), []);

  const getConfettiOptions = useCallback(
    () => ({
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
      origin: { x: 0.5, y: 1 },
      disableForReducedMotion: false,
    }),
    [confettiShape]
  );

  if (count === 0) {
    return (
      <ConfettiButton
        variant={variant}
        size="sm"
        className="h-6 text-xs"
        onClick={onIncrement}
        options={getConfettiOptions()}
      >
        Complete
      </ConfettiButton>
    );
  }

  return (
    <div className="flex items-center gap-1">
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
};
