import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      <p className="mx-auto mt-20 max-w-[500px] text-muted-foreground md:text-2xl">
        <span className="italic font-medium">“You are what you repeatedly do.”</span>
        <br />
        Start your streak today and prove you <span className="font-semibold inline-block">can</span> actually stick to
        something for once.
      </p>
      <Card className="p-4 mt-24 max-w-4xl shadow-md rounded-xl">
        <CardHeader>
          <h1 className="mt-4 mb-12 font-heading text-4xl font-bold md:text-6xl">
            Build Your Habits,
            <br />
            Track Your Streaks
          </h1>
          <h2 className="font-heading text-left font-bold text-2xl">
            Want to build lasting habits but struggle with consistency?
          </h2>
        </CardHeader>
        <CardContent className="space-y-4 text-left text-muted-foreground">
          <p>
            Streak Calendar is here to help! Inspired by Jerry Seinfeld&apos;s &quot;Don&apos;t Break the Chain&quot;
            method, this app keeps track of your daily actions with a simple &apos;
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="inline w-4 h-4 fill-red-500">
              <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
            </svg>
            &apos; mark on a calendar. The longer your streak grows, the more motivated you&apos;ll feel to keep it
            going. It&apos;s all about building momentum and discipline through small, daily efforts.
          </p>
          <p>
            Streak Calendar offers a clean interface, customizable views, and works seamlessly across devices. Plus,
            it&apos;s open source so you can be confident your data is secure. Sign up for free today and start building
            the habits that lead to success!
          </p>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>

      <p className="mt-16 text-sm -mb-4 font-semibold italic text-muted-foreground text-left w-full max-w-xl">
        Example video:
      </p>
      <div className="rounded-xl mt-4 relative w-full max-w-xl overflow-hidden aspect-video mx-auto">
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src="https://www.youtube.com/embed/mVQ1bzd816I?si=h-UGS9kLXH-gN2Cs"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
