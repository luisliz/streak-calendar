/**
 * Root layout component for the Streak Calendar application.
 * This is the top-level layout that wraps all pages and provides common functionality.
 */
import { RootWrapper } from "@/components/root-wrapper";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

// Configure Inter font with CSS variable for consistent typography
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Optimize font loading performance
  preload: true,
});

// Define application metadata for SEO and social sharing
export const metadata: Metadata = {
  metadataBase: new URL("https://www.streakcalendar.com"),

  title: "Streak Calendar - Build Better Habits",
  description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
  // Keywords for SEO optimization
  keywords: [
    "seinfeld calendar",
    "streak calendar",
    "streak tracker",
    "open source",
    "procrastination",
    "anti-procrastination",
    "productivity tool",
    "web app",
    "chrome extension",
    "chrome",
    "consistency",
    "daily routine",
    "don't break the chain",
    "goal tracking",
    "habit assistant",
    "habit builder",
    "habit calendar",
    "habit logging",
    "habit streak",
    "habit streaks",
    "habit tracking",
    "habit visualization",
    "linux",
    "mac",
    "motivation app",
    "motivation",
    "motivator",
    "productivity app",
    "productivity",
    "progress tracker",
    "routine builder",
    "seinfeld method",
    "self-improvement app",
    "self-improvement",
    "streak app",
    "streak tracker",
    "streak",
    "streaks",
    "streaks app",
    "streaks tracker",
    "task management",
    "tool",
    "webapp",
    "windows",
  ],

  // Open Graph metadata for social media sharing
  openGraph: {
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
    type: "website",
    siteName: "Streak Calendar",
    url: "https://www.streakcalendar.com",
  },

  // Twitter card metadata for Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
  },

  manifest: "/manifest.json",
};

/**
 * Root layout component that provides the basic HTML structure and common styling.
 * Features:
 * - Custom font configuration
 * - Responsive background with gradient
 * - Global providers for app-wide functionality
 * - Hydration warning suppression
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased", "grid-background")}>
        {/* Background gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-t from-muted to-transparent" />

        {/* Main content container with overflow control */}
        <div className="relative overflow-x-hidden">
          <Providers>
            <RootWrapper>{children}</RootWrapper>
          </Providers>
        </div>
      </body>
    </html>
  );
}
