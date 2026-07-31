"use client";

import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCop } from "@/lib/currency";
import { buildCartAssistMessage, buildWhatsappUrl } from "@/lib/whatsapp";
import type { CartItem, SalesChannel } from "@/types/cart";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, totals, removeItem, updateQuantity, clearCart } = useCart();
  const retailItems = items.filter((item) => item.channel === "retail");
  const wholesaleItems = items.filter((item) => item.channel === "wholesale");
  const hasMixedChannels = retailItems.length > 0 && wholesaleItems.length > 0;

  return (
    <>
      <div className={`drawer-scrim ${drawerOpen ? "is-open" : ""}`} onClick={closeDrawer} />
      <aside
        id="cart-drawer"
        className={`cart-drawer ${drawerOpen ? "is-open" : ""}`}
        aria-hidden={!drawerOpen}
        aria-modal={drawerOpen}
        role="dialog"
      >
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
            <div className="drawer-total">
              <span>Total en carrito</span>
              <strong>{formatCop(totals.subtotalCop)}</strong>
            </div>
            {hasMixedChannels ? (
              <div className="drawer-channel-note">
                <strong>Tienes selección retail y mayorista</strong>
                <p>Cierra cada canal por separado para ver el resumen correcto y avanzar más rápido.</p>
              </div>
            ) : null}

            <div className="drawer-items">
              {retailItems.length ? (
                <CartChannelSection
                  title="Pedido retail"
                  description="Ideal si vas a pagar online o cerrar por WhatsApp con entrega para cliente final."
                  actionLabel="Ir al checkout retail"
                  whatsappLabel="Cerrar retail por WhatsApp"
                  items={retailItems}
                  channel="retail"
                  onClose={closeDrawer}
                  onRemoveItem={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ) : null}
              {wholesaleItems.length ? (
                <CartChannelSection
                  title="Pedido mayorista"
                  description="Úsalo para kits por volumen y seguimiento comercial por WhatsApp o checkout."
                  actionLabel="Ir al checkout mayorista"
                  whatsappLabel="Cerrar mayorista por WhatsApp"
                  items={wholesaleItems}
                  channel="wholesale"
                  onClose={closeDrawer}
                  onRemoveItem={removeItem}
                  onUpdateQuantity={updateQuantity}
                />
              ) : null}
            </div>

            <div className="drawer-actions">
              <button type="button" className="ghost-button full" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <span className="empty-kicker">Carrito listo para empezar</span>
            <h3>Elige una fragancia y vuelve cuando tengas tu selección.</h3>
            <p>
              Puedes agregar perfumes en 30, 50 o 100 ml desde el catálogo. El resumen queda armado para checkout o
              WhatsApp.
            </p>
            <div className="empty-trust-row">
              <span>Precios visibles</span>
              <span>Resumen automático</span>
              <span>Ayuda por WhatsApp</span>
            </div>
            <div className="empty-actions">
              <Link href="/catalogo" className="secondary-button" onClick={closeDrawer}>
                Explorar catálogo
              </Link>
              <a
                href={buildWhatsappUrl("Hola. Quiero ayuda para elegir una fragancia Empire Essence.")}
                className="ghost-button"
                target="_blank"
                rel="noreferrer"
                onClick={closeDrawer}
              >
                <MessageCircle size={18} />
                Pedir ayuda
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function CartChannelSection({
  title,
  description,
  actionLabel,
  whatsappLabel,
  items,
  channel,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
}: {
  title: string;
  description: string;
  actionLabel: string;
  whatsappLabel: string;
  items: CartItem[];
  channel: SalesChannel;
  onClose: () => void;
  onRemoveItem: (sku: string, channel: SalesChannel) => void;
  onUpdateQuantity: (sku: string, channel: SalesChannel, quantity: number) => void;
}) {
  const subtotalCop = items.reduce((sum, item) => sum + item.unitPriceCop * item.quantity, 0);
  const drawerWhatsappUrl = buildWhatsappUrl(
    buildCartAssistMessage({
      items,
      subtotalCop,
      channel,
    }),
  );

  return (
    <section className="drawer-channel-section">
      <div className="drawer-channel-head">
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <span>{formatCop(subtotalCop)}</span>
      </div>

      {items.map((item) => (
        <article key={`${item.channel}-${item.sku}`} className="drawer-item">
          <div>
            <strong>{item.productName}</strong>
            <span>{item.sizeMl} ml</span>
            <small>{formatCop(item.unitPriceCop)} por unidad</small>
          </div>
          <div className="drawer-item-actions">
            <div className="mini-stepper">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.sku, item.channel, item.quantity - 1)}
                aria-label="Restar"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.sku, item.channel, item.quantity + 1)}
                aria-label="Sumar"
              >
                +
              </button>
            </div>
            <button type="button" onClick={() => onRemoveItem(item.sku, item.channel)}>
              Quitar
            </button>
          </div>
        </article>
      ))}

      <div className="drawer-confidence">
        <strong>Cierre rápido</strong>
        <p>
          Revisa cantidades y elige checkout o WhatsApp. El asesor recibe el resumen listo para pago, disponibilidad y
          entrega.
        </p>
      </div>
      <div className="drawer-trust-pills" aria-label="Confianza de cierre">
        <span>Entrega 3 a 5 días hábiles</span>
        <span>WhatsApp con resumen listo</span>
      </div>

      <div className="drawer-actions drawer-channel-actions">
        <Link href={`/checkout?channel=${channel}`} className="primary-button full" onClick={onClose}>
          {actionLabel}
        </Link>
        <a
          href={drawerWhatsappUrl}
          className="secondary-button full"
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
        >
          <MessageCircle size={18} />
          {whatsappLabel}
        </a>
      </div>
    </section>
  );
}
