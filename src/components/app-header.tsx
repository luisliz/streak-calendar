import { SignedIn, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { XLogo } from "./ui/x-logo";

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="container mx-auto flex h-16 items-center px-4 relative">
        <div className="w-[200px] shrink-0">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <XLogo className="h-6 w-6 drop-shadow-lg fill-red-500" />
            <span className="drop-shadow-lg text-primary">Streak Calendar</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center absolute left-1/2 -translate-x-1/2">
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

        <div className="flex items-center md:gap-4 absolute right-4">
          <Button
            variant="link"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <ThemeToggle />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-16 left-0 w-full bg-background border-b ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link
              href="/about"
              className="text-sm font-medium hover:text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
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
