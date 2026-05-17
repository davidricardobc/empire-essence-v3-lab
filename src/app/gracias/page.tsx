import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrder } from "@/lib/order-store";

export default async function ThanksPage({ searchParams }: { searchParams?: Promise<{ ref?: string }> }) {
  const params = (await searchParams) ?? {};
  const order = params.ref ? await getOrder(params.ref) : null;
  const statusLabel =
    order?.paymentStatus === "paid"
      ? "Pago confirmado"
      : order?.paymentStatus === "failed"
        ? "Pago no confirmado"
        : "Validando pago";

  return (
    <main className="page-main thanks-page">
      <section className="shell panel thanks-card">
        <CheckCircle2 size={42} />
        <span className="eyebrow">Pedido recibido</span>
        <h1>Gracias por elegir Empire Essence.</h1>
        {params.ref ? <p><strong>{statusLabel}</strong></p> : null}
        <p>
          {params.ref
            ? `Referencia ${params.ref}. ${order?.paymentStatus === "paid" ? "Tu pago ya aparece como confirmado." : "Si tu pago fue por Wompi, estamos validando la confirmacion."}`
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
