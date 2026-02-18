export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  sku: string;
  barcode?: string;
  price: number;
  categoryId: string;
  categoryName?: string;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type PaymentMethod = "cash" | "card" | "credit";
export type SaleStatus = "completed" | "voided" | "refunded";

export interface SaleLineItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Sale {
  id: string;
  receiptNumber: string;
  items: SaleLineItem[];
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  changeGiven?: number;
  status: SaleStatus;
  createdAt: string;
}
