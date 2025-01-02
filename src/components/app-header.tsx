import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { XLogo } from "./ui/x-logo";

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

export function AppHeader() {
  // State for controlling mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border">
      {/* Main header container with responsive padding and height */}
      <div className="container relative mx-auto flex h-14 items-center px-3 md:h-16 md:px-4">
        {/* Logo section with responsive width and size */}
        <div className="w-[180px] shrink-0 md:w-[200px]">
          <Link href="/" className="flex items-center gap-1.5 text-lg font-bold md:gap-2 md:text-xl">
            <XLogo className="h-5 w-5 flex-shrink-0 fill-red-500 drop-shadow-lg md:h-6 md:w-6" />
            <span className="whitespace-nowrap text-primary drop-shadow-lg">Streak Calendar</span>
          </Link>
        </div>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="absolute left-1/2 hidden flex-1 -translate-x-1/2 items-center justify-center gap-4 md:flex md:gap-6">
          <Link href="/about" className="text-xs font-medium hover:text-muted-foreground md:text-sm">
            About
          </Link>
          <Link href="/calendars" className="text-xs font-medium hover:text-muted-foreground md:text-sm">
            Calendars
          </Link>
          <Link href="/pricing" className="text-xs font-medium hover:text-muted-foreground md:text-sm">
            Pricing
          </Link>
        </nav>

        {/* Right-aligned controls with responsive sizing */}
        <div className="absolute right-3 flex items-center gap-1.5 md:right-4 md:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 md:h-5 md:w-5" /> : <Menu className="h-4 w-4 md:h-5 md:w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <ThemeToggle />
          <SignedOut>
            <Button asChild size="sm" className="h-8 text-xs md:h-9 md:text-sm">
              <Link href="/pricing">Get Started</Link>
            </Button>
          </SignedOut>
          <div className="flex scale-90 md:mx-2 md:scale-110">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu with smaller text */}
        <div
          className={`absolute left-0 top-14 z-50 w-full border-b bg-background md:top-16 md:hidden ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="container flex flex-col gap-3 px-3 py-3 md:gap-4 md:px-4 md:py-4">
            <Link
              href="/about"
              className="text-xs font-medium hover:text-muted-foreground md:text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/calendars"
              className="text-xs font-medium hover:text-muted-foreground md:text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Calendars
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-medium hover:text-muted-foreground md:text-sm"
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
