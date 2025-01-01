import { RootWrapper } from "@/components/root-wrapper";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter", // CSS variable for font family
  subsets: ["latin"],
  display: "swap",
  preload: true,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased", "grid-background")}>
        <div className="fixed inset-0 bg-gradient-to-t from-sky-50 to-transparent dark:from-sky-950" />
        <div className="relative overflow-x-hidden">
          <Providers>
            <RootWrapper>{children}</RootWrapper>
          </Providers>
        </div>
      </body>
    </html>
  );
}
