"use client";

import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-sm font-medium">No items yet</p>
      <p className="text-xs mt-1">Tap products to add them here</p>
    </div>
  );
}
