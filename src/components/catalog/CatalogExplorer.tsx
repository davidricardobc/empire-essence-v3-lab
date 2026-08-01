"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Filter, MessageCircle, Search } from "lucide-react";
import { allFamilies, allMoods, allOccasions, categoryLabels, products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import { sortByCommercialPriority } from "@/lib/commercial-priority";
import { getSearchTokenGroups, productMatchesAllSearchTerms, scoreProductSearch } from "@/lib/product-search";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";
import type { Category, Intensity } from "@/types/product";

const categories: Array<Category | "all"> = ["all", "femenina", "masculina", "unisex"];
const intensities: Array<Intensity | "all"> = ["all", "suave", "media", "alta"];

type CatalogExplorerProps = {
  initialFilters?: {
    query?: string;
    category?: Category | "all";
    family?: string;
    mood?: string;
    occasion?: string;
    intensity?: Intensity | "all";
  };
};

export function CatalogExplorer({ initialFilters }: CatalogExplorerProps) {
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [category, setCategory] = useState<Category | "all">(initialFilters?.category ?? "all");
  const [family, setFamily] = useState(initialFilters?.family ?? "all");
  const [mood, setMood] = useState(initialFilters?.mood ?? "all");
  const [occasion, setOccasion] = useState(initialFilters?.occasion ?? "all");
  const [intensity, setIntensity] = useState<Intensity | "all">(initialFilters?.intensity ?? "all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const catalogResult = useMemo(() => {
    const tokenGroups = getSearchTokenGroups(query);
    const activeFilterTerms = [family, mood, occasion, category, intensity].filter((value) => value !== "all");
    const filterTokenGroups = getSearchTokenGroups(activeFilterTerms.join(" "));

    const matchesActiveFilters = (product: Product) => {
      if (category !== "all" && product.category !== category) return false;
      if (family !== "all" && !product.families.includes(family)) return false;
      if (mood !== "all" && !product.moods.includes(mood)) return false;
      if (occasion !== "all" && !product.occasions.includes(occasion)) return false;
      if (intensity !== "all" && product.intensity !== intensity) return false;
      return true;
    };

    const exactMatches = sortByCommercialPriority(
      products.filter((product) => matchesActiveFilters(product) && productMatchesAllSearchTerms(product, tokenGroups)),
    );

    if (exactMatches.length) {
      return {
        isRelaxed: false,
        items: exactMatches,
        totalExact: exactMatches.length,
      };
    }

    const relaxedTokenGroups = tokenGroups.length ? tokenGroups : filterTokenGroups;
    const relaxedMatches = products
      .map((product) => ({
        product,
        score: scoreProductSearch(product, relaxedTokenGroups),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    return {
      isRelaxed: relaxedMatches.length > 0,
      items: sortByCommercialPriority(relaxedMatches).slice(0, 24),
      totalExact: 0,
    };
  }, [category, family, intensity, mood, occasion, query]);

  const visibleProducts = catalogResult.items;

  const activeFilters = [
    category !== "all" ? { key: "category", label: `Categoría: ${categoryLabels[category]}`, clear: () => setCategory("all") } : null,
    family !== "all" ? { key: "family", label: `Familia: ${family}`, clear: () => setFamily("all") } : null,
    mood !== "all" ? { key: "mood", label: `Mood: ${mood}`, clear: () => setMood("all") } : null,
    occasion !== "all" ? { key: "occasion", label: `Ocasión: ${occasion}`, clear: () => setOccasion("all") } : null,
    intensity !== "all" ? { key: "intensity", label: `Intensidad: ${intensity}`, clear: () => setIntensity("all") } : null,
    query.trim() ? { key: "q", label: `Búsqueda: ${query.trim()}`, clear: () => setQuery("") } : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

  function clearAllFilters() {
    setQuery("");
    setCategory("all");
    setFamily("all");
    setMood("all");
    setOccasion("all");
    setIntensity("all");
  }

  const catalogAssistUrl = buildWhatsappUrl(
    "Hola Alexa. Estoy viendo el catálogo de Empire Essence y quiero ayuda para encontrar una fragancia.",
  );

  return (
    <section className="catalog-shell">
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca por aroma, ocasión, inspiración o mood"
          />
        </label>
        <div className="catalog-toolbar-actions">
          <div className="result-count">
            <Filter size={16} />
            {catalogResult.isRelaxed
              ? `${visibleProducts.length} sugerencias cercanas de ${products.length} referencias`
              : `${visibleProducts.length} de ${products.length} referencias visibles`}
          </div>
          <div className="campaign-count">Selecciones destacadas primero</div>
          <button
            type="button"
            className="mobile-filter-toggle"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters"
          >
            <Filter size={16} />
            {filtersOpen ? "Ocultar filtros" : "Filtros"}
          </button>
        </div>
      </div>

      {activeFilters.length ? (
        <div className="catalog-intent-bar">
          <div>
            <strong>{catalogResult.isRelaxed ? "Opciones cercanas disponibles" : "Vista guiada activa"}</strong>
            <p>
              {catalogResult.isRelaxed
                ? "No hubo coincidencia exacta con esa mezcla. Te mostramos alternativas cercanas para no dejarte en blanco."
                : "Estás viendo una selección filtrada. Puedes limpiar o afinar estos filtros cuando quieras."}
            </p>
          </div>
          <div className="active-filter-list">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className="active-filter-chip"
                onClick={filter.clear}
                aria-label={`Quitar filtro ${filter.label}`}
              >
                {filter.label} ×
              </button>
            ))}
            <button type="button" className="text-button" onClick={clearAllFilters}>
              Limpiar todo
            </button>
          </div>
        </div>
      ) : null}

      <div className="catalog-guidance" aria-label="Ayuda para comprar más rápido">
        <div>
          <strong>Compra más fácil</strong>
          <p>Elige tamaño y agrega desde la ficha. Entra al detalle solo si quieres confirmar notas o confianza extra.</p>
        </div>
        <div>
          <strong>Señales rápidas</strong>
          <p>Tamaños, sensación, precio y familias quedan visibles para decidir sin fricción.</p>
        </div>
      </div>

      <div id="catalog-filters" className={`filter-grid ${filtersOpen ? "is-open" : ""}`}>
        <FilterSelect label="Categoría" value={category} onChange={(value) => setCategory(value as Category | "all")}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "Todas" : categoryLabels[item]}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Familia" value={family} onChange={setFamily}>
          <option value="all">Todas</option>
          {allFamilies.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Mood" value={mood} onChange={setMood}>
          <option value="all">Todos</option>
          {allMoods.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Ocasión" value={occasion} onChange={setOccasion}>
          <option value="all">Todas</option>
          {allOccasions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Intensidad" value={intensity} onChange={(value) => setIntensity(value as Intensity | "all")}>
          {intensities.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "Todas" : item}
            </option>
          ))}
        </FilterSelect>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>

      {!visibleProducts.length ? (
        <div className="empty-state">
          <span className="empty-kicker">Sin coincidencias exactas</span>
          <h3>No encontramos esa combinación.</h3>
          <p>
            Quita un filtro o vuelve al catálogo completo. Si estás buscando algo específico, Alexa puede orientarte por
            ocasión, estilo o precio inteligente.
          </p>
          <div className="empty-actions">
            <button type="button" className="secondary-button" onClick={clearAllFilters}>
              Ver todo el catálogo
            </button>
            <a href={catalogAssistUrl} className="ghost-button" target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Pedir recomendación
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
