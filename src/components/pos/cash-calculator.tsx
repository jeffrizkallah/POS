"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CashCalculatorProps {
  total: number;
  onConfirm: (cashReceived: number) => void;
  isLoading: boolean;
}

const QUICK_AMOUNTS = [50, 100, 200, 500];

export function CashCalculator({
  total,
  onConfirm,
  isLoading,
}: CashCalculatorProps) {
  const [input, setInput] = useState("");

  const cashReceived = input ? parseFloat(input) : 0;
  const change = cashReceived - total;
  const isValid = cashReceived >= total;

  const handleNumpad = (val: string) => {
    if (val === "C") {
      setInput("");
      return;
    }
    if (val === "." && input.includes(".")) return;
    if (val === "." && input === "") {
      setInput("0.");
      return;
    }
    // Limit to 2 decimal places
    const parts = (input + val).split(".");
    if (parts[1] && parts[1].length > 2) return;
    setInput(input + val);
  };

  return (
    <div className="space-y-4">
      {/* Amount display */}
      <div className="bg-secondary/50 rounded-xl p-4 text-center space-y-1">
        <p className="text-sm text-muted-foreground">Amount Tendered</p>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          AED {input || "0.00"}
        </p>
        {input && (
          <p
            className={cn(
              "text-sm font-medium",
              isValid ? "text-green-600" : "text-destructive"
            )}
          >
            {isValid
              ? `Change: ${formatCurrency(change)}`
              : `Short: ${formatCurrency(Math.abs(change))}`}
          </p>
        )}
      </div>

      {/* Quick amounts */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            onClick={() => setInput(amount.toFixed(2))}
            className="h-10 text-sm font-medium"
          >
            {amount}
          </Button>
        ))}
      </div>

      {/* Exact amount button */}
      <Button
        variant="outline"
        onClick={() => setInput(total.toFixed(2))}
        className="w-full h-10 text-sm font-medium"
      >
        Exact Amount ({formatCurrency(total)})
      </Button>

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "C"].map(
          (key) => (
            <Button
              key={key}
              variant={key === "C" ? "destructive" : "secondary"}
              onClick={() => handleNumpad(key)}
              className={cn(
                "h-12 text-lg font-semibold",
                key === "C" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
              )}
            >
              {key}
            </Button>
          )
        )}
      </div>

      {/* Confirm */}
      <Button
        onClick={() => onConfirm(cashReceived)}
        disabled={!isValid || isLoading}
        className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
      >
        {isLoading ? "Processing..." : `Confirm Payment`}
      </Button>
    </div>
  );
}
