import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, CreditCard, Store } from "lucide-react";
import { formatCop } from "@/lib/currency";
import { getProductBySlug } from "@/lib/products";
import { getWholesaleUnitPrice, WHOLESALE_MIN_UNITS } from "@/lib/pricing";
import type { BlogPost } from "@/types/blog";

export function BlogPostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const firstProduct = getProductBySlug(post.productSlugs[0]);
  const firstVariant = firstProduct?.variants[0];
  const isWholesale = post.audience === "mayorista";
  const displayPrice =
    firstVariant && isWholesale
      ? getWholesaleUnitPrice(firstVariant.sizeMl, WHOLESALE_MIN_UNITS)
      : firstVariant?.retailPriceCop;

  return (
    <article className={`blog-card ${featured ? "is-featured" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="blog-card-media" aria-label={`Leer ${post.title}`}>
        <Image src={post.heroImage} alt="" fill sizes={featured ? "50vw" : "(max-width: 720px) 100vw, 360px"} />
      </Link>
      <div className="blog-card-body">
        <div className="blog-meta">
          <span>{post.category}</span>
          <span>
            <Clock size={14} />
            {post.readingMinutes} min
          </span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3>{post.title}</h3>
        </Link>
        <p>{post.excerpt}</p>
        {firstProduct && displayPrice ? (
          <div className="blog-commerce-hint">
            <CreditCard size={15} />
            <span>
              {isWholesale ? "Kit sugerido" : "Compra sugerida"}: {firstProduct.publicName} desde{" "}
              {formatCop(displayPrice)}
            </span>
          </div>
        ) : null}
        {post.audience === "mayorista" && post.wholesaleSignal ? (
          <div className="blog-commerce-hint is-wholesale">
            <Store size={15} />
            <span>{post.wholesaleCtaLabel ?? "Pedido mayorista disponible"} desde 10 unidades mixtas</span>
          </div>
        ) : null}
        <Link href={`/blog/${post.slug}`} className="ghost-link">
          Leer y decidir <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
