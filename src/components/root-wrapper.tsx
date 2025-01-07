"use client";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { MotionWrapper } from "@/components/motion-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader />
        <AnimatePresence mode="wait">
          <MotionWrapper>{children}</MotionWrapper>
        </AnimatePresence>
        <AppFooter />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
