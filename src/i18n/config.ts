import { useLocale } from "next-intl";

export type Locale = "en" | "fr" | "ar";

export const locales: Locale[] = ["en", "fr", "ar"];
export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}
