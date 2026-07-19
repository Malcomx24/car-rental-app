"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import { isRtl } from "@/i18n/config";

export function LocaleHydration() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
