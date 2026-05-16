import { ArrowRight, BadgeDollarSign, PackageCheck, TrendingUp } from "lucide-react";
import { WholesaleBuilder } from "@/components/wholesale/WholesaleBuilder";

export default function WholesalePage() {
  return (
    <main className="page-main">
      <section className="shell page-hero wholesale-hero">
        <div>
          <span className="eyebrow">Mayoristas y emprendedores</span>
          <h1>Empieza a vender perfumes con margen.</h1>
          <p>
            Pedido minimo de 10 unidades mixtas, precios por volumen y asesoria para elegir referencias faciles de
            recomendar.
          </p>
        </div>
        <div className="wholesale-proof">
          <span>
            <PackageCheck size={16} />
            10 unidades minimo
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
          ["01", "Elige variedad", "Mezcla tamanos y fragancias top venta para probar demanda real."],
          ["02", "Calcula margen", "Visualiza inversion, precio sugerido y ganancia estimada antes de comprar."],
          ["03", "Compra o cotiza", "Paga kits fijos en checkout. Insumos y volumen avanzado pasan a asesoria."],
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
