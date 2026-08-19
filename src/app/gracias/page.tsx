import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrder, updateOrderPayment } from "@/lib/order-store";
import { notifyOrder } from "@/lib/order-notifications";
import { getLatestWompiTransaction, mapWompiTransactionStatus } from "@/lib/wompi";

export default async function ThanksPage({ searchParams }: { searchParams?: Promise<{ ref?: string }> }) {
  const params = (await searchParams) ?? {};
  let order = params.ref ? await getOrder(params.ref) : null;

  if (params.ref && order && order.paymentProvider === "wompi" && order.paymentStatus !== "paid") {
    const transaction = await getLatestWompiTransaction(params.ref);

    if (transaction?.amount_in_cents === order.totalCop * 100) {
      const mapped = mapWompiTransactionStatus(transaction.status ?? "PENDING");
      const updatedOrder = await updateOrderPayment(params.ref, {
        ...mapped,
        wompiTransactionId: transaction.id ?? null,
        wompiStatus: transaction.status ?? "PENDING",
      });

      if (updatedOrder && order.paymentStatus !== updatedOrder.paymentStatus) {
        await notifyOrder("order.payment_updated", updatedOrder);
      }

      order = updatedOrder ?? order;
    }
  }

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
