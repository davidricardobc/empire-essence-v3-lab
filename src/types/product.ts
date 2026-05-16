export type Category = "masculina" | "femenina" | "unisex";

export type ProductSize = 30 | 50 | 100;

export type Intensity = "suave" | "media" | "alta";

export type ProductVariant = {
  sizeMl: ProductSize;
  sku: string;
  retailPriceCop: number;
};

export type Product = {
  id: string;
  slug: string;
  publicName: string;
  inspirationReference: string;
  category: Category;
  collection: "firma" | "top-ventas" | "nicho" | "diario";
  shortDescription: string;
  longDescription: string;
  bestFor: string;
  concentration: string;
  duration: string;
  intensity: Intensity;
  sillage: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  families: string[];
  moods: string[];
  occasions: string[];
  variants: ProductVariant[];
  featured: boolean;
  topSeller: boolean;
  wholesaleEligible: boolean;
};
