"use client";

import Image from "next/image";
import Link from "next/link";
import { Flame, MessageCircle, Plus, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCop } from "@/lib/currency";
import { getProductVisual } from "@/lib/product-visuals";
import { buildWhatsappUrl } from "@/lib/whatsapp";
import type { Product } from "@/types/product";

const imagePositions = ["21% center", "50% center", "78% center"];

export function HomeQuickBuy({ products }: { products: Product[] }) {
  const { addItem } = useCart();

  return (
    <aside className="home-quick-buy" aria-label="Elige tu esencia">
      <div className="quick-buy-head">
        <span>Elige tu esencia</span>
        <p>Perfumes inspirados listos para compra retail. Agrega al carrito o abre la ficha para ver notas y tamanos.</p>
        <div className="quick-buy-trust">
          <span>
            <Flame size={13} />
            Top ventas
          </span>
          <span>
            <Truck size={13} />
            Entrega 3 a 5 dias
          </span>
          <span>
            <ShieldCheck size={13} />
            Pago seguro
          </span>
        </div>
      </div>

      <div className="quick-buy-list">
        {products.slice(0, 3).map((product, index) => {
          const variant = product.variants[0];
          const sizeLabel = product.variants.map((item) => `${item.sizeMl} ml`).join(" / ");

          return (
            <article key={product.id} className="quick-buy-item">
              <Link href={`/producto/${product.slug}`} className="quick-buy-media" aria-label={`Ver ${product.publicName}`}>
                <Image
                  src={getProductVisual(product.category)}
                  alt=""
                  fill
                  sizes="96px"
                  style={{ objectPosition: imagePositions[index] ?? "50% center" }}
                />
              </Link>
              <div className="quick-buy-copy">
                <Link href={`/producto/${product.slug}`}>
                  <strong>{product.publicName}</strong>
                </Link>
                <span>Inspirado en {product.inspirationReference}</span>
                <small>
                  {sizeLabel} · intensidad {product.intensity}
                </small>
                <p>{product.shortDescription}</p>
              </div>
              <div className="quick-buy-action">
                <strong>{formatCop(variant.retailPriceCop)}</strong>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      productSlug: product.slug,
                      productName: product.publicName,
                      sizeMl: variant.sizeMl,
                      sku: variant.sku,
                      quantity: 1,
                      unitPriceCop: variant.retailPriceCop,
                      channel: "retail",
                    })
                  }
                >
                  <Plus size={15} />
                  Agregar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="quick-buy-alex">
        <Image src="/assets/alex-advisor.png" alt="" width={52} height={52} />
        <div>
          <span>Necesitas ayuda para elegir?</span>
          <small>Alex recomienda por ocasion, mood y presupuesto.</small>
        </div>
        <a href={buildWhatsappUrl("Hola Alex. Quiero ayuda para elegir mi fragancia Empire Essence.")} target="_blank">
          Hablar con Alex
          <MessageCircle size={15} />
        </a>
      </div>
    </aside>
  );
}
