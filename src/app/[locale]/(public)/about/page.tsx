import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
  };
}

export { AboutPageClient as default } from "./about-page-client";
