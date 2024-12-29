import { SignedIn, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;

      setIsVisible(!isScrollingDown || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-white/70 dark:bg-sky-950/70">
        <div className="container mx-auto flex h-16 items-center px-4 relative">
          <div className="w-[200px] shrink-0">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 15"
                className="h-6 w-6 drop-shadow-lg fill-red-500"
              >
                <path d="M14.12 9.87a3.024 3.024 0 0 1 0 4.26c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87l-2.37-2.37-2.37 2.37c-.6.57-1.35.87-2.13.87s-1.53-.3-2.13-.87a3.024 3.024 0 0 1 0-4.26L3.23 7.5.88 5.13C-.29 3.97-.29 2.05.88.88a3.012 3.012 0 0 1 4.25 0L7.5 3.25 9.87.88a3.024 3.024 0 0 1 4.26 0 3.024 3.024 0 0 1 0 4.26l-2.37 2.37 2.37 2.37Z" />
              </svg>
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
      </div>
    </header>
  );
}
