import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { categoryLabels } from "@/data/products";
import { getCommercialPriorityLabel } from "@/lib/commercial-priority";
import { formatCop } from "@/lib/currency";
import { getProductVisual } from "@/lib/product-visuals";
import type { Product } from "@/types/product";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const price = product.variants[0]?.retailPriceCop ?? 0;
  const sizesLabel = product.variants.map((variant) => `${variant.sizeMl} ml`).join(" / ");
  const priorityLabel = getCommercialPriorityLabel(product);

  return (
    <article className={`product-card ${compact ? "compact-card" : ""}`}>
      <Link href={`/producto/${product.slug}`} className="product-card-media" aria-label={`Ver ${product.publicName}`}>
        <Image src={getProductVisual(product.category)} alt="" fill sizes="(max-width: 720px) 100vw, 280px" />
      </Link>
      <div className="product-card-top">
        <span>{categoryLabels[product.category]}</span>
        {priorityLabel ? (
          <strong>
            <Flame size={13} />
            {priorityLabel}
          </strong>
        ) : null}
      </div>
      <Link href={`/producto/${product.slug}`} className="product-card-title">
        <h3>{product.publicName}</h3>
        <p>Inspirado en {product.inspirationReference}</p>
      </Link>
      <p className="product-description">{product.shortDescription}</p>
      <div className="product-card-proof">
        <span>{sizesLabel}</span>
        <span>{product.moods.slice(0, 2).join(" · ")}</span>
      </div>
      <div className="tag-row">
        {product.families.slice(0, 3).map((family) => (
          <span key={family}>{family}</span>
        ))}
      </div>
      <div className="product-meta">
        <span>Desde</span>
        <strong>{formatCop(price)}</strong>
      </div>
      {compact ? (
        <div className="product-card-actions">
          <AddToCart product={product} compact />
          <Link href={`/producto/${product.slug}`} className="ghost-link">
            Ver detalles <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <AddToCart product={product} />
      )}
    </article>
  );
}
