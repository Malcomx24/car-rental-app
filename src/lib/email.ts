import { Resend } from "resend";
import { config } from "@/config";

export const resend = new Resend(config.resend.apiKey);

export const FROM_EMAIL = "DriveRent <onboarding@resend.dev>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  if (!config.resend.apiKey || config.resend.apiKey.includes("your_resend")) {
    console.error("[Email] RESEND_API_KEY is not set in .env.local");
    return { success: false, error: "Email service not configured" };
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
    replyTo: replyTo || "contact@driverent.ma",
  });

  if (error) {
    console.error("[Email] Resend error:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
