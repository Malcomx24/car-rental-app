import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "banking-config.json");

async function readConfig() {
  const raw = await readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeConfig(data: Record<string, string>) {
  await writeFile(CONFIG_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await readConfig();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to load payment settings:", error);
    return NextResponse.json({ success: true, settings: null });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bankName, accountHolder, iban, swiftCode, instructions } = body;

    if (!bankName || !accountHolder || !iban) {
      return NextResponse.json({ error: "Bank name, account holder, and IBAN are required" }, { status: 400 });
    }

    await writeConfig({ bankName, accountHolder, iban, swiftCode, instructions });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save payment settings:", error);
    return NextResponse.json({ error: "Failed to save payment settings" }, { status: 500 });
  }
}
