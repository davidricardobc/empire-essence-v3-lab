import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { allFamilies, allMoods, allOccasions, products } from "@/data/products";
import { defaultOgImage } from "@/lib/seo";
import type { Category, Intensity } from "@/types/product";

export const metadata: Metadata = {
  title: "Catalogo de perfumes inspirados",
  description:
    "Explora el catalogo de Empire Essence: perfumes inspirados para mujer, hombre y unisex, top ventas, busqueda por mood, ocasion y notas, y compra directa con apoyo por WhatsApp.",
  alternates: {
    canonical: "/catalogo",
  },
  openGraph: {
    title: "Catalogo de perfumes inspirados | Empire Essence",
    description:
      "Perfumes inspirados con coleccion curada, top ventas y compra guiada por mood, ocasion y notas.",
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
        <span className="eyebrow">Catalogo curado + completo</span>
        <h1>Encuentra tu perfume sin perderte.</h1>
        <p>
          Filtra por estilo, ocasion e intensidad. Si tienes dudas, Alex te ayuda antes de comprar.
        </p>
        <div className="catalog-stats">
          <span>{products.length} referencias base</span>
          <span>Top ventas primero</span>
          <span>Busqueda por mood, ocasion y notas</span>
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
