"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCop } from "@/lib/currency";
import { getShipping } from "@/lib/pricing";
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

export function CheckoutClient({ channel }: { channel: SalesChannel }) {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CheckoutApiResponse | null>(null);

  const checkoutItems = useMemo(() => items.filter((item) => item.channel === channel), [channel, items]);
  const subtotalCop = checkoutItems.reduce((sum, item) => sum + item.unitPriceCop * item.quantity, 0);
  const shipping = getShipping(form.city, subtotalCop);
  const totalCop = subtotalCop + shipping.shippingCop;
  const canSubmit = checkoutItems.length > 0 && !loading;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setResponse(null);

    try {
      const result = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, channel, items: checkoutItems }),
      });
      const data = (await result.json()) as CheckoutApiResponse;
      setResponse(data);
      if (data.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (data.ok) clearCart();
    } catch {
      setResponse({ ok: false, message: "No se pudo conectar con el checkout. Intenta por WhatsApp." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-grid">
      <form className="checkout-form panel" onSubmit={submit}>
        <span className="eyebrow">{channel === "wholesale" ? "Checkout mayorista" : "Checkout retail"}</span>
        <h2>Datos para cerrar tu pedido</h2>
        <p>Paga con seguridad o confirma tu pedido por WhatsApp si prefieres recibir ayuda antes de finalizar.</p>

        <div className="form-grid">
          <Input label="Nombre" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name }))} />
          <Input
            label="Telefono"
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
            label="Direccion"
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

        {response?.message ? <p className={`form-message ${response.ok ? "success" : "error"}`}>{response.message}</p> : null}

        {response?.ok && response.whatsappUrl ? (
          <a href={response.whatsappUrl} className="secondary-button full" target="_blank">
            <MessageCircle size={18} />
            Confirmar por WhatsApp
          </a>
        ) : null}

        <button type="submit" className="primary-button full" disabled={!canSubmit}>
          <ShieldCheck size={18} />
          {loading ? "Creando pedido..." : "Continuar al pago seguro"}
        </button>
      </form>

      <aside className="checkout-summary panel">
        <span className="eyebrow">Resumen</span>
        <h2>{channel === "wholesale" ? "Pedido emprendedor" : "Tu seleccion"}</h2>
        {checkoutItems.length ? (
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
            <p>No hay productos de este canal en el carrito.</p>
            <Link href={channel === "wholesale" ? "/mayoristas" : "/catalogo"} className="secondary-button">
              Elegir productos
            </Link>
          </div>
        )}

        <div className="pricing-box">
          <div>
            <span>Subtotal</span>
            <strong>{formatCop(subtotalCop)}</strong>
          </div>
          <div>
            <span>Envio</span>
            <strong>{shipping.freeShipping ? "Gratis" : formatCop(shipping.shippingCop)}</strong>
          </div>
          <div className="total-line">
            <span>Total</span>
            <strong>{formatCop(totalCop)}</strong>
          </div>
        </div>

        <p className="microcopy">
          {shipping.freeShipping
            ? "Este pedido ya aplica a envio gratis."
            : `Te faltan ${formatCop(shipping.amountToFreeShippingCop)} para envio gratis.`}
        </p>
        <p className="microcopy">Carrito total actual: {formatCop(totals.subtotalCop)}</p>
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
