import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { products } from "@/data/products";

export default function CatalogPage() {
  return (
    <main className="page-main">
      <section className="shell page-hero compact-hero">
        <span className="eyebrow">Catalogo curado + completo</span>
        <h1>Encuentra la fragancia correcta sin perderte entre 150 opciones.</h1>
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
