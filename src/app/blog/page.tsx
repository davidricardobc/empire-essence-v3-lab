import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, MessageCircle, Store } from "lucide-react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPosts, getFeaturedBlogPosts, getPublishedBlogPosts } from "@/data/blog";
import { defaultOgImage } from "@/lib/seo";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Blog de perfumes y ventas",
  description:
    "Guías para elegir perfumes, comprar con más seguridad y empezar a vender como mayorista con criterios claros y accionables.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog de perfumes y ventas | Empire Essence",
    description:
      "Consejos para comprar mejor, vender con margen y entender perfumes sin enredarte.",
    url: "/blog",
    images: [defaultOgImage],
  },
};

const featuredPosts = getFeaturedBlogPosts(1);
const posts = getBlogPosts();
const publishedPosts = getPublishedBlogPosts();
const publishedSlugs = new Set(publishedPosts.map((post) => post.slug));

export default function BlogPage() {
  const featured = featuredPosts[0] ?? posts[0];

  return (
    <main className="page-main blog-page">
      <section className="shell blog-hero">
        <div>
          <span className="eyebrow">Guías Empire Essence</span>
          <h1>Blog de perfumes: elige mejor y vende con mas seguridad.</h1>
          <p>
            Consejos cortos para comprar tu fragancia, elegir mejor un regalo o armar un primer pedido mayorista.
          </p>
          <div className="blog-hero-actions">
            <Link href="/catalogo" className="primary-button">
              Comprar ahora
              <ArrowRight size={16} />
            </Link>
            <a
              href={buildWhatsappUrl("Hola Alexa. Lei el blog y quiero que me recomiendes una fragancia para comprar.")}
              className="secondary-button"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} />
              Preguntar a Alexa
            </a>
          </div>
        </div>
        <aside className="blog-proof-panel">
          <span>
            <CreditCard size={17} />
            Compra directa cuando ya sabes que llevar
          </span>
          <span>
            <BadgeCheck size={17} />
            Recomendaciones por ocasión, estilo y precio inteligente
          </span>
          <span>
            <MessageCircle size={17} />
            Asesoría por WhatsApp antes de cerrar tu pedido
          </span>
          <span>
            <Store size={17} />
            Guías para empezar como mayorista desde 10 unidades mixtas
          </span>
        </aside>
      </section>

      <section className="shell blog-featured-section">
        <BlogPostCard post={featured} featured />
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Mayoristas</span>
            <h2>Guías para comprar mejor al por mayor.</h2>
          </div>
          <p>Aprende a elegir proveedor, cuidar tu margen y armar un surtido fácil de recomendar.</p>
        </div>
        <div className="blog-grid">
          {publishedPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="shell blog-wholesale-strip">
        <div>
          <span className="eyebrow">Mayoristas</span>
          <h2>Empieza con un pedido mixto de 10 unidades.</h2>
          <p>
            Mezcla referencias masculinas, femeninas, de diario y de noche. Valida que se mueve primero y repone con mas
            seguridad.
          </p>
        </div>
        <div className="blog-wholesale-actions">
          <Link href="/mayoristas" className="primary-button">
            Ver ruta mayorista
            <ArrowRight size={16} />
          </Link>
          <a
            href={buildWhatsappUrl("Hola Alexa. Vengo del blog y quiero armar un pedido mayorista de perfumes.")}
            className="secondary-button"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
            Hablar de mi kit
          </a>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Comprar mejor</span>
            <h2>Mas guias para elegir sin enredarte.</h2>
          </div>
          <p>Duracion, regalo, estilos y recomendaciones para decidir rapido.</p>
        </div>
        <div className="blog-grid">
          {posts
            .filter((post) => !publishedSlugs.has(post.slug))
            .map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
        </div>
      </section>
    </main>
  );
}
