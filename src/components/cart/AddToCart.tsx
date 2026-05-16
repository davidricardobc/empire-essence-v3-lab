"use client";

import { useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCop } from "@/lib/currency";
import { getWholesaleUnitPrice } from "@/lib/pricing";
import type { SalesChannel } from "@/types/cart";
import type { Product } from "@/types/product";

type AddToCartProps = {
  product: Product;
  channel?: SalesChannel;
  defaultQuantity?: number;
};

export function AddToCart({ product, channel = "retail", defaultQuantity = 1 }: AddToCartProps) {
  const { addItem } = useCart();
  const [selectedSku, setSelectedSku] = useState(product.variants[0]?.sku ?? "");
  const [quantity, setQuantity] = useState(defaultQuantity);

  const selected = useMemo(
    () => product.variants.find((variant) => variant.sku === selectedSku) ?? product.variants[0],
    [product.variants, selectedSku],
  );

  if (!selected) return null;

  const unitPrice =
    channel === "wholesale" ? getWholesaleUnitPrice(selected.sizeMl, Math.max(quantity, 10)) : selected.retailPriceCop;
  const selectedSizeGuide = getSizeGuide(selected.sizeMl);
  const pricePerMl = Math.round(unitPrice / selected.sizeMl);

  return (
    <div className="buy-box">
      <div className="variant-grid" role="radiogroup" aria-label="Seleccionar tamano">
        {product.variants.map((variant) => {
          const active = variant.sku === selected.sku;
          const price =
            channel === "wholesale"
              ? getWholesaleUnitPrice(variant.sizeMl, Math.max(quantity, 10))
              : variant.retailPriceCop;

          return (
            <button
              key={variant.sku}
              type="button"
              className={`variant-pill ${active ? "is-active" : ""}`}
              onClick={() => setSelectedSku(variant.sku)}
              aria-pressed={active}
            >
              <span>{variant.sizeMl} ml</span>
              <strong>{formatCop(price)}</strong>
            </button>
          );
        })}
      </div>

      {channel === "retail" ? (
        <div className="size-guide-card">
          <div className="size-guide-copy">
            <strong>{selectedSizeGuide.title}</strong>
            <p>{selectedSizeGuide.description}</p>
          </div>
          <span>{selected.sizeMl} ml · aprox. {formatCop(pricePerMl)}/ml</span>
        </div>
      ) : null}

      <div className="quantity-row">
        <span>Cantidad</span>
        <div className="stepper">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Restar">
            -
          </button>
          <strong>{quantity}</strong>
          <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Sumar">
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="primary-button full"
        onClick={() =>
          addItem({
            productId: product.id,
            productSlug: product.slug,
            productName: product.publicName,
            sizeMl: selected.sizeMl,
            sku: selected.sku,
            quantity,
            unitPriceCop: unitPrice,
            channel,
          })
        }
      >
        <ShoppingBag size={18} />
        {channel === "wholesale" ? "Agregar a pedido mayorista" : "Agregar y comprar"}
      </button>
    </div>
  );
}

function getSizeGuide(sizeMl: Product["variants"][number]["sizeMl"]) {
  switch (sizeMl) {
    case 30:
      return {
        title: "30 ml para probar sin pensarlo demasiado",
        description: "Ideal si es tu primera compra, quieres regalar o prefieres validar el aroma antes de subir.",
      };
    case 50:
      return {
        title: "50 ml para el punto mas facil de recomendar",
        description: "Suele ser la mejor relacion entre inversion, duracion y confianza para uso frecuente.",
      };
    case 100:
      return {
        title: "100 ml para quien ya sabe que este perfil es suyo",
        description: "Conviene mas si ya conoces este tipo de aroma o quieres resolver por mas tiempo con una sola compra.",
      };
  }
}
