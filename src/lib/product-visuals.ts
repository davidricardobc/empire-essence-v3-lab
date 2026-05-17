import type { Category } from "@/types/product";

const productVisualByCategory: Record<Category, string> = {
  masculina: "/revision-images/empire-catalog-masculina-v1.png",
  femenina: "/revision-images/empire-catalog-femenina-v1.png",
  unisex: "/revision-images/empire-catalog-unisex-v1.png",
};

export function getProductVisual(category: Category) {
  return productVisualByCategory[category];
}

