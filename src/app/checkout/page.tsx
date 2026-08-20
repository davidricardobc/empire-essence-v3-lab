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
      <section className="shell page-hero compact-hero checkout-hero">
        <span className="eyebrow">Compra segura</span>
        <h1>Finaliza tu compra</h1>
        <p>
          {wompiEnabled
            ? "Revisa tus datos, confirma tu pedido y elige cómo quieres continuar."
            : "Revisa tus datos y te llevamos directo a WhatsApp con el pedido armado para confirmar disponibilidad, total final, pago y entrega."}
        </p>
      </section>
      <section className="shell">
        <CheckoutClient channel={channel} wompiEnabled={wompiEnabled} />
      </section>
    </main>
  );
}
