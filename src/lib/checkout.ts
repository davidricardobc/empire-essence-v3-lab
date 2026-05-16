import { z } from "zod";
import { getVariantBySku } from "@/lib/products";
import { getCartSubtotal, getShipping, getWholesaleUnitPrice, WHOLESALE_MIN_UNITS } from "@/lib/pricing";
import type { CartItem } from "@/types/cart";

const itemSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  sizeMl: z.union([z.literal(30), z.literal(50), z.literal(100)]),
  sku: z.string().min(1),
  quantity: z.number().int().positive().max(100),
  unitPriceCop: z.number().nonnegative(),
  channel: z.union([z.literal("retail"), z.literal("wholesale")]),
});

export const checkoutSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.email(),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().max(600).optional(),
  channel: z.union([z.literal("retail"), z.literal("wholesale")]),
  items: z.array(itemSchema).min(1),
});

export function createOrderReference(prefix = "EE") {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function normalizeCartItems(items: CartItem[], channel: "retail" | "wholesale") {
  const totalWholesaleUnits =
    channel === "wholesale" ? items.reduce((sum, item) => sum + Math.max(Math.floor(item.quantity), 0), 0) : 0;

  return items
    .map((item) => {
      const match = getVariantBySku(item.sku);
      if (!match) return null;
      const expectedPrice =
        channel === "wholesale"
          ? getWholesaleUnitPrice(match.variant.sizeMl, Math.max(totalWholesaleUnits, WHOLESALE_MIN_UNITS))
          : match.variant.retailPriceCop;

      return {
        productId: match.product.id,
        productSlug: match.product.slug,
        productName: match.product.publicName,
        sizeMl: match.variant.sizeMl,
        sku: match.variant.sku,
        quantity: Math.min(Math.max(Math.floor(item.quantity), 1), channel === "wholesale" ? 200 : 10),
        unitPriceCop: expectedPrice,
        channel,
      } satisfies CartItem;
    })
    .filter((item): item is CartItem => Boolean(item));
}

export function getCheckoutTotals(items: CartItem[], city: string) {
  const subtotalCop = getCartSubtotal(items);
  const shipping = getShipping(city, subtotalCop);
  return {
    subtotalCop,
    totalCop: subtotalCop + shipping.shippingCop,
    ...shipping,
  };
}
