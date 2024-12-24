import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header>
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Streak Calendar
        </Link>

        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <Link href="/pricing" className="text-sm font-medium hover:text-muted-foreground">
            Pricing
          </Link>
          <Link href="/calendars" className="text-sm font-medium hover:text-muted-foreground">
            Calendars
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-muted-foreground">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
