import type { Product } from "@/types/product";

export type CommercialPriorityTier = "campaign" | "support" | "catalog";

const campaignPriorityIds = new Set([
  "p-conquista",
  "p-despertar",
  "p-ambicion",
  "p-celebracion",
  "p-black-opium",
  "p-misterio",
  "p-radiante",
  "p-arabian-tonka",
  "p-extasis",
]);

const supportPriorityIds = new Set(["p-invictus", "p-vertigo", "p-plenitud", "p-gracia", "p-scandal"]);

export function getCommercialPriority(product: Product): CommercialPriorityTier {
  if (campaignPriorityIds.has(product.id)) return "campaign";
  if (supportPriorityIds.has(product.id) || product.topSeller) return "support";
  return "catalog";
}

export function getCommercialPriorityScore(product: Product) {
  const tier = getCommercialPriority(product);
  if (tier === "campaign") return 100;
  if (tier === "support") return 60;
  return product.featured ? 35 : product.topSeller ? 30 : 0;
}

export function getCommercialPriorityLabel(product: Product) {
  const tier = getCommercialPriority(product);
  if (tier === "campaign") return "Prioridad campaña";
  if (tier === "support") return "Alta rotación";
  return null;
}

export function sortByCommercialPriority<T extends Product>(items: T[]) {
  return [...items].sort((a, b) => {
    const priorityDelta = getCommercialPriorityScore(b) - getCommercialPriorityScore(a);
    if (priorityDelta !== 0) return priorityDelta;
    if (a.topSeller !== b.topSeller) return a.topSeller ? -1 : 1;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.publicName.localeCompare(b.publicName);
  });
}
