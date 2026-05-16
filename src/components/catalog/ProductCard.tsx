import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { categoryLabels } from "@/data/products";
import { formatCop } from "@/lib/currency";
import type { Product } from "@/types/product";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const price = product.variants[0]?.retailPriceCop ?? 0;

  return (
    <article className={`product-card ${compact ? "compact-card" : ""}`}>
      <Link href={`/producto/${product.slug}`} className="product-card-media" aria-label={`Ver ${product.publicName}`}>
        <Image src="/assets/empire-collection-lineup.png" alt="" fill sizes="(max-width: 720px) 100vw, 280px" />
      </Link>
      <div className="product-card-top">
        <span>{categoryLabels[product.category]}</span>
        {product.topSeller ? (
          <strong>
            <Flame size={13} />
            Top venta
          </strong>
        ) : null}
      </div>
      <Link href={`/producto/${product.slug}`} className="product-card-title">
        <h3>{product.publicName}</h3>
        <p>Inspirado en {product.inspirationReference}</p>
      </Link>
      <p className="product-description">{product.shortDescription}</p>
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
        <Link href={`/producto/${product.slug}`} className="ghost-link">
          Ver perfil <ArrowRight size={14} />
        </Link>
      ) : (
        <AddToCart product={product} />
      )}
    </article>
  );
}
