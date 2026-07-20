import { Resend } from "resend";
import { config } from "@/config";

export const resend = new Resend(config.resend.apiKey);

export const FROM_EMAIL = "DriveRent Maroc <notifications@driverent.ma>";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  try {
    if (!config.resend.apiKey || config.resend.apiKey.includes("your_resend")) {
      console.log("[Email] Resend not configured, skipping email:", subject);
      return { success: true, skipped: true };
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo: replyTo || "contact@driverent.ma",
    });

    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { success: false, error };
  }
}
