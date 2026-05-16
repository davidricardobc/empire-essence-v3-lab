import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categoryLabels } from "@/data/products";
import { formatCop } from "@/lib/currency";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { buildWhatsappUrl } from "@/lib/whatsapp";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);

  return (
    <main className="page-main">
      <section className="shell product-layout">
        <div className="product-story panel">
          <Link href="/catalogo" className="ghost-link back-link">
            <ArrowLeft size={16} />
            Volver al catalogo
          </Link>
          <div className="product-visual">
            <Image
              src="/assets/empire-collection-lineup.png"
              alt={`Fragancia ${product.publicName}`}
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
          </div>
          <span className="eyebrow">{categoryLabels[product.category]} - {product.collection}</span>
          <h1>{product.publicName}</h1>
          <p className="inspired">Inspirado en {product.inspirationReference}</p>
          <p className="lead">{product.longDescription}</p>

          <div className="product-proof-row">
            <span>
              <BadgeCheck size={16} />
              {product.concentration}
            </span>
            <span>{product.duration}</span>
            <span>Intensidad {product.intensity}</span>
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
          <AddToCart product={product} />
          <div className="price-hint">
            Desde {formatCop(product.variants[0].retailPriceCop)} - envio gratis desde {formatCop(140000)}
          </div>
          <a
            className="secondary-button full"
            href={buildWhatsappUrl(`Hola Alex. Quiero asesoria sobre ${product.publicName}.`)}
            target="_blank"
          >
            <MessageCircle size={18} />
            Preguntar antes de comprar
          </a>
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
