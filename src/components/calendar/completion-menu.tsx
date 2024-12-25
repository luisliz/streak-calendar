/**
 * CompletionMenu Component
 *
 * A button-based interface for tracking habit completions on a specific date.
 * The component provides multiple ways to interact with completion counts:
 * 1. Left click: Increment count
 * 2. Right click: Decrement count
 * 3. Dropdown menu: Fine-grained control with +/- buttons
 *
 * Visual feedback is provided through color intensity:
 * - No completions: Neutral background
 * - 1-3 completions: Increasing color intensity based on count
 * - Text color changes to white when there are completions
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
  // TODO: 2024-12-25 - remove this
  // Increment handler - no upper limit on completions
  const handleIncrement = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    onCountChange(count + 1);
  };

  // Decrement handler - prevents going below 0
  const handleDecrement = (e?: React.MouseEvent) => {
    if (disabled) return;
    if (e) e.preventDefault();
    if (count > 0) {
      onCountChange(count - 1);
    }
  };

  // Compute visual styles based on completion state
  // TODO: 2024-12-23 - fix to work with bg-card
  const bgColor = count === 0 ? "bg-neutral-100 dark:bg-neutral-800" : getCompletionColorClass(colorClass, count);
  // Use white text for darker backgrounds (count >= 2)
  const textColor = "text-neutral-900 dark:text-neutral-100";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {/* Main completion button with color feedback */}
        <button
          className={`${
            gridView ? "aspect-square w-full" : "w-6 h-6"
          } rounded-sm transition-colors hover:opacity-80 relative ${bgColor} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          onClick={handleIncrement}
          onContextMenu={handleDecrement}
          disabled={disabled}
        >
          {/* Day number display with dynamic text color */}
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${textColor} ${
              gridView ? "" : "scale-75"
            }`}
          >
            {new Date(date).getDate()}
          </span>
        </button>
      </DropdownMenuTrigger>
      {/* Dropdown for precise count control */}
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
