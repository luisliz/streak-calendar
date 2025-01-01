import { Button } from "@/components/ui/button";
import { XLogo } from "@/components/ui/x-logo";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Activity, Calendar, ListTodo, Timer } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-16 px-4 py-16 text-center">
      <div className="max-w-lg">
        <h1 className="mb-4 text-2xl font-bold md:text-4xl">Build Habits That Last with Streak Calendar</h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">
          A simple, motivational productivity tool to help you achieve your goals, one day at a time. 💪
        </p>
      </div>

      <div className="mx-auto grid max-w-xs grid-cols-1 gap-8 px-4 md:max-w-3xl md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 text-center">
          <Calendar className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Visual Habit Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Mark your daily accomplishments with <XLogo className="inline h-4 w-4 fill-red-500" />
            &apos;s and watch your streak grow
          </p>
        </div>
        <div className="space-y-2 text-center">
          <ListTodo className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Multi-Habit Support</h3>
          <p className="text-sm text-muted-foreground">Track multiple habits across customizable calendars</p>
        </div>
        <div className="space-y-2 text-center">
          <Activity className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Yearly Activity Grid</h3>
          <p className="text-sm text-muted-foreground">Get a yearly view of your progress, inspired by GitHub</p>
        </div>
        <div className="space-y-2 text-center">
          <Timer className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">Timed Tasks</h3>
          <p className="text-sm text-muted-foreground">Stay focused with optional timers for your habits</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="hidden text-xs text-muted-foreground md:text-sm">
          Helping individuals worldwide build better habits and stay motivated every day!
        </p>

        <SignedIn>
          <Button asChild size="lg">
            <Link href="/calendars">Go to Calendars</Link>
          </Button>
        </SignedIn>
        <SignedOut>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/pricing">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </SignedOut>
      </div>

      <div className="w-full max-w-xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-[8px] shadow-lg">
          <iframe
            className="absolute left-0 top-0 h-full w-full"
            src="https://www.youtube.com/embed/0tlMHyUcTjg?si=YR9KDmUAHddmlSEV&amp;start=59"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div className="w-full pr-2 text-right">
          <a
            href="https://youtu.be/0tlMHyUcTjg"
            className="text-xs text-muted-foreground underline opacity-50 transition-opacity hover:opacity-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            Full video
          </a>
        </div>
      </div>
    </div>
  );
}
