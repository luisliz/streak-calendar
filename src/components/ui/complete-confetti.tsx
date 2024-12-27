"use client";

import { Button } from "@/components/ui/button";
import { ConfettiButton } from "@/components/ui/confetti";
import { Minus, Plus } from "lucide-react";

const xLogoShape = confetti.shapeFromPath(
  `M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z`
);

interface CompleteConfettiProps {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  variant?: "default" | "ghost";
  showText?: boolean;
}

const confettiOptions = {
  angle: 45,
  particleCount: 50,
  spread: 70,
  startVelocity: 30,
  gravity: 0.5,
  ticks: 300,
  shapes: [xLogoShape],
  colors: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#FF00FF"],
  scalar: 1.2,
};

export const CompleteConfetti = ({ count, onIncrement, onDecrement, variant = "default" }: CompleteConfettiProps) => {
  if (count === 0) {
    return (
      <ConfettiButton
        variant={variant}
        size="sm"
        className="h-6 text-xs ml-auto"
        onClick={onIncrement}
        options={confettiOptions}
      >
        Complete
      </ConfettiButton>
    );
  }

  return (
    <div className="flex items-center gap-1 ml-auto">
      <Button variant={variant} size="icon" className="h-6 w-6" onClick={onDecrement}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-6 text-center font-medium">{count}</span>
      <ConfettiButton variant={variant} size="icon" className="h-6 w-6" onClick={onIncrement} options={confettiOptions}>
        <Plus className="h-4 w-4" />
      </ConfettiButton>
    </div>
  );
};
