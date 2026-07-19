import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categoryLabels } from "@/data/products";
import { formatCop } from "@/lib/currency";
import { SHIPPING } from "@/lib/pricing";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getProductVisual } from "@/lib/product-visuals";
import { createBreadcrumbJsonLd, createProductJsonLd, defaultOgImage } from "@/lib/seo";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Empire Essence",
    };
  }

  return {
    title: product.publicName,
    description:
      `${product.shortDescription} Perfume inspirado en ${product.inspirationReference} con ${product.concentration}, ${product.duration} y compra directa o por WhatsApp en Colombia.`,
    alternates: {
      canonical: `/producto/${product.slug}`,
    },
    openGraph: {
      title: `${product.publicName} | Perfume inspirado Empire Essence`,
      description:
        `${product.shortDescription} Inspirado en ${product.inspirationReference}. Compra online o recibe asesoria por WhatsApp.`,
      url: `/producto/${product.slug}`,
      type: "website",
      images: [defaultOgImage],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);
  const productJsonLd = createProductJsonLd(product);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Catalogo", path: "/catalogo" },
    { name: product.publicName, path: `/producto/${product.slug}` },
  ]);

  return (
    <main className="page-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="shell product-layout">
        <div className="product-story panel">
          <Link href="/catalogo" className="ghost-link back-link">
            <ArrowLeft size={16} />
            Volver al catalogo
          </Link>
          <div className="product-visual">
            <Image
              src={getProductVisual(product.category)}
              alt={`Fragancia ${product.publicName}`}
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <span className="eyebrow">{categoryLabels[product.category]} - {product.collection}</span>
          <h1>{product.publicName}</h1>
          <p className="inspired">Inspirado en {product.inspirationReference}</p>
          <p className="lead">{product.longDescription}</p>
          <p className="lead">
            Para {categoryLabels[product.category].toLowerCase()} que buscan un perfil ideal para {product.occasions.join(
              ", ",
            )}.
          </p>

          <div className="product-proof-row">
            <span>
              <BadgeCheck size={16} />
              {product.concentration}
            </span>
            <span>{product.duration}</span>
            <span>Intensidad {product.intensity}</span>
            <span>{product.sillage}</span>
          </div>

          <div className="product-decision-strip">
            <span>Se siente {product.moods.slice(0, 2).join(" y ")}</span>
            <span>Disponible en {product.variants.map((variant) => `${variant.sizeMl} ml`).join(", ")}</span>
          </div>

          <div className="notes-grid">
            <NoteBlock label="Salida" notes={product.notes.top} />
            <NoteBlock label="Corazon" notes={product.notes.heart} />
            <NoteBlock label="Fondo" notes={product.notes.base} />
          </div>

          <div className="tag-row large">
            {product.moods.map((mood) => (
              <span key={mood}>{mood}</span>
            ))}
          </div>
        </div>

        <aside className="product-buy panel">
          <span className="eyebrow">Compra directa</span>
          <h2>{product.shortDescription}</h2>
          <p>{product.bestFor}</p>
          <div className="decision-summary">
            <div>
              <span>Inspiracion</span>
              <strong>{product.inspirationReference}</strong>
            </div>
            <div>
              <span>Para usar en</span>
              <strong>{product.occasions.join(", ")}</strong>
            </div>
            <div>
              <span>Se siente</span>
              <strong>{product.moods.slice(0, 3).join(", ")}</strong>
            </div>
          </div>
          <div className="buy-panel-trust">
            <span>Entrega estimada 3 a 5 dias habiles en Colombia</span>
            <span>Checkout directo o cierre asistido por WhatsApp</span>
          </div>
          <div className="confidence-points">
            <article>
              <ShieldCheck size={16} />
              <div>
                <strong>Compra con respaldo</strong>
                <p>Confirma por checkout o por WhatsApp si quieres ayuda antes de pagar.</p>
              </div>
            </article>
            <article>
              <MapPin size={16} />
              <div>
                <strong>Envio claro</strong>
                <p>
                  Bogota desde {formatCop(SHIPPING.bogotaCop)} y resto del pais desde {formatCop(SHIPPING.nationalCop)}.
                </p>
              </div>
            </article>
          </div>
          <AddToCart product={product} showDirectWhatsapp />
          <div className="price-hint">Desde {formatCop(product.variants[0].retailPriceCop)} - envio gratis desde {formatCop(SHIPPING.freeThresholdCop)}</div>
          <div className="buyer-confidence">
            <strong>Antes de pagar, revisa esto:</strong>
            <ul>
              <li>Huele en la linea de {product.inspirationReference} y tiene {product.concentration}.</li>
              <li>Duracion estimada de {product.duration.toLowerCase()} e intensidad {product.intensity}.</li>
              <li>30 ml para probar, 50 ml para uso frecuente, 100 ml si ya sabes que es para ti.</li>
              <li>Entrega nacional estimada de 3 a 5 dias habiles.</li>
              <li>Si dudas entre tamanos, perfil o total final, Alex te responde por WhatsApp antes de cerrar.</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Tambien puede gustarte</span>
            <h2>Perfiles cercanos a esta eleccion.</h2>
          </div>
          <a href="#alex" className="ghost-link">
            Pedir guia a Alex <Sparkles size={16} />
          </a>
        </div>
        <div className="product-grid">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} compact />
          ))}
        </div>
      </section>
    </main>
  );
}

function NoteBlock({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="note-block">
      <span>{label}</span>
      <p>{notes.join(" - ")}</p>
    </div>
  );
}
