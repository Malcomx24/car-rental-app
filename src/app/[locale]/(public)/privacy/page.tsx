import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-muted-foreground mb-8">{t("lastUpdated")}</p>

      <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section1Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section1Content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section2Title")}</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>{t("section2Intro")}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>{t("section2Personal.label")}</strong> {t("section2Personal.value")}</li>
              <li><strong>{t("section2Payment.label")}</strong> {t("section2Payment.value")}</li>
              <li><strong>{t("section2Usage.label")}</strong> {t("section2Usage.value")}</li>
              <li><strong>{t("section2Location.label")}</strong> {t("section2Location.value")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section3Title")}</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>{t("section3Intro")}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("section3Item1")}</li>
              <li>{t("section3Item2")}</li>
              <li>{t("section3Item3")}</li>
              <li>{t("section3Item4")}</li>
              <li>{t("section3Item5")}</li>
              <li>{t("section3Item6")}</li>
              <li>{t("section3Item7")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section4Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section4Content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section5Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section5Content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section6Title")}</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <p>{t("section6Intro")}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("section6Item1")}</li>
              <li>{t("section6Item2")}</li>
              <li>{t("section6Item3")}</li>
              <li>{t("section6Item4")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section7Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section7Content")}
          </p>
        </section>
      </div>
    </div>
  );
}
