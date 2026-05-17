import type { CartItem } from "@/types/cart";
import type { ProductSize } from "@/types/product";

export const SHIPPING = {
  bogotaCop: 10000,
  nationalCop: 18000,
  freeThresholdCop: 140000,
};

export const WHOLESALE_MIN_UNITS = 10;

export const WHOLESALE_RETAIL_PRICE: Record<ProductSize, number> = {
  30: 30000,
  50: 46000,
  100: 70000,
};

const wholesaleTiers: Record<ProductSize, { low: number; high: number }> = {
  30: { low: 22000, high: 20000 },
  50: { low: 32000, high: 29000 },
  100: { low: 48000, high: 44000 },
};

export function getShipping(city: string, subtotalCop: number) {
  const normalizedCity = city
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const shippingZone: "bogota" | "national" = normalizedCity.includes("bogota") ? "bogota" : "national";
  const baseShipping = shippingZone === "bogota" ? SHIPPING.bogotaCop : SHIPPING.nationalCop;
  const freeShipping = subtotalCop >= SHIPPING.freeThresholdCop;

  return {
    shippingCop: freeShipping ? 0 : baseShipping,
    freeShipping,
    shippingZone,
    amountToFreeShippingCop: Math.max(SHIPPING.freeThresholdCop - subtotalCop, 0),
  };
}

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.unitPriceCop * item.quantity, 0);
}

export function getWholesaleUnitPrice(sizeMl: ProductSize, totalUnits: number) {
  const tier = wholesaleTiers[sizeMl];
  return totalUnits >= 20 ? tier.high : tier.low;
}

export function getWholesaleLineSubtotal(sizeMl: ProductSize, quantity: number, totalUnits: number) {
  return getWholesaleUnitPrice(sizeMl, totalUnits) * quantity;
}

export function getWholesaleSuggestedMargin(sizeMl: ProductSize, unitCostCop: number) {
  const suggestedRetail = WHOLESALE_RETAIL_PRICE[sizeMl];
  return {
    suggestedRetailCop: suggestedRetail,
    profitCop: suggestedRetail - unitCostCop,
    marginPercent: Math.round(((suggestedRetail - unitCostCop) / suggestedRetail) * 100),
  };
}
