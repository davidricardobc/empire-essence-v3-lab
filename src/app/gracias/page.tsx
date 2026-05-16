import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function ThanksPage({ searchParams }: { searchParams?: Promise<{ ref?: string }> }) {
  const params = (await searchParams) ?? {};

  return (
    <main className="page-main thanks-page">
      <section className="shell panel thanks-card">
        <CheckCircle2 size={42} />
        <span className="eyebrow">Pedido recibido</span>
        <h1>Gracias por elegir Empire Essence.</h1>
        <p>
          {params.ref
            ? `Referencia ${params.ref}. Si tu pago fue por Wompi, estamos validando la confirmacion.`
            : "Tu pedido quedo registrado para seguimiento."}
        </p>
        <div className="hero-actions">
          <Link href="/catalogo" className="primary-button">
            Seguir comprando
          </Link>
          <Link href="/mayoristas" className="secondary-button">
            Ver mayoristas
          </Link>
        </div>
      </section>
    </main>
  );
}
