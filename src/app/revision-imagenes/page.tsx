import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Revision de imagenes | Empire Essence",
  description: "Previews locales de imagenes generadas para revisar antes de integrarlas al sitio.",
  robots: {
    index: false,
    follow: false,
  },
};

const reviewImages = [
  {
    title: "Home Hero",
    file: "/revision-images/empire-home-hero-v1.png",
    note: "Direccion premium para hero principal con espacio visual util para copy.",
  },
  {
    title: "Retail Lifestyle",
    file: "/revision-images/empire-retail-lifestyle-v1.png",
    note: "Imagen emocional para bloques de marca, campana o home femenina.",
  },
  {
    title: "Mayoristas",
    file: "/revision-images/empire-wholesale-editorial-v1.png",
    note: "Ruta visual para la propuesta de emprender o vender con Empire Essence.",
  },
  {
    title: "Blog Editorial",
    file: "/revision-images/empire-blog-editorial-v1.png",
    note: "Preview para heroes de blog y contenido educativo con mejor presencia.",
  },
  {
    title: "Catalogo Masculina",
    file: "/revision-images/empire-catalog-masculina-v1.png",
    note: "Visual editorial para cards, quick-buy y PDP masculinos.",
  },
  {
    title: "Catalogo Femenina",
    file: "/revision-images/empire-catalog-femenina-v1.png",
    note: "Visual premium para cards y PDP femeninos.",
  },
  {
    title: "Catalogo Unisex",
    file: "/revision-images/empire-catalog-unisex-v1.png",
    note: "Ruta mas sobria para productos unisex y nicho.",
  },
  {
    title: "Blog Atmosfera",
    file: "/revision-images/empire-blog-band-v2.png",
    note: "Fondo editorial para la banda de blog en home.",
  },
  {
    title: "Wholesale Banner V2",
    file: "/revision-images/empire-blog-wholesale-strip-v2.png",
    note: "Nuevo fondo para CTA mayorista dentro del blog.",
  },
];

export default function RevisionImagenesPage() {
  return (
    <main style={{ padding: "56px 0 96px" }}>
      <section className="shell" style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: 24,
            border: "1px solid rgba(247, 240, 230, 0.12)",
            background: "rgba(255, 255, 255, 0.03)",
          }}
        >
          <span style={{ color: "rgba(227, 200, 145, 0.9)", fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            Revision local
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 0.95 }}>
            Previews de imagenes para Empire Essence
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: "rgba(247, 240, 230, 0.78)" }}>
            Esta ruta existe solo para revisar el nuevo banco visual antes de reemplazar assets del sitio o publicar cambios.
          </p>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          {reviewImages.map((image) => (
            <article
              key={image.file}
              style={{
                display: "grid",
                gap: 14,
                padding: 18,
                border: "1px solid rgba(247, 240, 230, 0.12)",
                background: "rgba(255, 255, 255, 0.03)",
                boxShadow: "0 22px 80px rgba(0, 0, 0, 0.18)",
              }}
            >
              <div style={{ display: "grid", gap: 6 }}>
                <h2 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "2rem" }}>{image.title}</h2>
                <p style={{ margin: 0, color: "rgba(247, 240, 230, 0.76)" }}>{image.note}</p>
                <code style={{ color: "rgba(227, 200, 145, 0.9)", fontSize: 13 }}>{image.file}</code>
              </div>
              <div style={{ position: "relative", overflow: "hidden", border: "1px solid rgba(247, 240, 230, 0.12)" }}>
                <Image
                  src={image.file}
                  alt={image.title}
                  width={1536}
                  height={1024}
                  priority
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
