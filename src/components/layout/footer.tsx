import Link from "next/link";
import { Car } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  const companyLinks = [
    { label: t("aboutUs"), href: "/about" },
    { label: t("careers"), href: "/careers" },
    { label: t("blog"), href: "/blog" },
    { label: t("press"), href: "/press" },
  ];

  const supportLinks = [
    { label: t("helpCenter"), href: "/help" },
    { label: t("contactUs"), href: "/contact" },
    { label: t("faq"), href: "/faq" },
    { label: t("roadsideAssistance"), href: "/roadside-assistance" },
  ];

  const legalLinks = [
    { label: t("privacyPolicy"), href: "/privacy" },
    { label: t("termsOfService"), href: "/terms" },
    { label: t("cookiePolicy"), href: "/cookies" },
    { label: t("licenseAgreement"), href: "/license" },
  ];

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Car className="h-6 w-6" />
              <span>DriveRent</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("description")}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("company")}</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("support")}</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("legal")}</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DriveRent. {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
