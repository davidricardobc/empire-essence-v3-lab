"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const { totals, openDrawer, drawerOpen } = useCart();

  return (
    <button
      type="button"
      className="cart-button"
      onClick={openDrawer}
      aria-label="Abrir carrito"
      aria-controls="cart-drawer"
      aria-expanded={drawerOpen}
    >
      <ShoppingBag size={18} />
      <span>Carrito</span>
      {totals.itemCount > 0 ? <strong>{totals.itemCount}</strong> : null}
    </button>
  );
}
