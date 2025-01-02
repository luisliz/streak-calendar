import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function YearlyOverviewSkeleton() {
  return (
    <div className="mt-2 flex flex-col items-center sm:mt-16">
      <div className="w-[350px] pb-1 pl-2 sm:w-[400px] xl:w-[984px]">
        <Skeleton className="h-4 w-48" />
      </div>
      <Card className="mx-auto mb-4 w-fit rounded-xl p-1 shadow-md xl:mb-16 xl:w-[984px] xl:rounded-3xl xl:p-2">
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-[40px] w-[350px] sm:h-[70px] sm:w-[400px] xl:h-[140px] xl:w-[950px]" />
        </div>
      </Card>
    </div>
  );
}

export function CalendarSkeletons() {
  return (
    <Card className="space-y-8 border p-2 shadow-md">
      {/* View Controls Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="flex w-full flex-col gap-8 md:px-8">
        {/* Calendar Skeletons */}
        {[1, 2].map((i) => (
          <div key={i} className="space-y-6">
            {/* Calendar Title */}
            <div className="flex justify-center">
              <Skeleton className="h-12 w-64" />
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-4">
                  {/* Month Title */}
                  <Skeleton className="h-6 w-32" />
                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array(35)
                      .fill(0)
                      .map((_, k) => (
                        <Skeleton key={k} className="h-12 w-12" />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Calendar Button Skeleton */}
      <div className="flex justify-center pb-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </Card>
  );
}
