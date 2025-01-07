"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { locales } from "@/i18n/settings";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const languageMap = {
  de: { name: "Deutsch", flagSrc: "/flag-de.png" },
  en: { name: "English", flagSrc: "/flag-us.png" },
  es: { name: "Español", flagSrc: "/flag-es.png" },
  fr: { name: "Français", flagSrc: "/flag-fr.png" },
  ru: { name: "Русский", flagSrc: "/flag-ru.png" },
  he: { name: "עברית", flagSrc: "/flag-il.png" },
  ar: { name: "العربية", flagSrc: "/flag-sa.png" },
  hi: { name: "हिन्दी", flagSrc: "/flag-in.png" },
  zh: { name: "中文", flagSrc: "/flag-cn.png" },
} as const;

export function AppFooter() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const locale = useLocale();

  const redirectedPathname = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;

    // Get the segments and remove empty ones
    const segments = pathname.split("/").filter(Boolean);

    // Find the current locale index (it should be the first segment)
    const localeIndex = segments.findIndex((segment) => locales.includes(segment as (typeof locales)[number]));

    // Remove the current locale
    if (localeIndex !== -1) {
      segments.splice(localeIndex, 1);
    }

    // Join remaining segments and add new locale
    return `/${newLocale}${segments.length ? `/${segments.join("/")}` : ""}`;
  };

  return (
    <footer className="border-t border-border bg-background/30">
      <TooltipProvider delayDuration={200}>
        <div className="container relative mx-auto flex min-h-[4rem] flex-col items-center gap-4 px-3 py-4 md:h-16 md:flex-row md:justify-between md:gap-0 md:px-4 md:py-0">
          <div className="text-center text-xs text-muted-foreground md:text-left md:text-sm">
            {t("madeWith")}{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="mx-[2px] inline-block h-4 w-4 translate-y-[3px] rounded-[4px] bg-[url('/cursor-logo.png')] bg-contain bg-center bg-no-repeat md:h-5 md:w-5 md:translate-y-[4px] md:rounded-[6px]"
                  aria-label="Cursor"
                  role="button"
                  tabIndex={0}
                />
              </TooltipTrigger>
              <TooltipContent sideOffset={5}>Cursor</TooltipContent>
            </Tooltip>{" "}
            {t("and")}{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-base font-extrabold text-destructive md:text-lg" aria-label={t("love")}>
                  ♥️
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={5}>{t("love")}</TooltipContent>
            </Tooltip>{" "}
            {t("by")}{" "}
            <a
              href="https://x.com/ilyaizen"
              className="font-semibold hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              @ilyaizen
            </a>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    className="inline-flex p-1 text-muted-foreground hover:text-foreground md:p-1.5"
                    href="https://github.com/ilyaizen/streak-calendar"
                    aria-label="Github"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4 md:size-5"
                      fill="currentColor"
                    >
                      <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>GitHub</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    className="inline-flex p-1 text-muted-foreground hover:text-foreground md:p-1.5"
                    href="https://x.com/StreakCalendar"
                    aria-label="X (Twitter)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4 md:size-5"
                      fill="currentColor"
                    >
                      <path d="M8 2H1L9.26086 13.0145L1.44995 21.9999H4.09998L10.4883 14.651L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 8.88578L8 2ZM17 20L5 4H7L19 20H17Z" />
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>X (Twitter)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    className="inline-flex p-1 text-muted-foreground hover:text-foreground md:p-1.5"
                    href="https://discord.gg/H9bncs7qpk"
                    aria-label="Discord"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4 md:size-5"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>Discord</TooltipContent>
              </Tooltip>
            </div>
            <div className="mx-3 h-4 w-px bg-border md:h-6" />
            {/* language switcher */}
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger className="p-1 text-muted-foreground hover:text-foreground md:p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4 md:size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 5h7" />
                      <path d="M9 3v2c0 4.418 -2.239 8 -5 8" />
                      <path d="M5 9c0 2.144 2.952 3.908 6.7 4" />
                      <path d="M12 20l4 -9l4 9" />
                      <path d="M19.1 18h-6.2" />
                    </svg>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="end" className="min-w-[150px]">
                  {locales.map((l) => (
                    <DropdownMenuItem key={l} asChild>
                      <Link
                        href={redirectedPathname(l)}
                        className={`flex w-full items-center gap-2 ${l === locale ? "font-medium" : ""}`}
                      >
                        <Image
                          src={languageMap[l].flagSrc}
                          alt={l.toUpperCase()}
                          className="size-4 rounded-[3px]"
                          width={32}
                          height={32}
                          priority
                          loading="eager"
                          sizes="16px"
                        />
                        <span>{languageMap[l].name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipContent sideOffset={5}>{t("changeLanguage")}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
      {/* Preload all flag images */}
      {locales.map((l) => (
        <link key={l} rel="preload" as="image" href={languageMap[l].flagSrc} />
      ))}
    </footer>
  );
}
