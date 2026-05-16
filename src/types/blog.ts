export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: "guia" | "venta" | "regalo" | "duracion" | "mayorista";
  readingMinutes: number;
  conversionIntent: string;
  publishedAt: string;
  heroImage: string;
  featured: boolean;
  sourceLabel?: string;
  sourceUrl?: string;
  audience?: "retail" | "mayorista" | "mixto";
  wholesaleSignal?: string;
  wholesaleCtaLabel?: string;
  productSlugs: string[];
  sections: BlogSection[];
  ctaLabel: string;
};
