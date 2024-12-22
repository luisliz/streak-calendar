import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCompletionColorClass } from "@/lib/colors";
import { Minus, Plus } from "lucide-react";

import { Id } from "@server/convex/_generated/dataModel";

interface CompletionMenuProps {
  habitId: Id<"habits">;
  date: string;
  count: number;
  onCountChange: (count: number) => void;
  colorClass: string;
  gridView?: boolean;
}

/**
 * CompletionMenu Component
 * Displays an interactive button that shows habit completion status and allows count modification
 * Features:
 * - Left click to increment count
 * - Right click to decrement count
 * - Dropdown menu with +/- buttons for precise control
 * - Visual feedback through color changes based on completion count
 */
export const CompletionMenu = ({ date, count, onCountChange, colorClass, gridView }: CompletionMenuProps) => {
  const handleIncrement = () => {
    onCountChange(count + 1);
  };

  const handleDecrement = () => {
    onCountChange(Math.max(0, count - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Main completion button with color feedback */}
        <button
          className={`${
            gridView ? "aspect-square w-full" : "w-6 h-6"
          } rounded-sm transition-colors hover:opacity-80 relative ${
            count === 0 ? "bg-neutral-100 dark:bg-neutral-800" : getCompletionColorClass(colorClass, count)
          }`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          onClick={(e) => {
            if (e.button === 0) {
              e.preventDefault();
              handleIncrement();
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleDecrement();
          }}
        >
          {gridView && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {new Date(date).getDate()}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-24">
        <div className="flex items-center justify-between p-2">
          <Button variant="default" size="icon" className="h-6 w-6" onClick={handleDecrement}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-medium">{count}</span>
          <Button variant="default" size="icon" className="h-6 w-6" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
