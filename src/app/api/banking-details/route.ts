import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readFile } from "fs/promises";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "banking-config.json");

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await readFile(CONFIG_PATH, "utf-8");
    const settings = JSON.parse(raw);
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: true, data: null });
  }
}
