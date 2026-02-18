import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export const dynamic = "force-dynamic";
import { products, categories } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");

    const conditions = [eq(products.isActive, true)];
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        nameAr: products.nameAr,
        sku: products.sku,
        barcode: products.barcode,
        price: products.price,
        categoryId: products.categoryId,
        categoryName: categories.name,
        stockQuantity: products.stockQuantity,
        imageUrl: products.imageUrl,
        isActive: products.isActive,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(asc(products.name));

    const formatted = result.map((p) => ({
      ...p,
      price: parseFloat(p.price),
    }));

    return NextResponse.json({ products: formatted });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
