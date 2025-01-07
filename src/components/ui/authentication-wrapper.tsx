"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

export function AuthenticationWrapper({ children }: { children: React.ReactNode }) {
  const t = useTranslations("auth");
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">{t("signInPrompt")}</h2>
          <SignInButton mode="modal">
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              {t("signIn")}
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
