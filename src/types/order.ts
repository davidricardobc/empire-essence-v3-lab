import type { CartItem, SalesChannel } from "@/types/cart";
import type { CheckoutCustomer } from "@/types/checkout";

export type PaymentStatus = "initiated" | "pending" | "paid" | "failed";
export type OrderStatus = "pending" | "confirmed";

export type OrderRecord = {
  reference: string;
  channel: SalesChannel;
  customer: CheckoutCustomer;
  items: CartItem[];
  subtotalCop: number;
  shippingCop: number;
  totalCop: number;
  freeShipping: boolean;
  shippingZone: "bogota" | "national";
  paymentProvider: "wompi" | "manual";
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  wompiCheckoutUrl?: string | null;
  wompiTransactionId?: string | null;
  wompiStatus?: string | null;
  createdAt: string;
  updatedAt: string;
};
