"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { saveCheckoutCartSnapshot } from "@/lib/cart-storage";
import { formatCop } from "@/lib/currency";
import { getShipping } from "@/lib/pricing";
import { buildAssistedCheckoutMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import type { CheckoutApiResponse } from "@/types/checkout";
import type { SalesChannel } from "@/types/cart";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

export function CheckoutClient({ channel, wompiEnabled }: { channel: SalesChannel; wompiEnabled: boolean }) {
  const { items, totals, ready, updateQuantity, removeItem, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CheckoutApiResponse | null>(null);

  const checkoutItems = useMemo(() => items.filter((item) => item.channel === channel), [channel, items]);
  const subtotalCop = checkoutItems.reduce((sum, item) => sum + item.unitPriceCop * item.quantity, 0);
  const shipping = getShipping(form.city, subtotalCop);
  const totalCop = subtotalCop + shipping.shippingCop;
  const canSubmit = ready && checkoutItems.length > 0 && !loading;
  const shippingLabel = form.city.trim()
    ? shipping.shippingZone === "bogota"
      ? "Envío estimado para Bogotá"
      : "Envío estimado nacional"
    : "Envío estimado";
  const assistedWhatsappUrl = buildWhatsappUrl(
    buildAssistedCheckoutMessage({
      customer: form,
      items: checkoutItems,
      subtotalCop,
      shippingCop: shipping.shippingCop,
      totalCop,
      freeShipping: shipping.freeShipping,
      channel,
    }),
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setResponse(null);
    saveCheckoutCartSnapshot(checkoutItems);

    try {
      const result = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, channel, items: checkoutItems }),
      });
      const data = (await result.json()) as CheckoutApiResponse;
      setResponse(data);
      if (data.ok && data.checkoutUrl) {
        saveCheckoutCartSnapshot(checkoutItems);
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.ok && data.whatsappUrl) {
        clearCart();
        window.location.href = data.whatsappUrl;
        return;
      }
      if (data.ok) clearCart();
    } catch {
      setResponse({
        ok: false,
        message: "No pudimos conectar el checkout en este momento. Puedes cerrar por WhatsApp con el mismo resumen.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-grid">
      <form className="checkout-form panel" onSubmit={submit}>
        <h2>Datos de entrega</h2>
        <p>Completa tus datos para continuar con tu compra.</p>

        <div className="form-grid">
          <Input label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
          <Input
            label="Teléfono"
            value={form.phone}
            onChange={(phone) => setForm((current) => ({ ...current, phone }))}
          />
          <Input
            label="Correo"
            type="email"
            value={form.email}
            onChange={(email) => setForm((current) => ({ ...current, email }))}
          />
          <Input label="Ciudad" value={form.city} onChange={(city) => setForm((current) => ({ ...current, city }))} />
          <Input
            label="Dirección"
            value={form.address}
            onChange={(address) => setForm((current) => ({ ...current, address }))}
          />
        </div>
        <label className="field wide">
          <span>Notas</span>
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            placeholder="Horario, referencia, dedicatoria o detalles para entrega"
          />
        </label>

        {response?.message ? (
          <div className={`form-message ${response.ok ? "success" : "error"}`}>
            <strong>{response.ok ? "Todo listo" : "Necesitamos revisar algo"}</strong>
            <p>{response.message}</p>
            {!response.ok && checkoutItems.length ? (
              <a href={assistedWhatsappUrl} target="_blank" rel="noreferrer">
                Continuar por WhatsApp
              </a>
            ) : null}
          </div>
        ) : null}

        <button type="submit" className="primary-button full" disabled={!canSubmit}>
          <ShieldCheck size={18} />
          {loading ? "Creando pedido..." : wompiEnabled ? "Continuar al pago seguro" : "Enviar pedido a WhatsApp"}
        </button>
        {wompiEnabled ? <p className="payment-note">Pago protegido por Wompi 🔒</p> : null}

        {ready && checkoutItems.length ? (
          <div className="checkout-assist">
            <strong>¿Prefieres atención personalizada?</strong>
            <p>Tu pedido y tus datos se enviarán automáticamente a WhatsApp para que un asesor pueda ayudarte.</p>
            <a href={assistedWhatsappUrl} className="secondary-button full" target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Continuar por WhatsApp
            </a>
          </div>
        ) : null}
      </form>

      <aside className="checkout-summary panel">
        <span className="eyebrow">Resumen</span>
        <h2>{channel === "wholesale" ? "Pedido mayorista" : "Tu selección"}</h2>
        {!ready ? (
          <div className="empty-state compact">
            <span className="empty-kicker">Recuperando carrito</span>
            <p>Estamos cargando tu selección guardada antes de mostrar el resumen.</p>
          </div>
        ) : checkoutItems.length ? (
          <div className="summary-list">
            {checkoutItems.map((item) => (
              <article key={`${item.channel}-${item.sku}`} className="summary-item">
                <div>
                  <strong>{item.productName}</strong>
                  <span>{item.sizeMl}ml - {formatCop(item.unitPriceCop)}</span>
                </div>
                <div className="mini-stepper">
                  <button type="button" onClick={() => updateQuantity(item.sku, item.channel, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.sku, item.channel, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="text-button" onClick={() => removeItem(item.sku, item.channel)}>
                  Quitar
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state compact">
            <span className="empty-kicker">Sin productos para este cierre</span>
            <p>
              {channel === "wholesale"
                ? "Agrega kits mayoristas para ver subtotal, mínimo de unidades y cierre por WhatsApp."
                : "Agrega una fragancia retail para ver subtotal, envío y opciones de cierre."}
            </p>
            <Link href={channel === "wholesale" ? "/mayoristas" : "/catalogo"} className="secondary-button">
              {channel === "wholesale" ? "Armar pedido mayorista" : "Elegir fragancias"}
            </Link>
          </div>
        )}

        <div className="pricing-box">
          <div>
            <span>Subtotal</span>
            <strong>{formatCop(subtotalCop)}</strong>
          </div>
          <div>
            <span>{shippingLabel}</span>
            <strong>{shipping.freeShipping ? "Gratis" : formatCop(shipping.shippingCop)}</strong>
          </div>
          <div className="total-line">
            <span>Total</span>
            <strong>{formatCop(totalCop)}</strong>
          </div>
        </div>

        <p className="microcopy">
          {shipping.freeShipping
            ? "Este pedido ya aplica a envío gratis."
            : `Te faltan ${formatCop(shipping.amountToFreeShippingCop)} para envío gratis.`}
        </p>
        <p className="microcopy">
          {form.city.trim()
            ? shipping.shippingZone === "bogota"
              ? "Tu ciudad entra en la tarifa de Bogotá."
              : "Tu ciudad entra en la tarifa nacional."
            : "Escribe tu ciudad para afinar el envío antes de cerrar."}
        </p>
        <p className="microcopy">Carrito total actual: {formatCop(totals.subtotalCop)}</p>
        {ready && checkoutItems.length ? (
          <div className="checkout-steps">
            <strong>Después de confirmar</strong>
            <ul>
              {wompiEnabled ? (
                <li>🔒 Pago online: continuarás a Wompi para realizar el pago de forma segura.</li>
              ) : null}
              <li>💬 WhatsApp: un asesor recibirá automáticamente tu pedido.</li>
              <li>🚚 Entrega: estimada entre 3 y 5 días hábiles.</li>
            </ul>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
