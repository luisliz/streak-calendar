import { Locale, defaultLocale } from "@/i18n/settings";

import "./globals.css";

/**
 * Root layout component for the Streak Calendar application.
 * This is the top-level layout that wraps all pages and provides common functionality.
 */

type Props = {
  children: React.ReactNode;
  params?: { locale?: string };
};

export default function RootLayout({ children, params }: Props) {
  const locale = (params?.locale || defaultLocale) as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      {children}
    </html>
  );
}
