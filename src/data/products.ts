import type { Product } from "@/types/product";
import productsSource from "./products.generated.json";

export const products = productsSource as Product[];

export const categoryLabels = {
  masculina: "Masculina",
  femenina: "Femenina",
  unisex: "Unisex / Especial",
} as const;

export const allFamilies = Array.from(new Set(products.flatMap((product) => product.families))).sort();
export const allOccasions = Array.from(new Set(products.flatMap((product) => product.occasions))).sort();
export const allMoods = Array.from(new Set(products.flatMap((product) => product.moods))).sort();
