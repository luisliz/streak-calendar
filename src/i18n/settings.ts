export const locales = ["en", "de", "ru", "hi", "he"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];
