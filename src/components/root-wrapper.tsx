"use client";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { MotionWrapper } from "@/components/motion-wrapper";
import { AnimatePresence } from "framer-motion";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
      <AppHeader />
      <AnimatePresence mode="wait">
        <MotionWrapper>{children}</MotionWrapper>
      </AnimatePresence>
      <AppFooter />
    </div>
  );
}
