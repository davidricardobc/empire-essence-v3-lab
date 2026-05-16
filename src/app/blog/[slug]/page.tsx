import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, MessageCircle, Store } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPostBySlug, getBlogPosts, getRelatedBlogPosts } from "@/data/blog";
import { formatCop } from "@/lib/currency";
import { getProductBySlug } from "@/lib/products";
import { getWholesaleUnitPrice, WHOLESALE_MIN_UNITS } from "@/lib/pricing";
import { createBlogPostingJsonLd, createBreadcrumbJsonLd } from "@/lib/seo";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      images: [post.heroImage],
    },
  };
}

const articleDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const isWholesale = post.audience === "mayorista";
  const recommendedProducts = post.productSlugs.map(getProductBySlug).filter((product): product is Product =>
    Boolean(product),
  );
  const related = getRelatedBlogPosts(post.slug);
  const publishedAt = articleDateFormatter.format(new Date(post.publishedAt));
  const articleJsonLd = createBlogPostingJsonLd(post);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <main className="page-main blog-post-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="shell blog-post-hero">
        <Link href="/blog" className="ghost-link back-link">
          <ArrowLeft size={16} />
          Volver al blog
        </Link>
        <div className="blog-post-title">
          <span className="eyebrow">{post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.subtitle}</p>
          <div className="blog-meta">
            <span>{isWholesale ? "Guia mayorista" : "Guia de compra"}</span>
            <span>
              <Clock size={14} />
              {post.readingMinutes} min
            </span>
            <span>{publishedAt}</span>
          </div>
        </div>
        <div className="blog-post-image">
          <Image src={post.heroImage} alt="" fill priority sizes="100vw" />
        </div>
      </section>

      <section className="shell blog-post-layout">
        <article className="blog-article">
          <section>
            <h2>{isWholesale ? "Que vas a resolver en esta guia" : "Como te ayuda esta guia a elegir perfume"}</h2>
            <p>{post.excerpt}</p>
          </section>
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          {post.wholesaleSignal ? (
            <div className="blog-wholesale-callout">
              <span className="eyebrow">Para mayoristas</span>
              <h2>Arma un pedido con variedad y margen claro.</h2>
              <p>{post.wholesaleSignal}</p>
              <div className="hero-actions">
                <Link href="/mayoristas" className="primary-button">
                  {post.wholesaleCtaLabel ?? "Armar kit mayorista"}
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={buildWhatsappUrl(`Hola Alex. Lei "${post.title}" y quiero armar un pedido mayorista.`)}
                  className="secondary-button"
                  target="_blank"
                >
                  <MessageCircle size={16} />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          ) : null}
          <div className="blog-inline-cta">
            <span className="eyebrow">Siguiente paso</span>
            <h2>{isWholesale ? "Pasa de la guia a tu primer kit." : "Elige con seguridad y compra cuando estes listo."}</h2>
            <p>
              {isWholesale
                ? "Puedes revisar precios mayoristas, armar un pedido mixto o pedir una recomendacion por WhatsApp."
                : "Agrega una recomendacion al carrito o escribe por WhatsApp si quieres confirmarla con Alex."}
            </p>
            <div className="hero-actions">
              <Link href={isWholesale ? "/mayoristas" : "/catalogo"} className="primary-button">
                {isWholesale ? "Ver precios mayoristas" : "Ver catalogo"}
                <ArrowRight size={16} />
              </Link>
              <a
                href={buildWhatsappUrl(`Hola Alex. Lei "${post.title}" y quiero comprar una fragancia.`)}
                className="secondary-button"
                target="_blank"
              >
                <MessageCircle size={16} />
                Pedir ayuda
              </a>
            </div>
          </div>
        </article>

        <aside className="blog-buy-panel">
          <span className="eyebrow">{isWholesale ? "Kit recomendado" : "Compra recomendada"}</span>
          <h2>{post.ctaLabel}</h2>
          {isWholesale ? (
            <div className="blog-panel-note">
              <Store size={16} />
              <span>
                Pedido mayorista minimo de {WHOLESALE_MIN_UNITS} unidades mixtas. Envio nacional de 3 a 5 dias habiles.
              </span>
            </div>
          ) : null}
          <div className="blog-buy-list">
            {recommendedProducts.map((product) => {
              const firstVariant = product.variants[0];
              const displayPrice = isWholesale
                ? getWholesaleUnitPrice(firstVariant.sizeMl, WHOLESALE_MIN_UNITS)
                : firstVariant.retailPriceCop;

              return (
                <div key={product.id} className="blog-buy-item">
                  <div>
                    <strong>{product.publicName}</strong>
                    <span>
                      {isWholesale ? "Mayorista desde " : "Desde "}
                      {formatCop(displayPrice)}
                    </span>
                  </div>
                  <AddToCart product={product} channel={isWholesale ? "wholesale" : "retail"} />
                </div>
              );
            })}
          </div>
          <a
            href={buildWhatsappUrl(`Hola Alex. Quiero que me ayudes con las recomendaciones del articulo: ${post.title}.`)}
            className="ghost-button full"
            target="_blank"
          >
            Confirmar por WhatsApp
          </a>
          {isWholesale ? (
            <Link href="/mayoristas" className="secondary-button full">
              Ver precios mayoristas
            </Link>
          ) : null}
        </aside>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Seguir leyendo</span>
            <h2>Mas guias para decidir rapido.</h2>
          </div>
        </div>
        <div className="blog-grid">
          {related.map((item) => (
            <BlogPostCard key={item.slug} post={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
