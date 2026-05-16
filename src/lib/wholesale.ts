import { z } from "zod";
import {
  getWholesaleLineSubtotal,
  getWholesaleSuggestedMargin,
  getWholesaleUnitPrice,
  WHOLESALE_MIN_UNITS,
} from "@/lib/pricing";
import type { ProductSize } from "@/types/product";
import type { WholesaleTier } from "@/types/wholesale";

export const wholesaleQuoteSchema = z.object({
  lead: z.object({
    name: z.string().min(2),
    phone: z.string().min(7),
    email: z.email(),
    city: z.string().min(2),
    businessType: z.string().min(2),
    salesChannel: z.string().min(2),
    budget: z.string().min(2),
    notes: z.string().max(600).optional(),
  }),
  kit: z.array(
    z.object({
      sizeMl: z.union([z.literal(30), z.literal(50), z.literal(100)]),
      quantity: z.number().int().nonnegative().max(200),
    }),
  ),
  supplyNeeds: z.array(z.string()).optional(),
});

export function scoreWholesaleLead(input: z.infer<typeof wholesaleQuoteSchema>["lead"], totalUnits: number) {
  let score = 18;
  const business = input.businessType.toLowerCase();
  const salesChannel = input.salesChannel.toLowerCase();
  const budget = input.budget.toLowerCase();

  if (business.includes("tienda")) score += 20;
  if (business.includes("distribuidor")) score += 28;
  if (business.includes("revendedor")) score += 14;
  if (salesChannel.includes("instagram") || salesChannel.includes("tiktok")) score += 12;
  if (salesChannel.includes("local") || salesChannel.includes("tienda")) score += 16;
  if (budget.includes("3m") || budget.includes("+3")) score += 25;
  else if (budget.includes("1.5")) score += 18;
  else if (budget.includes("800")) score += 10;
  if (totalUnits >= 20) score += 18;
  else if (totalUnits >= WHOLESALE_MIN_UNITS) score += 10;
  if (input.notes?.trim()) score += 4;

  return Math.min(score, 100);
}

export function getWholesaleTier(score: number): WholesaleTier {
  if (score >= 72) return "hot";
  if (score >= 48) return "warm";
  return "nurture";
}

export function summarizeWholesaleKit(kit: { sizeMl: ProductSize; quantity: number }[]) {
  const totalUnits = kit.reduce((sum, line) => sum + line.quantity, 0);
  const lines = kit
    .filter((line) => line.quantity > 0)
    .map((line) => {
      const unitCostCop = getWholesaleUnitPrice(line.sizeMl, Math.max(totalUnits, WHOLESALE_MIN_UNITS));
      const subtotalCop = getWholesaleLineSubtotal(line.sizeMl, line.quantity, Math.max(totalUnits, WHOLESALE_MIN_UNITS));
      const margin = getWholesaleSuggestedMargin(line.sizeMl, unitCostCop);
      return {
        ...line,
        unitCostCop,
        subtotalCop,
        ...margin,
      };
    });

  const subtotalCop = lines.reduce((sum, line) => sum + line.subtotalCop, 0);
  const projectedProfitCop = lines.reduce((sum, line) => sum + line.profitCop * line.quantity, 0);

  return {
    valid: totalUnits >= WHOLESALE_MIN_UNITS,
    minimumUnits: WHOLESALE_MIN_UNITS,
    totalUnits,
    lines,
    subtotalCop,
    projectedProfitCop,
    averageMarginPercent: lines.length
      ? Math.round(lines.reduce((sum, line) => sum + line.marginPercent, 0) / lines.length)
      : 0,
  };
}
