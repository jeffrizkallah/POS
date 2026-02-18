"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  onRemove: () => void;
}

export function QuantityStepper({
  value,
  onChange,
  onRemove,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (value === 1) {
            onRemove();
          } else {
            onChange(value - 1);
          }
        }}
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
          value === 1
            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
            : "bg-secondary hover:bg-secondary/80 text-foreground"
        )}
      >
        {value === 1 ? (
          <Trash2 className="h-3.5 w-3.5" />
        ) : (
          <Minus className="h-3.5 w-3.5" />
        )}
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(value + 1);
        }}
        className="h-8 w-8 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center text-foreground transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
