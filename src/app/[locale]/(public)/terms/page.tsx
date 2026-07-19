import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("terms");

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
          <p className="text-muted-foreground leading-relaxed">
            {t("section2Content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section3Title")}</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("section3Item1")}</li>
              <li>{t("section3Item2")}</li>
              <li>{t("section3Item3")}</li>
              <li>{t("section3Item4")}</li>
              <li>{t("section3Item5")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section4Title")}</h2>
          <div className="text-muted-foreground leading-relaxed space-y-2">
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("section4Item1")}</li>
              <li>{t("section4Item2")}</li>
              <li>{t("section4Item3")}</li>
              <li>{t("section4Item4")}</li>
              <li>{t("section4Item5")}</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section5Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section5Content")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">{t("section6Title")}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("section6Content")}
          </p>
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
