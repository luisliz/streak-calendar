/**
 * AppHeader Component
 *
 * A responsive navigation header component that includes:
 * - Logo and brand name
 * - Navigation links (desktop)
 * - Mobile menu toggle
 * - Theme toggle
 * - Authentication-based actions (Sign in/User button)
 */
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { XLogo } from "./ui/x-logo";

export function AppHeader() {
  // State for controlling mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border">
      {/* Main header container with responsive padding */}
      <div className="container relative mx-auto flex h-16 items-center px-4">
        {/* Logo section with fixed width */}
        <div className="w-[200px] shrink-0">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <XLogo className="h-6 w-6 fill-red-500 drop-shadow-lg" />
            <span className="text-primary drop-shadow-lg">Streak Calendar</span>
          </Link>
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="absolute left-1/2 hidden flex-1 -translate-x-1/2 items-center justify-center gap-6 md:flex">
          <Link href="/about" className="text-sm font-medium hover:text-muted-foreground">
            About
          </Link>
          <Link href="/calendars" className="text-sm font-medium hover:text-muted-foreground">
            Calendars
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-muted-foreground">
            Pricing
          </Link>
        </nav>

        {/* Right-aligned controls: mobile menu toggle, theme toggle, auth buttons */}
        <div className="absolute right-4 flex items-center gap-2">
          {/* Mobile menu toggle - visible only on mobile */}
          <Button
            variant="outline"
            size="sm"
            className="w-9 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <ThemeToggle />
          {/* Conditional rendering based on auth state */}
          <SignedOut>
            <Button asChild size="sm">
              <Link href="/pricing">Get Started</Link>
            </Button>
          </SignedOut>
          <div className="flex scale-110 md:mx-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute left-0 top-16 z-50 w-full border-b bg-background md:hidden ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="container flex flex-col gap-4 px-4 py-4">
            <Link
              href="/about"
              className="text-sm font-medium hover:text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu after navigation
            >
              About
            </Link>

            <Link
              href="/calendars"
              className="text-sm font-medium hover:text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendars
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
