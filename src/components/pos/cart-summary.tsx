"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/format";

interface CartSummaryProps {
  subtotal: number;
  vatAmount: number;
  total: number;
}

function AnimatedAmount({ amount, large }: { amount: number; large?: boolean }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={amount.toFixed(2)}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
        className={large ? "text-lg font-bold tabular-nums" : "tabular-nums"}
      >
        {formatCurrency(amount)}
      </motion.span>
    </AnimatePresence>
  );
}

export function CartSummary({ subtotal, vatAmount, total }: CartSummaryProps) {
  return (
    <div className="space-y-2 pt-3 border-t border-border">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Subtotal</span>
        <AnimatedAmount amount={subtotal} />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>VAT (5%)</span>
        <AnimatedAmount amount={vatAmount} />
      </div>
      <div className="flex justify-between text-foreground pt-2 border-t border-border">
        <span className="text-lg font-bold">Total</span>
        <AnimatedAmount amount={total} large />
      </div>
    </div>
  );
}
