import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Droplet,
  Instagram,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Truck,
  Youtube,
} from "lucide-react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { HomeQuickBuy } from "@/components/home/HomeQuickBuy";
import { getFeaturedBlogPosts } from "@/data/blog";
import { getTopSellers } from "@/lib/products";
import { formatCop } from "@/lib/currency";
import { defaultOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Perfumes inspirados en Colombia",
  description:
    "Compra perfumes inspirados para mujer, hombre y unisex con alta concentracion, top ventas, asesoria por WhatsApp y opcion mayorista desde Colombia.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Perfumes inspirados en Colombia | Empire Essence",
    description:
      "Fragancias premium inspiradas con compra directa, catalogo curado y asesoria por WhatsApp para retail y mayoristas.",
    url: "/",
    images: [defaultOgImage],
  },
};

const topSellers = getTopSellers(6);
const heroProducts = topSellers.slice(0, 3);
const featuredPosts = getFeaturedBlogPosts(3);

export default function HomePage() {
  return (
    <main>
      <section className="concept-hero">
        <div className="concept-hero-photo" aria-hidden="true" />
        <div className="concept-hero-shade" aria-hidden="true" />
        <div className="shell concept-hero-stage">
          <div className="concept-hero-copy">
            <span className="hero-kicker">Perfumeria inspirada</span>
            <h1>
              Tu esencia.
              <br />
              Tu imperio.
            </h1>
            <p>
              Perfumes inspirados que se sienten premium y se compran facil. Elige por estilo, recibe asesoria real y
              compra en minutos desde Colombia.
            </p>
            <div className="hero-actions">
              <Link href="/catalogo" className="primary-button">
                Comprar ahora
                <ArrowRight size={18} />
              </Link>
              <a href="#finder" className="secondary-button">
                Encontrar mi aroma
                <Sparkles size={18} />
              </a>
            </div>
            <div className="hero-proof-pills" aria-label="Beneficios de compra">
              <span>Entrega nacional 3 a 5 dias</span>
              <span>Pago seguro</span>
              <span>Ayuda por WhatsApp</span>
            </div>
            <small className="hero-support-copy">Si compras para regalo o primera vez, te guiamos por mood y presupuesto.</small>
          </div>

          <HomeQuickBuy products={heroProducts} />
        </div>
        <div className="shell concept-trust-row">
          <div>
            <Droplet size={30} />
            <strong>60%</strong>
            <span>Concentracion</span>
            <small>Presencia clara sin leer fichas eternas.</small>
          </div>
          <div>
            <Truck size={30} />
            <strong>Envio nacional</strong>
            <span>Colombia</span>
            <small>Entrega estimada 3 a 5 dias habiles.</small>
          </div>
          <div>
            <ShieldCheck size={30} />
            <strong>Pago seguro</strong>
            <span>Wompi + WhatsApp</span>
            <small>Carrito directo o cierre guiado por WhatsApp.</small>
          </div>
        </div>
      </section>

      <section id="finder" className="collection-story">
        <div className="shell collection-story-grid">
          <div className="collection-copy">
            <span className="eyebrow">Explora nuestro mundo</span>
            <h2>Aromas para cada version de ti</h2>
            <p>Compra por estilo, momento de uso o nivel de intensidad sin perder tiempo entre opciones.</p>
            <Link href="/catalogo" className="dark-button">
              Ver coleccion
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="collection-lineup">
            <Image
              src="/revision-images/empire-retail-lifestyle-v1.png"
              alt="Editorial retail de Empire Essence"
              width={900}
              height={506}
            />
          </div>
          <div className="wholesale-teaser-card">
            <Image
              src="/revision-images/empire-wholesale-editorial-v1.png"
              alt="Escena editorial mayorista de Empire Essence"
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <div>
              <span className="eyebrow">Oportunidad mayorista</span>
              <h2>Emprende con Empire Essence</h2>
              <p>Empieza con 10 unidades mixtas, referencias top ventas y surtido facil de mover.</p>
              <Link href="/mayoristas" className="primary-button">
                Quiero ser mayorista
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Claridad para elegir</span>
            <h2>Que quieres provocar?</h2>
          </div>
          <p>Encuentra rapido para quien es y como se siente antes de abrir todo el catalogo.</p>
        </div>
        <div className="intent-grid">
          {[
            ["Poder femenino", "Dulce, floral, memorable.", "/catalogo?mood=poder"],
            ["Fresco diario", "Limpio y facil de repetir.", "/catalogo?family=fresca"],
            ["Noche sensual", "Mas estela para salir.", "/catalogo?occasion=noche"],
            ["Regalo seguro", "Top ventas faciles de regalar.", "/catalogo?mood=elegancia"],
          ].map(([title, copy, href]) => (
            <Link href={href} key={title} className="intent-card">
              <strong>{title}</strong>
              <span>{copy}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Compra con mas criterio</span>
            <h2>Elige sin adivinar.</h2>
          </div>
          <p>Ve inspiracion, intensidad, tamanos y apoyo por WhatsApp antes de pagar para cerrar tu compra con mas calma.</p>
        </div>
        <div className="decision-grid">
          <article className="decision-card">
            <BadgeCheck size={18} />
            <strong>Para quien funciona</strong>
            <p>Ubica rapido si va contigo, para regalo o para vender.</p>
          </article>
          <article className="decision-card">
            <Clock3 size={18} />
            <strong>Tamano mas facil</strong>
            <p>30 ml para probar, 50 ml para diario, 100 ml para repetir.</p>
          </article>
          <article className="decision-card">
            <MessageCircle size={18} />
            <strong>Compra con confianza</strong>
            <p>Pago seguro, envio nacional y ayuda real si dudas.</p>
          </article>
        </div>
      </section>

      <section className="section shell">
        <div className="brand-proof-band">
          <div className="brand-proof-copy">
            <span className="eyebrow">Marca con rostro real</span>
            <h2>Contenido real para elegir con mas confianza.</h2>
            <p>
              Mira recomendaciones, ideas de uso y referencias destacadas en nuestros canales oficiales.
            </p>
          </div>
          <div className="brand-proof-links">
            <a
              href="https://www.youtube.com/@EmpireEssencePerfumeria"
              target="_blank"
              rel="noreferrer"
              className="brand-proof-card"
            >
              <Youtube size={18} />
              <strong>YouTube oficial</strong>
              <span>@EmpireEssencePerfumeria</span>
            </a>
            <a
              href="https://www.instagram.com/EmpireEssence.co"
              target="_blank"
              rel="noreferrer"
              className="brand-proof-card"
            >
              <Instagram size={18} />
              <strong>Instagram oficial</strong>
              <span>@EmpireEssence.co</span>
            </a>
          </div>
        </div>
      </section>

      <section className="section blog-home-band">
        <div className="shell section-heading split">
          <div>
            <span className="eyebrow">Guias para elegir</span>
            <h2>Compra y vende perfumes con mas seguridad.</h2>
          </div>
          <p>Lee solo lo necesario para elegir mejor, regalar bien o armar tu primer pedido mayorista.</p>
        </div>
        <div className="shell blog-grid">
          {featuredPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="shell blog-home-action">
          <Link href="/blog" className="primary-button">
            Ver blog completo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section shell">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Top ventas</span>
            <h2>Referencias favoritas para comprar o revender.</h2>
          </div>
          <Link href="/catalogo" className="ghost-link">
            Ver catalogo completo <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid featured-grid">
          {topSellers.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>

      <section className="section wholesale-band">
        <div className="shell wholesale-home-grid">
          <div>
            <span className="eyebrow">Mayoristas y emprendedores</span>
            <h2>Variedad, margen y rotacion para empezar con 10 unidades.</h2>
            <p>
              Calcula inversion, ganancia estimada y arma un pedido mixto con referencias faciles de recomendar.
              Insumos por gramo o litro se cotizan con asistencia.
            </p>
            <div className="hero-actions">
              <Link href="/mayoristas" className="primary-button">
                Armar kit mayorista
              </Link>
              <a
                href="https://wa.me/573156753404?text=Hola%20Empire%20Essence.%20Quiero%20cotizar%20insumos%20por%20volumen."
                className="secondary-button"
                target="_blank"
              >
                <MessageCircle size={18} />
                Cotizar insumos
              </a>
            </div>
          </div>
          <div className="margin-card">
            <span>Ejemplo 20 unidades 50ml</span>
            <strong>{formatCop(580000)}</strong>
            <p>Precio mayorista unitario {formatCop(29000)}. Precio sugerido retail {formatCop(46000)}.</p>
            <small>Ganancia estimada antes de envio: {formatCop(340000)}</small>
          </div>
        </div>
      </section>

      <section className="section shell proof-section">
        <div className="proof-card">
          <span className="eyebrow">Compra con confianza</span>
          <h2>Todo queda claro antes de pagar.</h2>
          <p>
            Elige por estilo, revisa precios, habla con Alex si tienes dudas y cierra tu pedido por checkout o WhatsApp.
          </p>
        </div>
        <div className="proof-grid">
          <div>Checkout directo con Wompi o respaldo por WhatsApp.</div>
          <div>Alex recomienda por ocasion, intensidad y presupuesto.</div>
          <div>Catalogo curado para decidir rapido.</div>
          <div>Mayoristas compran perfumes fijos y cotizan insumos por volumen.</div>
        </div>
      </section>
    </main>
  );
}
