"use client";

import { useMemo, useState } from "react";
import { Calculator, MessageCircle, PackageCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { getTopSellers } from "@/lib/products";
import { formatCop } from "@/lib/currency";
import {
  getWholesaleSuggestedMargin,
  getWholesaleUnitPrice,
  WHOLESALE_MIN_UNITS,
  WHOLESALE_RETAIL_PRICE,
} from "@/lib/pricing";
import type { ProductSize } from "@/types/product";

const sizeOptions: ProductSize[] = [30, 50, 100];
const supplyNeeds = ["Esencias por litro", "Alcohol cosmetico", "Fijador", "Feromonas", "Envases"];

export function WholesaleBuilder() {
  const { addItem, openDrawer } = useCart();
  const [quantities, setQuantities] = useState<Record<ProductSize, number>>({ 30: 10, 50: 0, 100: 0 });
  const [lead, setLead] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    businessType: "Emprendedor / revendedor",
    salesChannel: "Instagram / WhatsApp",
    budget: "$300k - $800k",
    notes: "",
  });
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);
  const [quoteMessage, setQuoteMessage] = useState<string | null>(null);
  const [quoteUrl, setQuoteUrl] = useState<string | null>(null);

  const totalUnits = sizeOptions.reduce((sum, size) => sum + quantities[size], 0);
  const valid = totalUnits >= WHOLESALE_MIN_UNITS;

  const lines = useMemo(
    () =>
      sizeOptions
        .filter((size) => quantities[size] > 0)
        .map((size) => {
          const unitCost = getWholesaleUnitPrice(size, Math.max(totalUnits, WHOLESALE_MIN_UNITS));
          const margin = getWholesaleSuggestedMargin(size, unitCost);
          return {
            size,
            quantity: quantities[size],
            unitCost,
            subtotal: unitCost * quantities[size],
            ...margin,
          };
        }),
    [quantities, totalUnits],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const projectedProfit = lines.reduce((sum, line) => sum + line.profitCop * line.quantity, 0);

  async function quote() {
    setQuoteMessage(null);
    setQuoteUrl(null);
    const response = await fetch("/api/wholesale/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead,
        kit: sizeOptions.map((sizeMl) => ({ sizeMl, quantity: quantities[sizeMl] })),
        supplyNeeds: selectedSupplies,
      }),
    });
    const data = (await response.json()) as { ok: boolean; nextAction?: string; whatsappUrl?: string; tier?: string };
    setQuoteMessage(data.nextAction ?? "Propuesta calculada. Puedes revisar el margen y continuar con tu pedido.");
    if (data.whatsappUrl) setQuoteUrl(data.whatsappUrl);
  }

  function addWholesaleKit() {
    const sellers = getTopSellers(12);
    let index = 0;
    const groupedItems = new Map<
      string,
      {
        productId: string;
        productSlug: string;
        productName: string;
        sizeMl: ProductSize;
        sku: string;
        quantity: number;
        unitPriceCop: number;
        channel: "wholesale";
      }
    >();

    lines.forEach((line) => {
      for (let unit = 0; unit < line.quantity; unit += 1) {
        const product = sellers[index % sellers.length];
        const variant = product.variants.find((item) => item.sizeMl === line.size);
        if (variant) {
          const existing = groupedItems.get(variant.sku);
          if (existing) {
            groupedItems.set(variant.sku, { ...existing, quantity: existing.quantity + 1 });
          } else {
            groupedItems.set(variant.sku, {
              productId: product.id,
              productSlug: product.slug,
              productName: product.publicName,
              sizeMl: variant.sizeMl,
              sku: variant.sku,
              quantity: 1,
              unitPriceCop: line.unitCost,
              channel: "wholesale",
            });
          }
        }
        index += 1;
      }
    });
    groupedItems.forEach((item) => addItem(item));
    openDrawer();
  }

  return (
    <div className="wholesale-builder">
      <div className="panel builder-panel">
        <span className="eyebrow">Kit mayorista</span>
        <h2>Arma variedad desde 10 unidades mezcladas.</h2>
        <p>
          Precios claros para fragancias listas para vender. Insumos por gramo, litro o volumen especial se cotizan
          aparte.
        </p>

        <div className="wholesale-lines">
          {sizeOptions.map((size) => {
            const unitCost = getWholesaleUnitPrice(size, Math.max(totalUnits, WHOLESALE_MIN_UNITS));
            const margin = getWholesaleSuggestedMargin(size, unitCost);
            return (
              <article key={size} className="wholesale-line">
                <div>
                  <strong>{size} ml</strong>
                  <span>
                    Mayorista {formatCop(unitCost)} - sugerido {formatCop(WHOLESALE_RETAIL_PRICE[size])}
                  </span>
                  <small>Margen estimado {margin.marginPercent}%</small>
                </div>
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => setQuantities((current) => ({ ...current, [size]: Math.max(0, current[size] - 1) }))}
                  >
                    -
                  </button>
                  <strong>{quantities[size]}</strong>
                  <button type="button" onClick={() => setQuantities((current) => ({ ...current, [size]: current[size] + 1 }))}>
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="supply-checks">
          {supplyNeeds.map((item) => {
            const active = selectedSupplies.includes(item);
            return (
              <button
                type="button"
                key={item}
                className={active ? "is-active" : ""}
                onClick={() =>
                  setSelectedSupplies((current) =>
                    current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
                  )
                }
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel quote-panel">
        <span className="eyebrow">Rentabilidad</span>
        <h2>{formatCop(subtotal)}</h2>
        <p>Inversion estimada para {totalUnits} unidades antes de cerrar el pedido.</p>

        <div className="metric-grid">
          <div>
            <span>Ganancia sugerida</span>
            <strong>{formatCop(projectedProfit)}</strong>
          </div>
          <div>
            <span>Estado</span>
            <strong>{valid ? "Listo para comprar" : `Faltan ${WHOLESALE_MIN_UNITS - totalUnits}`}</strong>
          </div>
        </div>

        <div className="lead-mini-form">
          <input placeholder="Nombre" value={lead.name} onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))} />
          <input placeholder="WhatsApp" value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))} />
          <input placeholder="Correo" value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} />
          <input placeholder="Ciudad" value={lead.city} onChange={(event) => setLead((current) => ({ ...current, city: event.target.value }))} />
        </div>

        {quoteMessage ? <p className="form-message success">{quoteMessage}</p> : null}

        <div className="builder-actions">
          <button type="button" className="secondary-button full" onClick={quote}>
            <Calculator size={18} />
            Calcular propuesta
          </button>
          <button type="button" className="primary-button full" onClick={addWholesaleKit} disabled={!valid}>
            <ShoppingBag size={18} />
            Agregar kit al checkout
          </button>
          {quoteUrl ? (
            <a className="ghost-button full" href={quoteUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Hablar con un asesor
            </a>
          ) : null}
        </div>

        <div className="proof-line">
          <PackageCheck size={18} />
          Entrega 3-5 dias habiles, envio nacional y frascos con tapa incluidos.
        </div>
      </div>
    </div>
  );
}
