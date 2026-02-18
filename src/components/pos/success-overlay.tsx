"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptView } from "./receipt-view";
import { formatCurrency } from "@/lib/format";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Sale } from "@/types";

interface SuccessOverlayProps {
  sale: Sale | null;
  onNewSale: () => void;
  onPrint: () => void;
}

export function SuccessOverlay({
  sale,
  onNewSale,
  onPrint,
}: SuccessOverlayProps) {
  return (
    <AnimatePresence>
      {sale && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
          >
            {/* Success header */}
            <div className="bg-gradient-to-b from-green-50 to-white pt-8 pb-4 text-center">
              {/* Animated checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  bounce: 0.5,
                  duration: 0.6,
                  delay: 0.1,
                }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
                </motion.div>
              </motion.div>

              {/* Amount */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-foreground"
              >
                {formatCurrency(sale.total)}
              </motion.p>

              {/* Payment method badge */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize"
              >
                Paid with {sale.paymentMethod}
              </motion.span>
            </div>

            {/* Receipt */}
            <ScrollArea className="max-h-64 px-4">
              <ReceiptView sale={sale} />
            </ScrollArea>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 space-y-2 border-t border-border"
            >
              <Button
                onClick={onPrint}
                variant="outline"
                className="w-full h-10"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button
                onClick={onNewSale}
                className="w-full h-10 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Sale
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
