import { CheckoutClient } from "@/components/cart/CheckoutClient";
import { hasWompiPublicConfig } from "@/lib/wompi";
import type { SalesChannel } from "@/types/cart";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ channel?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const channel: SalesChannel = params.channel === "wholesale" ? "wholesale" : "retail";
  const wompiEnabled = hasWompiPublicConfig();

  return (
    <main className="page-main">
      <section className="shell page-hero compact-hero">
        <span className="eyebrow">{channel === "wholesale" ? "Cierre mayorista" : "Cierre retail"}</span>
        <h1>
          {wompiEnabled
            ? "Finaliza tu pedido con pago seguro o asistencia personalizada."
            : "Finaliza tu pedido por WhatsApp con asistencia personalizada."}
        </h1>
        <p>
          {wompiEnabled
            ? "Revisa tus datos, confirma tu seleccion y elige si quieres pagar en linea o cerrar por WhatsApp con un asesor."
            : "Revisa tus datos y te llevamos directo a WhatsApp con el pedido armado para confirmar disponibilidad, pago y entrega."}
        </p>
      </section>
      <section className="shell">
        <CheckoutClient channel={channel} wompiEnabled={wompiEnabled} />
      </section>
    </main>
  );
}
