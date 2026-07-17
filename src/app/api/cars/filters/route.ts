import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const [brands, categories] = await Promise.all([
      db.brand.findMany({ orderBy: { name: "asc" } }),
      db.category.findMany({ orderBy: { name: "asc" } }),
    ]);

    return NextResponse.json({ success: true, data: { brands, categories } });
  } catch (error) {
    console.error("GET /api/cars/filters error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch filters" }, { status: 500 });
  }
}
