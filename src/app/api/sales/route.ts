import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { sales, saleItems, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { VAT_RATE } from "@/lib/constants";
import type { PaymentMethod } from "@/types";

function generateReceiptNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RCP-${date}-${rand}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      paymentMethod,
      cashReceived,
      discountAmount = 0,
    }: {
      items: Array<{ productId: string; quantity: number }>;
      paymentMethod: PaymentMethod;
      cashReceived?: number;
      discountAmount?: number;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in the order" },
        { status: 400 }
      );
    }

    if (!["cash", "card", "credit"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Fetch current product data (never trust client prices)
    const productIds = items.map((i) => i.productId);
    const productData = await db
      .select()
      .from(products)
      .where(
        sql`${products.id} IN ${productIds}`
      );

    const productMap = new Map(productData.map((p) => [p.id, p]));

    // Validate all products exist and are active
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or inactive` },
          { status: 400 }
        );
      }
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = parseFloat(product.price);
      return {
        productId: item.productId,
        productName: product.name,
        unitPrice: unitPrice.toFixed(2),
        quantity: item.quantity,
        lineTotal: (unitPrice * item.quantity).toFixed(2),
      };
    });

    const subtotal = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.lineTotal),
      0
    );
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount - discountAmount;

    const changeGiven =
      paymentMethod === "cash" && cashReceived
        ? cashReceived - total
        : undefined;

    const receiptNumber = generateReceiptNumber();

    // Insert sale
    const [sale] = await db
      .insert(sales)
      .values({
        receiptNumber,
        subtotal: subtotal.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        total: total.toFixed(2),
        paymentMethod,
        cashReceived: cashReceived?.toFixed(2),
        changeGiven: changeGiven?.toFixed(2),
      })
      .returning();

    // Insert line items
    await db.insert(saleItems).values(
      lineItems.map((item) => ({
        saleId: sale.id,
        ...item,
      }))
    );

    // Decrement stock
    for (const item of items) {
      await db
        .update(products)
        .set({
          stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

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
        items: lineItems.map((item) => ({
          ...item,
          unitPrice: parseFloat(item.unitPrice),
          lineTotal: parseFloat(item.lineTotal),
        })),
      },
    });
  } catch (error) {
    console.error("Sale creation error:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}
