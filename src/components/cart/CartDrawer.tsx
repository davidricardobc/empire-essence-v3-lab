"use client";

import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCop } from "@/lib/currency";
import { buildCartAssistMessage, buildWhatsappUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, totals, removeItem, updateQuantity, clearCart } = useCart();
  const checkoutChannel = items.some((item) => item.channel === "wholesale") ? "wholesale" : "retail";
  const checkoutItems = items.filter((item) => item.channel === checkoutChannel);
  const checkoutSubtotalCop = checkoutItems.reduce((sum, item) => sum + item.unitPriceCop * item.quantity, 0);
  const drawerWhatsappUrl = buildWhatsappUrl(
    buildCartAssistMessage({
      items: checkoutItems,
      subtotalCop: checkoutSubtotalCop,
      channel: checkoutChannel,
    }),
  );

  return (
    <>
      <div className={`drawer-scrim ${drawerOpen ? "is-open" : ""}`} onClick={closeDrawer} />
      <aside className={`cart-drawer ${drawerOpen ? "is-open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <div>
            <span className="eyebrow">Seleccion actual</span>
            <h2>Tu pedido</h2>
          </div>
          <button type="button" className="icon-button" onClick={closeDrawer} aria-label="Cerrar carrito">
            <X size={18} />
          </button>
        </div>

        {items.length ? (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <article key={`${item.channel}-${item.sku}`} className="drawer-item">
                  <div>
                    <strong>{item.productName}</strong>
                    <span>
                      {item.sizeMl}ml - {item.channel === "wholesale" ? "Mayorista" : "Retail"}
                    </span>
                    <small>{formatCop(item.unitPriceCop)} unidad</small>
                  </div>
                  <div className="drawer-item-actions">
                    <div className="mini-stepper">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, item.channel, item.quantity - 1)}
                        aria-label="Restar"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.sku, item.channel, item.quantity + 1)}
                        aria-label="Sumar"
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.sku, item.channel)}>
                      Quitar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="drawer-total">
              <span>Subtotal</span>
              <strong>{formatCop(totals.subtotalCop)}</strong>
            </div>
            <div className="drawer-confidence">
              <strong>Listo para cerrar</strong>
              <p>
                Si ya elegiste, puedes ir a checkout o enviar este pedido por WhatsApp con el resumen armado para
                confirmar disponibilidad y pago.
              </p>
            </div>
            <div className="drawer-actions">
              <Link href={`/checkout?channel=${checkoutChannel}`} className="primary-button full" onClick={closeDrawer}>
                Continuar al pago
              </Link>
              <a
                href={drawerWhatsappUrl}
                className="secondary-button full"
                target="_blank"
                rel="noreferrer"
                onClick={closeDrawer}
              >
                <MessageCircle size={18} />
                Cerrar por WhatsApp
              </a>
              <button type="button" className="ghost-button full" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Tu carrito esta listo para llenarse con fragancias elegidas para ti.</p>
            <Link href="/catalogo" className="secondary-button" onClick={closeDrawer}>
              Explorar catalogo
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
