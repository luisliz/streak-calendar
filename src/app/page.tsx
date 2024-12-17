import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Track Your Habits,
        <br />
        Build Your Streaks
      </h1>
      <p className="mx-auto mt-6 max-w-[600px] text-muted-foreground md:text-xl">
        Visual habit tracking that helps you stay motivated and achieve your goals. Start your streak today.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <Link href="/calendars">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}
