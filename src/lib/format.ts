import { CURRENCY } from "./constants";

export function formatCurrency(amount: number): string {
  return `${CURRENCY} ${amount.toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}
