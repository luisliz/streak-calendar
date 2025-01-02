"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/i18n/settings";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const languageMap = {
  en: { name: "English", flagSrc: "/flag-us.png" },
  de: { name: "Deutsch", flagSrc: "/flag-de.png" },
  ru: { name: "Русский", flagSrc: "/flag-ru.png" },
  hi: { name: "हिन्दी", flagSrc: "/flag-in.png" },
  he: { name: "עברית", flagSrc: "/flag-il.png" },
} as const;

export function AppFooter() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const locale = useLocale();

  const redirectedPathname = (newLocale: string) => {
    if (!pathname) return newLocale === "en" ? "/" : `/${newLocale}`;

    // Get the current path segments and remove empty ones
    const segments = pathname.split("/").filter(Boolean);

    // Get the path without any locale prefix
    const pathWithoutLocale = segments
      .filter((segment) => !locales.includes(segment as (typeof locales)[number]))
      .join("/");

    // For English, return path without locale prefix
    if (newLocale === "en") {
      return pathWithoutLocale ? `/${pathWithoutLocale}` : "/";
    }

    // For other locales, ensure we have the correct locale prefix
    return `/${newLocale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ""}`;
  };

  return (
    <footer className="border-t border-border">
      <div className="container relative mx-auto flex min-h-[4rem] flex-col items-center gap-4 px-3 py-4 md:h-16 md:flex-row md:justify-between md:gap-0 md:px-4 md:py-0">
        <p className="text-center text-xs text-muted-foreground md:text-left md:text-sm">
          {t("madeWith")}{" "}
          <span
            className="mx-[2px] inline-block h-4 w-4 translate-y-[3px] rounded-[4px] bg-[url('/cursor-logo.png')] bg-contain bg-center bg-no-repeat md:h-5 md:w-5 md:translate-y-[4px] md:rounded-[6px]"
            title="Cursor"
            aria-label="Cursor"
          />{" "}
          {t("and")}{" "}
          <span
            className="text-base font-extrabold text-destructive md:text-lg"
            title={t("love")}
            aria-label={t("love")}
          >
            ♥️
          </span>{" "}
          {t("by")}{" "}
          <a
            href="https://github.com/ilyaizen"
            className="font-semibold hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ilyaizen
          </a>
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-1 md:space-x-2">
            <a
              className="p-1 text-muted-foreground hover:text-foreground md:p-1.5"
              href="https://github.com/ilyaizen"
              title="Github"
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
            <a
              className="p-1 text-muted-foreground hover:text-foreground md:p-1.5"
              href="https://x.com/ilyaizen"
              title="X (Twitter)"
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
            <a
              className="p-1 text-muted-foreground hover:text-foreground md:p-1.5"
              href="mailto:ilyaizen@gmail.com"
              title="Gmail"
              aria-label="Gmail"
              target="_blank"
              rel="noopener noreferrer"
            >
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
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                <path d="M3 7l9 6l9 -6" />
              </svg>
            </a>
          </div>
          <div className="h-4 w-px bg-border md:h-6" />
          {/* language switcher */}
          <DropdownMenu>
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
            <DropdownMenuContent align="end">
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
                      width={16}
                      height={16}
                      unoptimized
                    />
                    <span>{languageMap[l].name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
}
