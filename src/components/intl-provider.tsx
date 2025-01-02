"use client";

import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { PropsWithChildren } from "react";

interface IntlProviderProps extends PropsWithChildren {
  locale: string;
  messages: AbstractIntlMessages;
  timeZone?: string;
}

export function IntlProvider({ children, locale, messages, timeZone = "UTC" }: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      onError={(error) => {
        console.error(error);
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
