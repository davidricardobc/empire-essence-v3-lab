import type { CartItem, SalesChannel } from "@/types/cart";

export type CheckoutCustomer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
};

export type CheckoutPayload = CheckoutCustomer & {
  channel: SalesChannel;
  items: CartItem[];
};

export type CheckoutApiResponse = {
  ok: boolean;
  reference?: string;
  checkoutUrl?: string | null;
  whatsappUrl?: string;
  nextAction?: "wompi" | "whatsapp";
  paymentProvider?: "wompi" | "manual";
  paymentStatus?: "initiated" | "pending" | "paid" | "failed";
  orderStatus?: "pending" | "confirmed";
  message?: string;
  pricing?: {
    subtotalCop: number;
    shippingCop: number;
    totalCop: number;
    freeShipping: boolean;
    shippingZone: "bogota" | "national";
  };
};
