"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Globe, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminLanguageSettingsPage() {
  const t = useTranslations("admin");
  const lang = useTranslations("languages");

  const [defaultLanguage, setDefaultLanguage] = useState("fr");
  const [languages, setLanguages] = useState([
    { code: "en", enabled: true },
    { code: "fr", enabled: true },
    { code: "ar", enabled: true },
  ]);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [saving, setSaving] = useState(false);

  const languageNames: Record<string, string> = {
    en: lang("en"),
    fr: lang("fr"),
    ar: lang("ar"),
  };

  const handleToggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(t("saveSettings") + " ✓");
    } catch {
      toast.error(t("saveSettings") + " failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {t("languageSettings")}
            </h1>
          </div>
          <p className="text-sm text-gray-500">{t("languageSettingsSubtitle")}</p>
        </div>

        {/* Default Language */}
        <Card>
          <CardHeader>
            <CardTitle>{t("defaultLanguage")}</CardTitle>
            <CardDescription>
              Choose the primary language for the platform interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={defaultLanguage} onValueChange={(value) => value && setDefaultLanguage(value)}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder={t("defaultLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{languageNames.en}</SelectItem>
                <SelectItem value="fr">{languageNames.fr}</SelectItem>
                <SelectItem value="ar">{languageNames.ar}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Available Languages */}
        <Card>
          <CardHeader>
            <CardTitle>{t("availableLanguages")}</CardTitle>
            <CardDescription>
              Manage which languages are available on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.map((language) => (
              <div
                key={language.code}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">
                    {languageNames[language.code]}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({language.code.toUpperCase()})
                  </span>
                  {defaultLanguage === language.code && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={language.enabled ? "default" : "outline"}>
                    {language.enabled ? t("enabled") : t("disabled")}
                  </Badge>
                  <Switch
                    checked={language.enabled}
                    onCheckedChange={() => handleToggleLanguage(language.code)}
                    disabled={defaultLanguage === language.code}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Auto-translate */}
        <Card>
          <CardHeader>
            <CardTitle>{t("autoTranslate")}</CardTitle>
            <CardDescription>{t("autoTranslateDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-translate" className="text-sm font-medium">
                  {t("autoTranslate")}
                </Label>
                <p className="text-sm text-gray-500">{t("autoTranslateDesc")}</p>
              </div>
              <Switch
                id="auto-translate"
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? t("saving") : t("saveSettings")}
          </Button>
        </div>
      </div>
    </div>
  );
}
