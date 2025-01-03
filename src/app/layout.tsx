/**
 * Root layout component for the Streak Calendar application.
 * This is the top-level layout that wraps all pages and provides common functionality.
 */
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.streakcalendar.com"),
  title: "Streak Calendar - Build Better Habits",
  description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
  keywords: ["habit tracking", "streak calendar", "productivity", "goal tracking", "daily routine"],
  openGraph: {
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
    type: "website",
    siteName: "Streak Calendar",
    url: "https://www.streakcalendar.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html suppressHydrationWarning>{children}</html>;
}
