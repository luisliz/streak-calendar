import { SignedIn, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center px-4 relative">
        <div className="w-[200px] shrink-0">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Image
              src="/x-logo.png"
              alt="Track your habits and improve your life"
              width={20}
              height={20}
              className="h-6 w-6 text-primary-foreground"
            />
            <span className="drop-shadow-lg">Streak Calendar</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center absolute left-1/2 -translate-x-1/2">
          <SignedIn>
            <Link href="/pricing" className="text-sm font-medium hover:text-muted-foreground">
              Pricing
            </Link>
            <Link href="/calendars" className="text-sm font-medium hover:text-muted-foreground">
              Calendars
            </Link>
          </SignedIn>
          <Link href="/about" className="text-sm font-medium hover:text-muted-foreground">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-1 md:gap-4 absolute right-4">
          <Button
            variant="ghost"
            size="sm"
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
            <SignedIn>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/calendars"
                className="text-sm font-medium hover:text-muted-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Calendars
              </Link>
            </SignedIn>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
