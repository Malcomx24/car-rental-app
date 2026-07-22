import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, inquiryType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
        <div style="background:linear-gradient(135deg,#f59e0b,#ea580c);padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">New Contact Form Submission</h1>
          <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px;">DriveRent Website</p>
        </div>
        <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;width:120px;vertical-align:top;">Name</td>
              <td style="padding:10px 0;color:#111827;font-size:14px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:10px 0;color:#111827;font-size:14px;"><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;">Phone</td>
              <td style="padding:10px 0;color:#111827;font-size:14px;">${phone}</td>
            </tr>` : ""}
            ${inquiryType ? `
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;">Inquiry Type</td>
              <td style="padding:10px 0;color:#111827;font-size:14px;">${inquiryType}</td>
            </tr>` : ""}
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Message</td>
              <td style="padding:10px 0;color:#111827;font-size:14px;line-height:1.6;">${message.replace(/\n/g, "<br/>")}</td>
            </tr>
          </table>
        </div>
        <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:16px;">Sent from the DriveRent contact form</p>
      </div>
    `;

    const result = await sendEmail({
      to: "zeussan1973@gmail.com",
      subject: `[DriveRent] ${inquiryType || "New Inquiry"} — ${name}`,
      html,
      replyTo: email,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  } catch (error) {
    console.error("[Contact API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
