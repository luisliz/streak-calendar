"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { useCallback, useState } from "react";

import CircularTimer from "./circular-timer";

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
