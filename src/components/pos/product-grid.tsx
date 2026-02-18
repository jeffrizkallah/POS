"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  cartItems: Map<string, number>;
  isLoading: boolean;
}

export function ProductGrid({
  products,
  onAddToCart,
  cartItems,
  isLoading,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center bg-white rounded-xl border border-border/50 p-3">
            <Skeleton className="w-full aspect-square rounded-lg mb-2.5" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      layout
    >
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            layout
          >
            <ProductCard
              product={product}
              onAdd={onAddToCart}
              cartQuantity={cartItems.get(product.id) || 0}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
