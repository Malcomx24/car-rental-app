"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Home, ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-8">
        <div className="text-[120px] md:text-[160px] font-bold text-muted-100 leading-none select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Car className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        {t("description")}
      </p>

      <div className="flex flex-wrap gap-3">
        <Link href="/">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            {t("backToHome")}
          </Button>
        </Link>
        <Link href="/cars">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            {t("browseCars")}
          </Button>
        </Link>
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("goBack")}
        </Button>
      </div>
    </div>
  );
}
