import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await db.setting.findFirst({
      where: { key: "bank_payment_settings", category: "PAYMENT" },
    });

    return NextResponse.json({
      success: true,
      settings: settings ? JSON.parse(settings.value) : null,
    });
  } catch {
    return NextResponse.json({ success: true, settings: null });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { bankName, accountHolder, iban, swiftCode, instructions } = body;

  if (!bankName || !accountHolder || !iban) {
    return NextResponse.json({ error: "Bank name, account holder, and IBAN are required" }, { status: 400 });
  }

  const settingsValue = JSON.stringify({ bankName, accountHolder, iban, swiftCode, instructions });

  const existing = await db.setting.findFirst({
    where: { key: "bank_payment_settings", category: "PAYMENT" },
  });

  if (existing) {
    await db.setting.update({
      where: { id: existing.id },
      data: { value: settingsValue },
    });
  } else {
    await db.setting.create({
      data: {
        key: "bank_payment_settings",
        value: settingsValue,
        label: "Bank Payment Settings",
        description: "Bank details for manual payment transfers",
        category: "PAYMENT",
      },
    });
  }

  return NextResponse.json({ success: true });
}
