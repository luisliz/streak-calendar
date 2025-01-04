"use client";

import { GoogleAd } from "@/components/ads/google-ad";
import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { MotionWrapper } from "@/components/motion-wrapper";
import { AnimatePresence } from "framer-motion";

export function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <AnimatePresence mode="wait">
        <MotionWrapper>{children}</MotionWrapper>
      </AnimatePresence>
      <GoogleAd />
      <AppFooter />
    </div>
  );
}
