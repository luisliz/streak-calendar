/**
 * CompletionMenu Component
 *
 * A button-based interface for tracking habit completions on a specific date.
 * The component provides multiple ways to interact with completion counts:
 * 1. Left click: Increment count
 * 2. Right click: Decrement count
 * 3. Dropdown menu: Fine-grained control with +/- buttons
 */
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCompletionColorClass } from "@/lib/colors";
import { Minus, Plus } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

interface CompletionMenuProps {
  habitId: Id<"habits">;
  date: string; // ISO date string for the day this completion represents
  count: number; // Current number of completions for this date
  onCountChange: (count: number) => void; // Callback when completion count changes
  colorClass: string; // Base color theme (e.g., "bg-red-500") for visual feedback
  gridView?: boolean; // Whether to display in grid view (affects sizing)
  disabled?: boolean; // Whether the completion menu is disabled (outside query range)
}

export const CompletionMenu = ({ date, count, onCountChange, colorClass, gridView, disabled }: CompletionMenuProps) => {
  const handleIncrement = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    onCountChange(count + 1);
  };

  const handleDecrement = (e?: React.MouseEvent) => {
    if (disabled) return;
    if (e) e.preventDefault();
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  // Extract color name and create fill class
  const colorMatch = colorClass.match(/bg-(\w+)-500/);
  const fillClass = count > 0 && colorMatch ? getCompletionColorClass(colorClass, count) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          className={`${
            gridView ? "aspect-square w-full" : "w-6 h-6"
          } rounded-sm transition-colors hover:opacity-80 relative ${
            count === 0 ? "bg-neutral-100 dark:bg-neutral-800" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          onClick={handleIncrement}
          onContextMenu={handleDecrement}
          disabled={disabled}
        >
          {count > 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className={`w-full h-full ${fillClass}`}>
              <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
            </svg>
          ) : (
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-medium text-neutral-900 dark:text-neutral-100 ${
                gridView ? "" : "scale-75"
              }`}
            >
              {new Date(date).getDate()}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-24">
        <div className="flex items-center justify-between p-2">
          <Button
            variant="default"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleDecrement()}
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-medium">{count}</span>
          <Button
            variant="default"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => handleIncrement(e)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
