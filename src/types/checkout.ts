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
  paymentProvider?: "wompi" | "manual";
  message?: string;
  pricing?: {
    subtotalCop: number;
    shippingCop: number;
    totalCop: number;
    freeShipping: boolean;
    shippingZone: "bogota" | "national";
  };
};
