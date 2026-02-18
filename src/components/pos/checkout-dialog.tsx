"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, CreditCard, Wallet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CashCalculator } from "./cash-calculator";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PaymentMethod, Sale } from "@/types";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  onComplete: (sale: Sale) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "cash",
    label: "Cash",
    icon: Banknote,
    description: "Pay with cash",
  },
  {
    id: "card",
    label: "Card",
    icon: CreditCard,
    description: "Debit or credit card",
  },
  {
    id: "credit",
    label: "Credit",
    icon: Wallet,
    description: "Add to credit account",
  },
];

export function CheckoutDialog({
  open,
  onOpenChange,
  total,
  onComplete,
}: CheckoutDialogProps) {
  const items = useCartStore((s) => s.items);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (cashReceived?: number) => {
    if (!selectedMethod) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod: selectedMethod,
          cashReceived,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to complete sale");
      }

      const { sale } = await response.json();
      setSelectedMethod(null);
      onComplete(sale);
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to complete sale"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (newOpen: boolean) => {
    if (!isLoading) {
      setSelectedMethod(null);
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Charge {formatCurrency(total)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment method selection */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Select payment method
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;

                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30 hover:bg-secondary/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        <Check className="h-3 w-3" />
                      </motion.div>
                    )}
                    <Icon
                      className={cn(
                        "h-6 w-6",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {method.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {method.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment method specific content */}
          <AnimatePresence mode="wait">
            {selectedMethod === "cash" && (
              <motion.div
                key="cash"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CashCalculator
                  total={total}
                  onConfirm={(cashReceived) => handleConfirm(cashReceived)}
                  isLoading={isLoading}
                />
              </motion.div>
            )}

            {(selectedMethod === "card" || selectedMethod === "credit") && (
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => handleConfirm()}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
                >
                  {isLoading
                    ? "Processing..."
                    : `Confirm ${selectedMethod === "card" ? "Card" : "Credit"} Payment`}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
