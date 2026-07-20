"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Globe,
  CreditCard,
  Save,
  RotateCcw,
  Settings,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type SettingsSection = "general" | "language" | "payments" | "notifications" | "security" | "branding";

export default function AdminSettingsPage() {
  const t = useTranslations("admin");
  const lang = useTranslations("languages");

  const [activeSection, setActiveSection] = useState<SettingsSection>("payments");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Language settings state
  const [defaultLanguage, setDefaultLanguage] = useState("fr");
  const [languages, setLanguages] = useState([
    { code: "en", enabled: true },
    { code: "fr", enabled: true },
    { code: "ar", enabled: true },
  ]);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [savingLanguage, setSavingLanguage] = useState(false);
  const [languageDirty, setLanguageDirty] = useState(false);

  // Payment settings state
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [iban, setIban] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentDirty, setPaymentDirty] = useState(false);

  // Store initial values for dirty tracking and reset
  const [initialPayment, setInitialPayment] = useState({
    bankName: "",
    accountHolder: "",
    iban: "",
    swiftCode: "",
    instructions: "",
  });
  const [initialLanguage, setInitialLanguage] = useState({
    defaultLanguage: "fr",
    autoTranslate: false,
  });

  const languageNames: Record<string, string> = {
    en: lang("en"),
    fr: lang("fr"),
    ar: lang("ar"),
  };

  // Payment dirty tracking
  const checkPaymentDirty = useCallback(
    (bn?: string, ah?: string, ib?: string, sc?: string, ins?: string) => {
      const changed =
        (bn ?? bankName) !== initialPayment.bankName ||
        (ah ?? accountHolder) !== initialPayment.accountHolder ||
        (ib ?? iban) !== initialPayment.iban ||
        (sc ?? swiftCode) !== initialPayment.swiftCode ||
        (ins ?? instructions) !== initialPayment.instructions;
      setPaymentDirty(changed);
      if (changed) setPaymentSaved(false);
    },
    [initialPayment, bankName, accountHolder, iban, swiftCode, instructions]
  );

  // Language dirty tracking
  const checkLanguageDirty = useCallback(
    (dl?: string, at?: boolean) => {
      const changed =
        (dl ?? defaultLanguage) !== initialLanguage.defaultLanguage ||
        (at ?? autoTranslate) !== initialLanguage.autoTranslate;
      setLanguageDirty(changed);
    },
    [initialLanguage, defaultLanguage, autoTranslate]
  );

  // Load bank payment settings
  useEffect(() => {
    async function loadPaymentSettings() {
      try {
        const res = await fetch("/api/admin/settings/payment");
        const json = await res.json();
        if (json.success && json.settings) {
          const data = {
            bankName: json.settings.bankName || "",
            accountHolder: json.settings.accountHolder || "",
            iban: json.settings.iban || "",
            swiftCode: json.settings.swiftCode || "",
            instructions: json.settings.instructions || "",
          };
          setBankName(data.bankName);
          setAccountHolder(data.accountHolder);
          setIban(data.iban);
          setSwiftCode(data.swiftCode);
          setInstructions(data.instructions);
          setInitialPayment(data);
        }
      } catch {
        // Settings not configured yet
      } finally {
        setLoadingPayment(false);
      }
    }
    loadPaymentSettings();
  }, []);

  const handleToggleLanguage = (code: string) => {
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const handleSaveLanguage = async () => {
    setSavingLanguage(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setInitialLanguage({ defaultLanguage, autoTranslate });
      setLanguageDirty(false);
      toast.success(t("saveSettings") + " ✓");
    } catch {
      toast.error(t("saveSettings") + " failed");
    } finally {
      setSavingLanguage(false);
    }
  };

  const handleResetLanguage = () => {
    setDefaultLanguage(initialLanguage.defaultLanguage);
    setAutoTranslate(initialLanguage.autoTranslate);
    setLanguageDirty(false);
  };

  const handleSavePayment = async () => {
    if (!bankName.trim() || !accountHolder.trim() || !iban.trim()) {
      toast.error(t("failedToSaveSettings"));
      return;
    }
    setSavingPayment(true);
    try {
      const res = await fetch("/api/admin/settings/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankName, accountHolder, iban, swiftCode, instructions }),
      });
      const json = await res.json();
      if (json.success) {
        setInitialPayment({ bankName, accountHolder, iban, swiftCode, instructions });
        setPaymentDirty(false);
        setPaymentSaved(true);
        toast.success(t("bankDetailsSaved"));
        setTimeout(() => setPaymentSaved(false), 3000);
      } else {
        toast.error(json.error || t("failedToSaveSettings"));
      }
    } catch {
      toast.error(t("failedToSaveSettings"));
    } finally {
      setSavingPayment(false);
    }
  };

  const handleResetPayment = () => {
    setBankName(initialPayment.bankName);
    setAccountHolder(initialPayment.accountHolder);
    setIban(initialPayment.iban);
    setSwiftCode(initialPayment.swiftCode);
    setInstructions(initialPayment.instructions);
    setPaymentDirty(false);
  };

  const sections: { key: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { key: "general", label: t("settingsGeneral"), icon: <Building2 className="h-4 w-4" /> },
    { key: "language", label: t("settingsLanguage"), icon: <Globe className="h-4 w-4" /> },
    { key: "payments", label: t("settingsPayments"), icon: <CreditCard className="h-4 w-4" /> },
    { key: "notifications", label: t("settingsNotifications"), icon: <Bell className="h-4 w-4" /> },
    { key: "security", label: t("settingsSecurity"), icon: <Shield className="h-4 w-4" /> },
    { key: "branding", label: t("settingsBranding"), icon: <Palette className="h-4 w-4" /> },
  ];

  const isAnyDirty = languageDirty || paymentDirty;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Page Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <div>
                <h1 className="text-lg font-semibold">{t("settings")}</h1>
              </div>
            </div>
            {isAnyDirty && (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {t("unsavedChanges")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-0">
          {/* Mobile Section Selector */}
          <div className="lg:hidden border-b border-border bg-card">
            <div className="px-1 py-2 overflow-x-auto">
              <div className="flex gap-1">
                {sections.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setActiveSection(s.key);
                      setMobileNavOpen(false);
                    }}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === s.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-0 space-y-1 py-6 pr-4">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("settings")}
              </p>
              {sections.map((s) => {
                const isActive = activeSection === s.key;
                const hasDirty = (s.key === "language" && languageDirty) || (s.key === "payments" && paymentDirty);
                return (
                  <button
                    key={s.key}
                    onClick={() => setActiveSection(s.key)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground"
                      }`}
                    >
                      {s.icon}
                    </span>
                    <span className="flex-1 text-left">{s.label}</span>
                    {hasDirty && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    )}
                    {isActive && <ChevronRight className="h-4 w-4 text-primary/50" />}
                  </button>
                );
              })}
            </div>
          </aside>

          <Separator orientation="vertical" className="hidden lg:block self-stretch" />

          {/* Content Area */}
          <main className="flex-1 py-6 lg:pl-8 min-w-0">
            {/* ── General Settings ───────────────────────────── */}
            {activeSection === "general" && (
              <ComingSoonCard
                title={t("settingsGeneral")}
                subtitle={t("settingsGeneralSubtitle")}
              />
            )}

            {/* ── Language Settings ──────────────────────────── */}
            {activeSection === "language" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">{t("languageSettings")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("languageSettingsSubtitle")}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("defaultLanguage")}</CardTitle>
                    <CardDescription>
                      Choose the primary language for the platform interface.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={defaultLanguage}
                      onValueChange={(value) => {
                        if (value) {
                          setDefaultLanguage(value);
                          checkLanguageDirty(value, undefined);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full max-w-sm h-11">
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

                <Card>
                  <CardHeader>
                    <CardTitle>{t("availableLanguages")}</CardTitle>
                    <CardDescription>
                      Manage which languages are available on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {languages.map((language) => (
                      <div
                        key={language.code}
                        className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base font-medium">
                            {languageNames[language.code]}
                          </span>
                          <span className="text-sm text-muted-foreground">
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
                        <p className="text-sm text-muted-foreground">{t("autoTranslateDesc")}</p>
                      </div>
                      <Switch
                        id="auto-translate"
                        checked={autoTranslate}
                        onCheckedChange={(val) => {
                          setAutoTranslate(val);
                          checkLanguageDirty(undefined, val);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleResetLanguage}
                    disabled={savingLanguage || !languageDirty}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t("reset")}
                  </Button>
                  <Button onClick={handleSaveLanguage} disabled={savingLanguage || !languageDirty}>
                    {savingLanguage ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {savingLanguage ? t("saving") : t("saveSettings")}
                  </Button>
                </div>
              </div>
            )}

            {/* ── Payment Settings ───────────────────────────── */}
            {activeSection === "payments" && (
              <div className="mx-auto max-w-3xl space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">{t("paymentSettings")}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{t("paymentSettingsSubtitle")}</p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    {loadingPayment ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{t("loading")}</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Row 1: Bank Name + Account Holder */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <FieldGroup
                            label={t("bankName")}
                            required
                            htmlFor="bankName"
                          >
                            <Input
                              id="bankName"
                              className="h-11"
                              placeholder={t("bankNamePlaceholder")}
                              value={bankName}
                              onChange={(e) => {
                                setBankName(e.target.value);
                                checkPaymentDirty(e.target.value, undefined, undefined, undefined, undefined);
                              }}
                            />
                          </FieldGroup>
                          <FieldGroup
                            label={t("accountHolderName")}
                            required
                            htmlFor="accountHolder"
                          >
                            <Input
                              id="accountHolder"
                              className="h-11"
                              placeholder={t("accountHolderPlaceholder")}
                              value={accountHolder}
                              onChange={(e) => {
                                setAccountHolder(e.target.value);
                                checkPaymentDirty(undefined, e.target.value, undefined, undefined, undefined);
                              }}
                            />
                          </FieldGroup>
                        </div>

                        {/* Row 2: IBAN + Swift Code */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <FieldGroup
                            label={t("ibanRib")}
                            required
                            htmlFor="iban"
                          >
                            <Input
                              id="iban"
                              className="h-11 font-mono"
                              placeholder={t("ibanPlaceholder")}
                              value={iban}
                              onChange={(e) => {
                                setIban(e.target.value);
                                checkPaymentDirty(undefined, undefined, e.target.value, undefined, undefined);
                              }}
                            />
                          </FieldGroup>
                          <FieldGroup
                            label={t("swiftCodeOptional")}
                            htmlFor="swiftCode"
                          >
                            <Input
                              id="swiftCode"
                              className="h-11 font-mono"
                              placeholder={t("swiftCodePlaceholder")}
                              value={swiftCode}
                              onChange={(e) => {
                                setSwiftCode(e.target.value);
                                checkPaymentDirty(undefined, undefined, undefined, e.target.value, undefined);
                              }}
                            />
                          </FieldGroup>
                        </div>

                        {/* Row 3: Transfer Instructions */}
                        <FieldGroup
                          label={t("transferInstructionsOptional")}
                          htmlFor="instructions"
                        >
                          <Textarea
                            id="instructions"
                            className="min-h-[100px]"
                            placeholder={t("transferInstructionsPlaceholder")}
                            value={instructions}
                            onChange={(e) => {
                              setInstructions(e.target.value);
                              checkPaymentDirty(undefined, undefined, undefined, undefined, e.target.value);
                            }}
                          />
                        </FieldGroup>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                {!loadingPayment && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {paymentSaved && (
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {t("bankDetailsSaved")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleResetPayment}
                        disabled={savingPayment || !paymentDirty}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {t("reset")}
                      </Button>
                      <Button onClick={handleSavePayment} disabled={savingPayment || loadingPayment || !paymentDirty}>
                        {savingPayment ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {savingPayment ? t("saving") : t("saveBankDetails")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Notifications Settings ─────────────────────── */}
            {activeSection === "notifications" && (
              <ComingSoonCard
                title={t("settingsNotifications")}
                subtitle={t("settingsNotificationsSubtitle")}
              />
            )}

            {/* ── Security Settings ──────────────────────────── */}
            {activeSection === "security" && (
              <ComingSoonCard
                title={t("settingsSecurity")}
                subtitle={t("settingsSecuritySubtitle")}
              />
            )}

            {/* ── Branding Settings ──────────────────────────── */}
            {activeSection === "branding" && (
              <ComingSoonCard
                title={t("settingsBranding")}
                subtitle={t("settingsBrandingSubtitle")}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ──────────────────────────────── */

function FieldGroup({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ComingSoonCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {title === "General" ? title : title}
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            This section is under development and will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
