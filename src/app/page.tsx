import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Build Your Habits,
        <br />
        Track Your Streaks
      </h1>
      <p className="mx-auto mt-6 max-w-[600px] text-muted-foreground md:text-xl">
        You become what you do, again and again.
        <br />
        Start your streak today and stay motivated!
      </p>
      <div className="mt-8">
        <SignedIn>
          <Button asChild size="lg">
            <Link href="/calendars">Go to Calendars</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <Button asChild size="lg">
            <Link href="/pricing">Get Started</Link>
          </Button>
        </SignedOut>
      </div>
    </div>
  );
}
