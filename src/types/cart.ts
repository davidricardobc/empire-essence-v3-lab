import type { ProductSize } from "@/types/product";

export type SalesChannel = "retail" | "wholesale";

export type CartItem = {
  productId: string;
  productSlug: string;
  productName: string;
  sizeMl: ProductSize;
  sku: string;
  quantity: number;
  unitPriceCop: number;
  channel: SalesChannel;
};

export type CartTotals = {
  itemCount: number;
  subtotalCop: number;
};
