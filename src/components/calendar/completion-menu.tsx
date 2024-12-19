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
}

export const CompletionMenu = ({ date, count, onCountChange, colorClass }: CompletionMenuProps) => {
  const handleIncrement = () => {
    onCountChange(count + 1);
  };

  const handleDecrement = () => {
    onCountChange(Math.max(0, count - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-6 h-6 rounded-sm transition-colors hover:opacity-80 ${getCompletionColorClass(
            colorClass,
            count
          )}`}
          title={`${new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}: ${count} completion${count !== 1 ? "s" : ""}`}
          onClick={(e) => {
            // If not right click, just increment the count
            if (e.button === 0) {
              e.preventDefault();
              handleIncrement();
            }
          }}
          onContextMenu={(e) => {
            // On right click, decrement the count
            e.preventDefault();
            handleDecrement();
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-24">
        <div className="flex items-center justify-between p-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDecrement}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-medium">{count}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleIncrement}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
