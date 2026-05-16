import { CheckoutClient } from "@/components/cart/CheckoutClient";
import type { SalesChannel } from "@/types/cart";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ channel?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const channel: SalesChannel = params.channel === "wholesale" ? "wholesale" : "retail";

  return (
    <main className="page-main">
      <section className="shell page-hero compact-hero">
        <span className="eyebrow">{channel === "wholesale" ? "Cierre mayorista" : "Cierre retail"}</span>
        <h1>Finaliza tu pedido con pago seguro o asistencia personalizada.</h1>
        <p>
          Revisa tus datos, confirma tu seleccion y elige si quieres pagar en linea o cerrar por WhatsApp con un asesor.
        </p>
      </section>
      <section className="shell">
        <CheckoutClient channel={channel} />
      </section>
    </main>
  );
}
