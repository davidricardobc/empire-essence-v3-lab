import { products } from "@/data/products";
import type { Product } from "@/types/product";

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductBySku(sku: string) {
  return products.find((product) => product.variants.some((variant) => variant.sku === sku));
}

export function getVariantBySku(sku: string) {
  const product = getProductBySku(sku);
  const variant = product?.variants.find((item) => item.sku === sku);
  return product && variant ? { product, variant } : null;
}

export function getFeaturedProducts(count = 6) {
  return products.filter((product) => product.featured).slice(0, count);
}

export function getTopSellers(count = 8) {
  return products.filter((product) => product.topSeller).slice(0, count);
}

export function getRelatedProducts(product: Product, count = 3) {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const familyMatches = candidate.families.filter((family) => product.families.includes(family)).length;
      const moodMatches = candidate.moods.filter((mood) => product.moods.includes(mood)).length;
      const categoryBonus = candidate.category === product.category ? 2 : 0;
      const sellerBonus = candidate.topSeller ? 1 : 0;
      return { candidate, score: familyMatches * 3 + moodMatches * 2 + categoryBonus + sellerBonus };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(({ candidate }) => candidate);
}

export function searchProducts(query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return products;

  return products.filter((product) => {
    const haystack = [
      product.publicName,
      product.inspirationReference,
      product.category,
      product.collection,
      product.shortDescription,
      product.longDescription,
      product.bestFor,
      ...product.families,
      ...product.moods,
      ...product.occasions,
      ...product.notes.top,
      ...product.notes.heart,
      ...product.notes.base,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(term);
  });
}
