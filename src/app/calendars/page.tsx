"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function CalendarsPage() {
  return (
    <div className="container px-4 py-8">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-8">Your Calendars</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold mb-2">Daily Exercise</h2>
            <p className="text-sm text-muted-foreground">Current streak: 5 days</p>
          </div>
          {/* Add more calendar cards here */}
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <h2 className="text-xl font-semibold">Please sign in to view your calendars</h2>
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
}
