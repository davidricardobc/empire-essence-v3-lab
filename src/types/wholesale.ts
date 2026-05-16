import type { ProductSize } from "@/types/product";

export type WholesaleKitLine = {
  sizeMl: ProductSize;
  quantity: number;
};

export type WholesaleLead = {
  name: string;
  phone: string;
  email: string;
  city: string;
  businessType: string;
  salesChannel: string;
  budget: string;
  notes?: string;
};

export type WholesaleTier = "hot" | "warm" | "nurture";
