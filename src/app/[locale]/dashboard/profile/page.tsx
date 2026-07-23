"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Mail, Phone, Shield, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export default function DashboardProfilePage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const tAuth = useTranslations("auth");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.user) setProfile(json.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t("failedToLoadProfile")}
      </div>
    );
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">{t("profile")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("accountSettingsSubtitle")}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-full bg-muted overflow-hidden flex-shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                  {initials}
                </div>
              )}
            </div>
            <div>
              <p className="text-xl font-semibold">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-1">
                {profile.role.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold">{t("personalInformation")}</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{tAuth("firstName")}</p>
                <p className="font-medium">{profile.firstName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{tAuth("lastName")}</p>
                <p className="font-medium">{profile.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">{tAuth("email")}</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">
                  {t("phonePlaceholder") ? "Phone" : "Phone"}
                </p>
                <p className="font-medium">{profile.phone || "—"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="font-semibold">{t("accountDetails")}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t("role")}</p>
                <p className="font-medium">
                  {profile.role.replace("_", " ")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t("emailVerified")}</p>
                <p className="font-medium">
                  {profile.isEmailVerified ? tc("yes") : tc("no")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">{t("memberSince")}</p>
                <p className="font-medium">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
