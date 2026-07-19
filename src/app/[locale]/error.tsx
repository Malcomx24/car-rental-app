"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        {t("description")}
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          {t("errorId")}: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          {t("tryAgain")}
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {t("goHome")}
        </a>
      </div>
    </div>
  );
}
