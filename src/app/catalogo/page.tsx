import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { allFamilies, allMoods, allOccasions, products } from "@/data/products";
import { defaultOgImage } from "@/lib/seo";
import type { Category, Intensity } from "@/types/product";

export const metadata: Metadata = {
  title: "Catálogo de perfumes inspirados",
  description:
    "Explora el catálogo de Empire Essence: perfumes inspirados para mujer, hombre y unisex, top ventas, búsqueda por mood, ocasión y notas, y compra directa con apoyo por WhatsApp.",
  alternates: {
    canonical: "/catalogo",
  },
  openGraph: {
    title: "Catálogo de perfumes inspirados | Empire Essence",
    description:
      "Perfumes inspirados con colección curada, top ventas y compra guiada por mood, ocasión y notas.",
    url: "/catalogo",
    images: [defaultOgImage],
  },
};

const categories: Array<Category | "all"> = ["all", "femenina", "masculina", "unisex"];
const intensities: Array<Intensity | "all"> = ["all", "suave", "media", "alta"];

export default async function CatalogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const initialFilters = {
    query: getParam(params.q),
    category: parseParam(getParam(params.category), categories),
    family: parseParam(getParam(params.family), ["all", ...allFamilies]),
    mood: parseParam(getParam(params.mood), ["all", ...allMoods]),
    occasion: parseParam(getParam(params.occasion), ["all", ...allOccasions]),
    intensity: parseParam(getParam(params.intensity), intensities),
  };

  return (
    <main className="page-main">
      <section className="shell page-hero compact-hero">
        <span className="eyebrow">Catálogo curado + completo</span>
        <h1>Encuentra tu perfume sin perderte.</h1>
        <p>
          Perfumes inspirados para mujer, hombre y unisex en 30, 50 y 100 ml. Filtra por estilo, revisa rápido para
          quién va y compra por carrito o WhatsApp.
        </p>
        <div className="catalog-stats">
          <span>{products.length} referencias base</span>
          <span>Tamaños 30, 50 y 100 ml</span>
          <span>Compra por carrito o WhatsApp</span>
        </div>
      </section>
      <div className="shell">
        <CatalogExplorer initialFilters={initialFilters} />
      </div>
    </main>
  );
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseParam<T extends string>(value: string, allowed: readonly T[]) {
  return allowed.includes(value as T) ? (value as T) : "all";
}
