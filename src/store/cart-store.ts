"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { VAT_RATE } from "@/lib/constants";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getVatAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.id
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      lineTotal: (item.quantity + 1) * item.unitPrice,
                    }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                unitPrice: product.price,
                quantity: 1,
                lineTotal: product.price,
              },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity, lineTotal: quantity * item.unitPrice }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.lineTotal, 0);
      },

      getVatAmount: () => {
        return get().getSubtotal() * VAT_RATE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + subtotal * VAT_RATE;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "pos-cart",
    }
  )
);
