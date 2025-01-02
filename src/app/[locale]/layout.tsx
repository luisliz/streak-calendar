import { Providers } from "@/app/providers";
import { RootWrapper } from "@/components/root-wrapper";
import { Locale, defaultLocale, locales } from "@/i18n/settings";
import { cn } from "@/lib/utils";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export function generateStaticParams() {
  // Only generate locale paths for non-default locales
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <body
      className={cn(
        inter.variable,
        "min-h-screen bg-background font-sans antialiased",
        "grid-background",
        locale === "he" && "rtl"
      )}
    >
      <noscript>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <p className="rounded border bg-card px-6 py-4 text-center shadow-lg">
            Please enable JavaScript to use this app.
          </p>
        </div>
      </noscript>
      <div className="fixed inset-0 bg-gradient-to-t from-muted to-transparent" />
      <div className="relative overflow-x-hidden">
        <Providers locale={locale} messages={messages}>
          <RootWrapper>{children}</RootWrapper>
        </Providers>
      </div>
    </body>
  );
}
