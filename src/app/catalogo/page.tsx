import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { products } from "@/data/products";
import { defaultOgImage } from "@/lib/seo";

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

export default function CatalogPage() {
  return (
    <main className="page-main">
      <section className="shell page-hero compact-hero">
        <span className="eyebrow">Catalogo curado + completo</span>
        <h1>Encuentra perfumes inspirados para mujer, hombre y unisex sin perderte entre 150 opciones.</h1>
        <p>
          Esta primera coleccion muestra referencias top y perfiles comerciales fuertes. El catalogo completo se puede
          expandir con las mas de 150 fragancias disponibles.
        </p>
        <div className="catalog-stats">
          <span>{products.length} referencias base</span>
          <span>Top ventas primero</span>
          <span>Busqueda por mood, ocasion y notas</span>
        </div>
      </section>
      <div className="shell">
        <CatalogExplorer />
      </div>
    </main>
  );
}
