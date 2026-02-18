"use client";

import { motion } from "framer-motion";
import { QuantityStepper } from "./quantity-stepper";
import { formatCurrency } from "@/lib/format";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between py-3 border-b border-border/40 last:border-0"
    >
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-sm font-medium text-foreground truncate">
          {item.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(item.unitPrice)} each
        </p>
      </div>
      <div className="flex items-center gap-3">
        <QuantityStepper
          value={item.quantity}
          onChange={(qty) => onUpdateQuantity(item.productId, qty)}
          onRemove={() => onRemove(item.productId)}
        />
        <span className="text-sm font-semibold w-20 text-right tabular-nums">
          {formatCurrency(item.lineTotal)}
        </span>
      </div>
    </motion.div>
  );
}
