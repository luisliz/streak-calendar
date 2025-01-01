import { Button } from "@/components/ui/button";
import { CompleteControls } from "@/components/ui/complete-controls";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { XLogo } from "@/components/ui/x-logo";
import { getCompletionColorClass } from "@/lib/colors";
import { useState } from "react";

import { Id } from "@server/convex/_generated/dataModel";

/**
 * DayCell Component
 * Renders an interactive cell representing a single day in a habit tracking calendar.
 * Features a popover menu for updating completion counts and visual feedback for completion status.
 */

/**
 * Props for the DayCell component
 * @interface DayCellProps
 * @property {Id<"habits">} habitId - Unique identifier for the habit
 * @property {string} date - ISO date string representing the cell's date
 * @property {number} count - Number of completions for this date
 * @property {(count: number) => void} onCountChange - Callback for updating completion count
 * @property {string} colorClass - Base color theme for visual feedback (e.g., "bg-red-500")
 * @property {boolean} [gridView] - Optional flag for grid view display mode
 * @property {boolean} [disabled] - Optional flag to disable interactions (e.g., for dates outside query range)
 */
interface DayCellProps {
  habitId: Id<"habits">;
  date: string; // ISO date string for the day this completion represents
  count: number; // Current number of completions for this date
  onCountChange: (count: number) => void; // Callback when completion count changes
  colorClass: string; // Base color theme (e.g., "bg-red-500") for visual feedback
  gridView?: boolean; // Whether to display in grid view (affects sizing)
  disabled?: boolean; // Whether the completion menu is disabled (outside query range)
}

/**
 * DayCell component for displaying and managing daily habit completions
 * Includes a clickable button that shows completion status and a popover menu for updating counts
 */
export const DayCell = ({ date, count, onCountChange, colorClass, gridView, disabled }: DayCellProps) => {
  // Controls visibility of the completion controls popover
  const [isOpen, setIsOpen] = useState(false);

  // Increment completion count if not disabled
  const handleIncrement = () => {
    if (disabled) return;
    onCountChange(count + 1);
  };

  // Decrement completion count if not disabled and count > 0
  const handleDecrement = () => {
    if (disabled) return;
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  // Extract color name from class and determine fill color based on completion count
  const colorMatch = colorClass.match(/bg-(\w+)-500/);
  const fillClass = count > 0 && colorMatch ? getCompletionColorClass(colorClass, count) : "";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {/* Main cell button with dynamic styling based on completion status and view mode */}
        <Button
          variant="ghost"
          className={`${gridView ? "h-12 w-12" : "h-6 w-6"} rounded-full ${
            count === 0 ? "bg-slate-100 dark:bg-slate-800" : ""
          } relative overflow-visible p-0 ${disabled ? "cursor-not-allowed opacity-50" : ""} hover:bg-transparent`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          disabled={disabled}
        >
          {/* Render either completion indicator (X shape) or date number based on completion status */}
          {count > 0 ? (
            <div className="absolute">
              {/* SVG X shape with dynamic sizing and color based on completion count */}
              <XLogo
                key={`${count}-${fillClass}`}
                className={`${gridView ? "!h-[48px] !w-[48px]" : "!h-[24px] !w-[24px]"} ${fillClass} animate-completion relative`}
              />
            </div>
          ) : (
            // Display date number when no completions
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
      {/* Popover menu for updating completion count */}
      <PopoverContent
        align="center"
        className="w-auto rounded-[15px] border bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-black/60"
      >
        <div className="flex flex-col items-center gap-2">
          {/* Display full date in popover */}
          <div className="text-xs">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
          {/* Completion controls for incrementing/decrementing count */}
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
