"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface CircularTimerProps {
  initialTime: number;
  onComplete?: () => void;
  className?: string;
  autoStart?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

function CircularTimer({ initialTime, onComplete, className, autoStart = false, onActiveChange }: CircularTimerProps) {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);

  useEffect(() => {
    onActiveChange?.(isActive);
  }, [isActive, onActiveChange]);

  const playSound = useCallback(() => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {
      // Ignore errors if audio can't play
    });
  }, []);

  useEffect(() => {
    if (autoStart) {
      setIsActive(true);
    }
  }, [autoStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            playSound();
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, onComplete, playSound]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const percentage = (time / initialTime) * 100;
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = ((100 - percentage) / 100) * strokeDasharray;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-48 w-48">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="stroke-current text-muted-foreground/20"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          <circle
            className={cn(
              "stroke-current transition-all duration-1000",
              time > initialTime * 0.5
                ? "text-primary"
                : time > initialTime * 0.25
                  ? "text-yellow-500"
                  : "text-destructive"
            )}
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <span className="text-3xl font-bold tabular-nums">{formatTime(time)}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={resetTimer} className="hover:text-destructive">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button size="icon" variant={isActive ? "destructive" : "default"} onClick={toggleTimer}>
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

interface TimerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onComplete?: () => void;
  timerDuration?: number; // in minutes
}

export default function TimerModal({ isOpen, setIsOpen, onComplete, timerDuration = 25 }: TimerModalProps) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  // Convert minutes to seconds for the timer
  const durationInSeconds = timerDuration * 60;

  const handleComplete = useCallback(() => {
    onComplete?.();
    setIsOpen(false);
    setIsTimerActive(false);
  }, [onComplete, setIsOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open && isTimerActive) {
      // If trying to close while timer is active, prevent closing
      const shouldClose = window.confirm("Timer is still running. Are you sure you want to cancel?");
      if (!shouldClose) return;
    }
    setIsOpen(open);
    if (!open) {
      setIsTimerActive(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-[425px]">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Clock className="h-5 w-5" />
              {timerDuration} Minute Timer
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex flex-col items-center justify-center p-6">
          <CircularTimer
            initialTime={durationInSeconds}
            onComplete={handleComplete}
            className="scale-110"
            autoStart={true}
            onActiveChange={setIsTimerActive}
          />
        </div>

        <DialogFooter className="px-6 pb-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
            Cancel Timer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
