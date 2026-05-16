"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Filter, Search } from "lucide-react";
import { allFamilies, allMoods, allOccasions, categoryLabels, products } from "@/data/products";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Category, Intensity } from "@/types/product";

const categories: Array<Category | "all"> = ["all", "femenina", "masculina", "unisex"];
const intensities: Array<Intensity | "all"> = ["all", "suave", "media", "alta"];

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [family, setFamily] = useState("all");
  const [mood, setMood] = useState("all");
  const [occasion, setOccasion] = useState("all");
  const [intensity, setIntensity] = useState<Intensity | "all">("all");

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

  return (
    <section className="catalog-shell">
      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca por aroma, ocasion, inspiracion o mood"
          />
        </label>
        <div className="result-count">
          <Filter size={16} />
          {filtered.length} de {products.length} referencias visibles
        </div>
      </div>

      <div className="filter-grid">
        <FilterSelect label="Categoria" value={category} onChange={(value) => setCategory(value as Category | "all")}>
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
        <FilterSelect label="Ocasion" value={occasion} onChange={setOccasion}>
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
          <h3>No encontramos esa combinacion.</h3>
          <p>Prueba una busqueda mas amplia o abre Alex para una recomendacion guiada.</p>
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
