"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/types";
import { Coffee, Croissant, Sandwich, Cake, GlassWater, Package } from "lucide-react";

const categoryIconMap: Record<string, React.ElementType> = {
  "Hot Drinks": Coffee,
  "Cold Drinks": GlassWater,
  "Pastries": Croissant,
  "Sandwiches": Sandwich,
  "Desserts": Cake,
};

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  cartQuantity: number;
}

export function ProductCard({ product, onAdd, cartQuantity }: ProductCardProps) {
  const Icon = categoryIconMap[product.categoryName || ""] || Package;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={() => onAdd(product)}
      className={cn(
        "relative flex flex-col items-center bg-white rounded-xl border border-border/50 shadow-sm p-3 text-center transition-all hover:shadow-md hover:border-primary/20 active:shadow-sm cursor-pointer w-full",
        cartQuantity > 0 && "ring-2 ring-primary/30 border-primary/20"
      )}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center mb-2.5 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Icon className="h-8 w-8 text-primary/40" />
        )}
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-foreground leading-tight line-clamp-2 min-h-[2.5rem]">
        {product.name}
      </span>

      {/* Price */}
      <span className="text-sm font-semibold text-primary mt-1">
        {formatCurrency(product.price)}
      </span>

      {/* Cart quantity badge */}
      {cartQuantity > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md"
        >
          {cartQuantity}
        </motion.div>
      )}
    </motion.button>
  );
}
