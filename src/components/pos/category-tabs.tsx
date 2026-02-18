"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import {
  Coffee,
  GlassWater,
  Croissant,
  Sandwich,
  Cake,
  Plus,
  LayoutGrid,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Coffee,
  GlassWater,
  Croissant,
  Sandwich,
  Cake,
  Plus,
};

interface CategoryTabsProps {
  categories: Category[];
  activeId: string | null;
  onChange: (id: string | null) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  onChange,
}: CategoryTabsProps) {
  const allCategories = [
    { id: null, name: "All", icon: "LayoutGrid" },
    ...categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {allCategories.map((cat) => {
        const isActive = cat.id === activeId;
        const Icon = cat.icon === "LayoutGrid" ? LayoutGrid : iconMap[cat.icon || ""] || Coffee;

        return (
          <button
            key={cat.id ?? "all"}
            onClick={() => onChange(cat.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-white/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-category"
                className="absolute inset-0 bg-primary rounded-full shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
