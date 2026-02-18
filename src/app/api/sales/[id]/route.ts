import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [sale] = await db
      .select()
      .from(sales)
      .where(eq(sales.id, params.id));

    if (!sale) {
      return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    }

    const items = await db
      .select()
      .from(saleItems)
      .where(eq(saleItems.saleId, sale.id));

    return NextResponse.json({
      sale: {
        ...sale,
        subtotal: parseFloat(sale.subtotal),
        vatAmount: parseFloat(sale.vatAmount),
        discountAmount: parseFloat(sale.discountAmount || "0"),
        total: parseFloat(sale.total),
        cashReceived: sale.cashReceived
          ? parseFloat(sale.cashReceived)
          : undefined,
        changeGiven: sale.changeGiven
          ? parseFloat(sale.changeGiven)
          : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          unitPrice: parseFloat(item.unitPrice),
          quantity: item.quantity,
          lineTotal: parseFloat(item.lineTotal),
        })),
      },
    });
  } catch (error) {
    console.error("Sale fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sale" },
      { status: 500 }
    );
  }
}
