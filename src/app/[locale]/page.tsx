"use client";

import { Button } from "@/components/ui/button";
import { XLogo } from "@/components/ui/x-logo";
import { Link } from "@/i18n/routing";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Activity, Calendar, ListTodo, Timer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col items-center justify-center space-y-16 px-4 py-16 text-center">
      <div className="max-w-lg">
        <h1 className="mb-4 text-2xl font-bold md:text-4xl">{t("hero.title")}</h1>
        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">{t("hero.subtitle")}</p>
      </div>

      <div className="mx-auto grid max-w-xs grid-cols-1 gap-8 px-4 md:max-w-3xl md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 text-center">
          <Calendar className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">{t("hero.features.visualTracking.title")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("hero.features.visualTracking.description.part1")} <XLogo className="inline h-4 w-4 fill-red-500" />{" "}
            {t("hero.features.visualTracking.description.part2")}
          </p>
        </div>
        <div className="space-y-2 text-center">
          <ListTodo className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">{t("hero.features.multiHabit.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero.features.multiHabit.description")}</p>
        </div>
        <div className="space-y-2 text-center">
          <Activity className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">{t("hero.features.yearlyGrid.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero.features.yearlyGrid.description")}</p>
        </div>
        <div className="space-y-2 text-center">
          <Timer className="mx-auto mb-2 h-8 w-8 text-primary" />
          <h3 className="font-semibold">{t("hero.features.timedTasks.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("hero.features.timedTasks.description")}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="hidden text-xs text-muted-foreground md:block md:text-sm">{t("hero.motivation")}</p>

        <SignedIn>
          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link href="/calendars">{t("goToCalendar")}</Link>
            </Button>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/pricing">{t("getStarted")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">{t("learnMore")}</Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
