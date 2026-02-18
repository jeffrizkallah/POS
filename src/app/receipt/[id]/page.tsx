"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ReceiptView } from "@/components/pos/receipt-view";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Sale } from "@/types";

export default function ReceiptPage() {
  const params = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch(`/api/sales/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch sale");
        const data = await res.json();
        setSale(data.sale);
      } catch (error) {
        console.error("Failed to fetch receipt:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading receipt...</p>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Receipt not found</p>
        <Link href="/pos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-sm mx-auto space-y-4">
        <div className="flex justify-between items-center px-4 print:hidden">
          <Link href="/pos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <Button onClick={() => window.print()} size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
        <ReceiptView sale={sale} />
      </div>
    </div>
  );
}
