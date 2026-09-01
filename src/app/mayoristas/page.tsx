import type { Metadata } from "next";
import { ArrowRight, BadgeDollarSign, PackageCheck, TrendingUp } from "lucide-react";
import { WholesaleBuilder } from "@/components/wholesale/WholesaleBuilder";
import { defaultOgImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Perfumes al por mayor en Colombia",
  description:
    "Compra perfumes al por mayor en Colombia desde 10 unidades mixtas. Calcula inversión, margen estimado y arma tu pedido mayorista con Empire Essence.",
  keywords: [
    "perfumes al por mayor en Colombia",
    "mayorista de perfumes Colombia",
    "revender perfumes",
    "proveedor de perfumes",
    "negocio de fragancias",
    "kits mayoristas de perfumes",
  ],
  alternates: {
    canonical: "/mayoristas",
  },
  openGraph: {
    title: "Perfumes al por mayor en Colombia | Empire Essence",
    description:
      "Ruta mayorista para emprendedores: kits, margen estimado y apoyo comercial para vender perfumes.",
    url: "/mayoristas",
    images: [defaultOgImage],
  },
};

export default function WholesalePage() {
  return (
    <main className="page-main">
      <section className="shell page-hero wholesale-hero">
        <div>
          <span className="eyebrow">Mayoristas y emprendedores</span>
          <h1>Perfumes al por mayor en Colombia para empezar con margen.</h1>
          <p>
            Pedido mínimo de 10 unidades mixtas, precios por volumen y ayuda para elegir referencias fáciles de mover
            desde el primer pedido.
          </p>
        </div>
        <div className="wholesale-proof">
          <span>
            <PackageCheck size={16} />
            10 unidades mínimo
          </span>
          <span>
            <TrendingUp size={16} />
            30% a 46% margen estimado
          </span>
          <span>
            <BadgeDollarSign size={16} />
            Checkout para kits fijos
          </span>
        </div>
        <div className="wholesale-hero-media" aria-hidden="true" />
      </section>

      <section className="shell">
        <WholesaleBuilder />
      </section>

      <section className="section shell b2b-steps">
        {[
          ["01", "Elige variedad", "Mezcla tamaños y fragancias top venta para probar demanda real."],
          ["02", "Calcula margen", "Visualiza inversión, precio sugerido y ganancia estimada antes de pagar."],
          ["03", "Compra o cotiza", "Cierra por checkout o por WhatsApp según el tipo de pedido."],
        ].map(([step, title, copy]) => (
          <article key={step} className="panel step-card">
            <span>{step}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <ArrowRight size={16} />
          </article>
        ))}
      </section>
    </main>
  );
}
