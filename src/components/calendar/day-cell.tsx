import { CompleteControls } from "@/components/ui/complete-controls";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { XLogo } from "@/components/ui/x-logo";
import { getCompletionColorClass } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";

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
 * @property {string} [label] - Optional label to display instead of date number
 */
interface DayCellProps {
  habitId: Id<"habits">;
  date: string; // ISO date string for the day this completion represents
  count: number; // Current number of completions for this date
  onCountChange: (count: number) => void; // Callback when completion count changes
  colorClass: string; // Base color theme (e.g., "bg-red-500") for visual feedback
  gridView?: boolean; // Whether to display in grid view (affects sizing)
  disabled?: boolean; // Whether the completion menu is disabled (outside query range)
  label?: string; // Optional label to display instead of date number
}

/**
 * DayCell component for displaying and managing daily habit completions
 * Includes a clickable button that shows completion status and a popover menu for updating counts
 */
export const DayCell = memo(
  ({ date, count, onCountChange, colorClass, gridView, disabled, label }: DayCellProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("calendar");

    const handleIncrement = () => {
      if (disabled) return;
      onCountChange(count + 1);
      setIsOpen(false);
    };

    const handleDecrement = () => {
      if (disabled) return;
      if (count > 0) {
        onCountChange(count - 1);
        setIsOpen(false);
      }
    };

    // Extract color name from class and determine fill color based on completion count
    const colorMatch = colorClass.match(/bg-(\w+)-500/);
    const fillClass = count > 0 && colorMatch ? getCompletionColorClass(colorClass, count) : "";

    const dateObj = new Date(date);
    const formattedDate = t("dateFormat.short", {
      month: t(`monthNames.${format(dateObj, "MMMM").toLowerCase()}`),
      day: dateObj.getDate(),
    });

    const completionText = t("completions", {
      count,
      date: formattedDate,
    });

    return (
      <TooltipProvider>
        <Tooltip>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={() => !disabled && setIsOpen(true)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full",
                    gridView ? "h-12 w-12" : "h-6 w-6",
                    count === 0 ? "bg-muted" : "bg-transparent",
                    disabled ? "cursor-not-allowed !bg-zinc-100 dark:!bg-zinc-800" : "",
                    "relative p-0"
                  )}
                  disabled={disabled}
                >
                  {count > 0 ? (
                    <div className="absolute">
                      <XLogo
                        key={`${count}-${fillClass}`}
                        className={`${gridView ? "!h-[48px] !w-[48px]" : "!h-[24px] !w-[24px]"} ${fillClass}`}
                      />
                    </div>
                  ) : (
                    <span
                      className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
                        disabled ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-900 dark:text-zinc-100"
                      } ${gridView ? "" : "scale-75"}`}
                    >
                      {label ?? new Date(date).getDate()}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{completionText}</p>
            </TooltipContent>
            {/* Popover menu for updating completion count */}
            <PopoverContent
              align="center"
              className="w-auto rounded-[15px] border bg-white/60 px-4 py-2 backdrop-blur-sm dark:bg-black/60"
            >
              <div className="flex flex-col items-center gap-2">
                {/* Display full date in popover */}
                <div className="text-xs">
                  {t("dateFormat.long", {
                    weekday: t(`weekDays.${format(dateObj, "eee").toLowerCase()}`),
                    month: t(`monthNames.${format(dateObj, "MMMM").toLowerCase()}`),
                    day: dateObj.getDate(),
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
        </Tooltip>
      </TooltipProvider>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.date === nextProps.date &&
      prevProps.count === nextProps.count &&
      prevProps.colorClass === nextProps.colorClass &&
      prevProps.gridView === nextProps.gridView &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.label === nextProps.label
    );
  }
);
DayCell.displayName = "DayCell";
