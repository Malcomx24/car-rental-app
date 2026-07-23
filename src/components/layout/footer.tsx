import { Link } from "@/i18n/navigation";
import { Car } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  const companyLinks = [
    { label: t("aboutUs"), href: "/about" },
    { label: t("fleet"), href: "/cars" },
    { label: t("blog"), href: "/blog" },
    { label: t("careers"), href: "/careers" },
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

  const locationLinks = [
    { label: "Agadir", href: "/locations" },
    { label: "Marrakech", href: "/locations" },
    { label: "Casablanca", href: "/locations" },
    { label: t("locationsTitle"), href: "/locations" },
  ];

  return (
    <footer className="border-t bg-background text-muted-foreground">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
              <Car className="h-6 w-6 text-primary" />
              <span>DriveRent</span>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              {t("description")}
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <span className="text-red-400">&#9829;</span>
              <span>in Morocco</span>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{t("company")}</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{t("support")}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{t("locationsTitle")}</h4>
            <ul className="space-y-2.5">
              {locationLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} DriveRent. {t("copyright")}
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
