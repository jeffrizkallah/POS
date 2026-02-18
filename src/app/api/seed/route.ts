import { NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is not allowed in production" },
      { status: 403 }
    );
  }

  try {
    const result = await seedDatabase();
    return NextResponse.json({
      message: `Seeded ${result.categories} categories and ${result.products} products`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
