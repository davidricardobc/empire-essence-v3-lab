import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Droplet, MessageCircle, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { ProductCard } from "@/components/catalog/ProductCard";
import { HomeQuickBuy } from "@/components/home/HomeQuickBuy";
import { getFeaturedBlogPosts } from "@/data/blog";
import { getTopSellers } from "@/lib/products";
import { formatCop } from "@/lib/currency";

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
            <span className="hero-kicker">Perfumes que inspiran, esencia que perdura.</span>
            <h1>
              Tu esencia.
              <br />
              Tu imperio.
            </h1>
            <p>Fragancias inspiradas con 60% de concentracion. Lujo accesible. Calidad que se siente.</p>
            <div className="hero-actions">
              <Link href="/catalogo" className="primary-button">
                Comprar ahora
                <ArrowRight size={18} />
              </Link>
              <a href="#finder" className="secondary-button">
                Encontrar mi fragancia
                <Sparkles size={18} />
              </a>
            </div>
          </div>

          <HomeQuickBuy products={heroProducts} />
        </div>
        <div className="shell concept-trust-row">
          <div>
            <Droplet size={30} />
            <strong>60%</strong>
            <span>Concentracion</span>
            <small>Mayor duracion y proyeccion.</small>
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
            <small>Checkout directo con respaldo humano.</small>
          </div>
        </div>
      </section>

      <section id="finder" className="collection-story">
        <div className="shell collection-story-grid">
          <div className="collection-copy">
            <span className="eyebrow">Explora nuestro mundo</span>
            <h2>Colecciones que cuentan tu historia</h2>
            <p>Descubre aromas creados para cada version de ti.</p>
            <Link href="/catalogo" className="dark-button">
              Ver coleccion completa
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="collection-lineup">
            <Image
              src="/assets/empire-collection-lineup.png"
              alt="Linea de fragancias Empire Essence"
              width={900}
              height={506}
            />
          </div>
          <div className="wholesale-teaser-card">
            <Image
              src="/assets/empire-wholesale-banner.png"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 44vw"
            />
            <div>
              <span className="eyebrow">Oportunidad mayorista</span>
              <h2>Emprende con Empire Essence</h2>
              <p>Unete a nuestra red de emprendedores y construye tu propio imperio.</p>
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
            <h2>La compra empieza con una pregunta simple: que quieres provocar.</h2>
          </div>
          <p>Primero ordenamos deseo, ocasion e intensidad; despues abrimos el catalogo completo.</p>
        </div>
        <div className="intent-grid">
          {[
            ["Poder femenino", "Dulces, florales intensas y memorables.", "/catalogo?mood=poder"],
            ["Fresco diario", "Limpias, versatiles y faciles de repetir.", "/catalogo?family=fresca"],
            ["Noche sensual", "Estela mas intensa para citas y eventos.", "/catalogo?occasion=noche"],
            ["Regalo seguro", "Perfiles top venta con baja friccion.", "/catalogo?mood=elegancia"],
          ].map(([title, copy, href]) => (
            <Link href={href} key={title} className="intent-card">
              <strong>{title}</strong>
              <span>{copy}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section blog-home-band">
        <div className="shell section-heading split">
          <div>
            <span className="eyebrow">Guias para elegir</span>
            <h2>Compra y vende perfumes con mas seguridad.</h2>
          </div>
          <p>
            Aprende a elegir por duracion, ocasion, regalo o pedido mayorista antes de cerrar tu compra.
          </p>
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
            <h2>Referencias de salida rapida para comprar o revender.</h2>
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
