import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
  locale: locale || routing.defaultLocale,
  timeZone: "UTC",
}));

export const dynamic = "force-dynamic";
