import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter", // CSS variable for font family
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.streakcalendar.com"),

  title: "Streak Calendar - Build Better Habits",
  description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
  keywords: [
    "habit tracking",
    "streak calendar",
    "productivity",
    "daily routine",
    "habit builder",
    "goal tracking",
    "anti-procrastination",
  ],

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

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents warnings from theme provider
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
        <Providers>
          {/* Main layout container with max width and flex column structure */}
          <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
