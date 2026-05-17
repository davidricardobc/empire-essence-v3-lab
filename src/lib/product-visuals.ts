import type { Category } from "@/types/product";

const productVisualByCategory: Record<Category, string> = {
  masculina: "/revision-images/empire-masculina-amaderada-seria-v1.png",
  femenina: "/revision-images/empire-femenina-floral-elegante-v1.png",
  unisex: "/revision-images/empire-unisex-minimal-limpia-v1.png",
};

export function getProductVisual(category: Category) {
  return productVisualByCategory[category];
}
