"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Filter, Search } from "lucide-react";
import { allFamilies, allMoods, allOccasions, categoryLabels, products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (family !== "all" && !product.families.includes(family)) return false;
      if (mood !== "all" && !product.moods.includes(mood)) return false;
      if (occasion !== "all" && !product.occasions.includes(occasion)) return false;
      if (intensity !== "all" && product.intensity !== intensity) return false;
      if (!term) return true;

      const haystack = [
        product.publicName,
        product.inspirationReference,
        product.shortDescription,
        product.bestFor,
        product.collection,
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
  }, [category, family, intensity, mood, occasion, query]);

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
        <div className="result-count">
          <Filter size={16} />
          {filtered.length} de {products.length} referencias visibles
        </div>
      </div>

      {activeFilters.length ? (
        <div className="catalog-intent-bar">
          <div>
            <strong>Vista guiada activa</strong>
            <p>Estás viendo una selección filtrada. Puedes limpiar o afinar estos filtros cuando quieras.</p>
          </div>
          <div className="active-filter-list">
            {activeFilters.map((filter) => (
              <button key={filter.key} type="button" className="active-filter-chip" onClick={filter.clear}>
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

      <div className="filter-grid">
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
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>

      {!filtered.length ? (
        <div className="empty-state">
          <h3>No encontramos esa combinación.</h3>
          <p>Prueba una búsqueda más amplia o escribe por WhatsApp para que te digamos por dónde empezar.</p>
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
