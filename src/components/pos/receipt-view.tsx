"use client";

import { formatCurrency } from "@/lib/format";
import { formatDate } from "@/lib/format";
import { STORE_INFO } from "@/lib/constants";
import type { Sale } from "@/types";

interface ReceiptViewProps {
  sale: Sale;
}

export function ReceiptView({ sale }: ReceiptViewProps) {
  return (
    <div className="receipt-printable font-mono text-xs leading-relaxed max-w-[300px] mx-auto bg-white p-4 border border-border rounded-lg">
      {/* Header */}
      <div className="text-center border-b border-dashed border-border pb-3 mb-3">
        <p className="text-sm font-bold">{STORE_INFO.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {STORE_INFO.address}
        </p>
        <p className="text-[10px] text-muted-foreground">
          TRN: {STORE_INFO.trn}
        </p>
      </div>

      {/* Receipt info */}
      <div className="border-b border-dashed border-border pb-3 mb-3 space-y-0.5">
        <p>Receipt: {sale.receiptNumber}</p>
        <p>Date: {formatDate(sale.createdAt)}</p>
      </div>

      {/* Items */}
      <div className="border-b border-dashed border-border pb-3 mb-3 space-y-1">
        {sale.items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="flex-1 truncate">
              {item.productName} x{item.quantity}
            </span>
            <span className="ml-2 tabular-nums">
              {formatCurrency(item.lineTotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatCurrency(sale.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT (5%)</span>
          <span className="tabular-nums">
            {formatCurrency(sale.vatAmount)}
          </span>
        </div>
        {sale.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="tabular-nums">
              -{formatCurrency(sale.discountAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm border-t border-dashed border-border pt-1 mt-1">
          <span>TOTAL</span>
          <span className="tabular-nums">{formatCurrency(sale.total)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="border-t border-dashed border-border mt-3 pt-3 space-y-0.5">
        <div className="flex justify-between">
          <span>Payment</span>
          <span className="capitalize">{sale.paymentMethod}</span>
        </div>
        {sale.paymentMethod === "cash" && sale.cashReceived && (
          <>
            <div className="flex justify-between">
              <span>Received</span>
              <span className="tabular-nums">
                {formatCurrency(sale.cashReceived)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Change</span>
              <span className="tabular-nums">
                {formatCurrency(sale.changeGiven || 0)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center border-t border-dashed border-border mt-3 pt-3">
        <p className="text-[10px] text-muted-foreground">
          {STORE_INFO.tagline}
        </p>
      </div>
    </div>
  );
}
