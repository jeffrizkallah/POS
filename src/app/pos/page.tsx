"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { SearchBar } from "@/components/pos/search-bar";
import { CategoryTabs } from "@/components/pos/category-tabs";
import { ProductGrid } from "@/components/pos/product-grid";
import { CartPanel } from "@/components/pos/cart-panel";
import { SuccessOverlay } from "@/components/pos/success-overlay";
import { useCartStore } from "@/store/cart-store";
import type { Product, Category, Sale } from "@/types";

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);

  // Cart quantities map for product cards
  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((item) => map.set(item.productId, item.quantity));
    return map;
  }, [cartItems]);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fuse.js search
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "sku", weight: 0.3 },
          { name: "barcode", weight: 0.2 },
        ],
        threshold: 0.3,
        minMatchCharLength: 2,
      }),
    [products]
  );

  // Filtered products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery.trim().length >= 2) {
      result = fuse.search(searchQuery).map((r) => r.item);
    } else if (activeCategory) {
      // Category filter (only when not searching)
      result = products.filter((p) => p.categoryId === activeCategory);
    }

    return result;
  }, [products, searchQuery, activeCategory, fuse]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
    },
    [addItem]
  );

  const handleSaleComplete = useCallback((sale: Sale) => {
    setCompletedSale(sale);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleNewSale = useCallback(() => {
    setCompletedSale(null);
  }, []);

  return (
    <>
      <div className="flex h-full">
        {/* Left side - Products (65%) */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Search + Categories */}
          <div className="space-y-3 mb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryTabs
              categories={categories}
              activeId={activeCategory}
              onChange={(id) => {
                setActiveCategory(id);
                setSearchQuery("");
              }}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              cartItems={cartQuantityMap}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Right side - Cart (35%) */}
        <div className="w-[380px] flex-shrink-0">
          <CartPanel onSaleComplete={handleSaleComplete} />
        </div>
      </div>

      {/* Success overlay */}
      <SuccessOverlay
        sale={completedSale}
        onNewSale={handleNewSale}
        onPrint={handlePrint}
      />
    </>
  );
}
