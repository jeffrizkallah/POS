"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";
import { CheckoutDialog } from "./checkout-dialog";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Sale } from "@/types";

interface CartPanelProps {
  onSaleComplete: (sale: Sale) => void;
}

export function CartPanel({ onSaleComplete }: CartPanelProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getVatAmount = useCartStore((s) => s.getVatAmount);
  const getTotal = useCartStore((s) => s.getTotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const subtotal = getSubtotal();
  const vatAmount = getVatAmount();
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="flex flex-col h-full bg-white border-l border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Current Order</h2>
        </div>
        {items.length > 0 && (
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {/* Cart items */}
      <ScrollArea className="flex-1 px-4">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </AnimatePresence>
        )}
      </ScrollArea>

      {/* Summary + Actions */}
      {items.length > 0 && (
        <div className="px-4 pb-4 space-y-3">
          <CartSummary
            subtotal={subtotal}
            vatAmount={vatAmount}
            total={total}
          />

          {/* Charge button */}
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(108, 92, 231, 0)",
                "0 0 0 4px rgba(108, 92, 231, 0.15)",
                "0 0 0 0 rgba(108, 92, 231, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-lg"
          >
            <Button
              onClick={() => setCheckoutOpen(true)}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg"
            >
              Charge {formatCurrency(total)}
            </Button>
          </motion.div>

          {/* Clear button */}
          <Button
            variant="ghost"
            onClick={() => setClearDialogOpen(true)}
            className="w-full text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Order
          </Button>
        </div>
      )}

      {/* Clear confirmation dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Clear Order</DialogTitle>
            <DialogDescription>
              Remove all {itemCount} items from the current order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setClearDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearCart();
                setClearDialogOpen(false);
              }}
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        total={total}
        onComplete={(sale) => {
          setCheckoutOpen(false);
          clearCart();
          onSaleComplete(sale);
        }}
      />
    </div>
  );
}
