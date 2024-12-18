import { Skeleton } from "@/components/ui/skeleton";

/**
 * CalendarSkeleton displays a loading placeholder for calendars.
 * It shows two calendar blocks, each with a header and three habit rows.
 * Used while the actual calendar data is being fetched.
 */

export const CalendarSkeleton = () => (
  <div className="space-y-8">
    {/* Render two calendar blocks */}
    {[1, 2].map((i) => (
      <div key={i} className="rounded-lg border p-6">
        {/* Calendar header with title and action button placeholders */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" /> {/* Calendar name placeholder */}
          <Skeleton className="h-10 w-32" /> {/* Add habit button placeholder */}
        </div>
        {/* Three habit rows with name and progress bar placeholders */}
        <div className="space-y-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" /> {/* Habit name placeholder */}
              <div className="flex-1">
                <Skeleton className="h-8 w-full" /> {/* Progress bar placeholder */}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
