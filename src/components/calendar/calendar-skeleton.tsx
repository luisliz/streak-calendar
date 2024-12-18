import { Skeleton } from "@/components/ui/skeleton";

export const CalendarSkeleton = () => (
  <div className="space-y-8">
    {[1, 2].map((i) => (
      <div key={i} className="rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex-1">
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
