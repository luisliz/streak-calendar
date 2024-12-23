import { Skeleton } from "@/components/ui/skeleton";

/**
 * CalendarSkeleton displays a loading placeholder for calendars.
 * It shows two calendar blocks, each with a header and three habit rows.
 * Used while the actual calendar data is being fetched.
 */

export const CalendarSkeleton = () => (
  <>
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" /> {/* View toggle placeholder */}
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" /> {/* Add calendar button placeholder */}
      </div>
    </div>

    <div className="space-y-8">
      {[1, 2].map((i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-48" /> {/* Calendar name placeholder */}
            </div>
            <Skeleton className="h-10 w-32" /> {/* Add habit button placeholder */}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-48">
                  <Skeleton className="h-6 w-32" /> {/* Habit name placeholder */}
                </div>
                <div className="flex-1">
                  <Skeleton className="h-8 w-full" /> {/* Progress bar placeholder */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="mt-8 flex justify-center">
      <Skeleton className="h-10 w-48" /> {/* Import/Export placeholder */}
    </div>
  </>
);
