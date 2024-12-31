import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getCompletionColorClass } from "@/lib/colors";
import { useState } from "react";

import { Id } from "@server/convex/_generated/dataModel";

interface DayCellProps {
  habitId: Id<"habits">;
  date: string; // ISO date string for the day this completion represents
  count: number; // Current number of completions for this date
  onCountChange: (count: number) => void; // Callback when completion count changes
  colorClass: string; // Base color theme (e.g., "bg-red-500") for visual feedback
  gridView?: boolean; // Whether to display in grid view (affects sizing)
  disabled?: boolean; // Whether the completion menu is disabled (outside query range)
}

export const DayCell = ({ date, count, onCountChange, colorClass, gridView, disabled }: DayCellProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIncrement = () => {
    if (disabled) return;
    onCountChange(count + 1);
  };

  const handleDecrement = () => {
    if (disabled) return;
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  // Extract color name and create fill class
  const colorMatch = colorClass.match(/bg-(\w+)-500/);
  const fillClass = count > 0 && colorMatch ? getCompletionColorClass(colorClass, count) : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={`${gridView ? "w-10 h-10" : "w-6 h-6"} rounded-full ${
            count === 0 ? "bg-slate-100 dark:bg-slate-800" : ""
          } relative p-0 overflow-visible ${disabled ? "opacity-50 cursor-not-allowed" : ""} hover:bg-transparent`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          disabled={disabled}
        >
          {count > 0 ? (
            <div className="absolute ">
              <svg
                key={`${count}-${fillClass}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                className={`${gridView ? "!w-[40px] !h-[40px]" : "!w-[24px] !h-[24px]"} ${fillClass} animate-completion relative`}
              >
                <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
              </svg>
            </div>
          ) : (
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-900 dark:text-slate-100 ${
                gridView ? "" : "scale-75"
              }`}
            >
              {new Date(date).getDate()}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-auto px-4 py-2 rounded-[15px] backdrop-blur-sm border bg-white/60 dark:bg-black/60"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex justify-center">
            <CompleteControls
              count={count}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onComplete={() => setIsOpen(false)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
