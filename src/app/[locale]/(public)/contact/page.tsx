"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  const CONTACT_INFO = [
    { icon: Phone, label: t("info.phone.label"), value: "(+212) 679844325", description: t("info.phone.description") },
    { icon: Mail, label: t("info.email.label"), value: "zeussan1973@gmail.com", description: t("info.email.description") },
    { icon: MapPin, label: t("info.headquarters.label"), value: "Tarrast Inzegane, Agadir ", description: "" },
    { icon: Clock, label: t("info.hours.label"), value: t("info.hours.value"), description: t("info.hours.description") },
  ];

  const INQUIRY_TYPES = [
    t("inquiryTypes.general"),
    t("inquiryTypes.booking"),
    t("inquiryTypes.billing"),
    t("inquiryTypes.partnership"),
    t("inquiryTypes.press"),
    t("inquiryTypes.technical"),
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(t("fillRequiredFields"));
      return;
    }
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
    toast.success(t("messageSentSuccess"));
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 to-purple-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("heroTitle")}</h1>
          <p className="text-gray-300 text-lg max-w-xl">
            {t("heroDescription")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">{t("getInTouch")}</h2>
            {CONTACT_INFO.map((info) => {
              const Icon = info.icon;
              return (
                <Card key={info.label}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{info.label}</p>
                        <p className="text-sm text-muted-foreground">{info.value}</p>
                        {info.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{info.description}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("messageSentTitle")}</h3>
                    <p className="text-muted-foreground max-w-sm">
                      {t("messageSentDescription")}
                    </p>
                    <Button className="mt-6" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", inquiryType: "", message: "" }); }}>
                      {t("sendAnotherMessage")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("form.fullName")}</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t("form.email")}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("form.phone")}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("form.inquiryType")}</Label>
                        <Select value={form.inquiryType} onValueChange={(v) => setForm((p) => ({ ...p, inquiryType: v ?? "" }))}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("form.selectTopic")} />
                          </SelectTrigger>
                          <SelectContent>
                            {INQUIRY_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("form.message")}</Label>
                      <Textarea
                        id="message"
                        placeholder={t("form.howCanWeHelp")}
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={sending} className="w-full md:w-auto">
                      {sending ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {t("form.sending")}</>
                      ) : (
                        <><Send className="h-4 w-4 mr-2" /> {t("form.sendMessage")}</>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
