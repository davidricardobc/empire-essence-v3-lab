"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, clearStoredCart, readStoredCart, writeStoredCart } from "@/lib/cart-storage";
import type { CartItem, CartTotals } from "@/types/cart";

type CartContextValue = {
  items: CartItem[];
  totals: CartTotals;
  ready: boolean;
  drawerOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string, channel: CartItem["channel"]) => void;
  updateQuantity: (sku: string, channel: CartItem["channel"], quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    window.setTimeout(() => {
      if (!active) return;
      setItems(readStoredCart());
      setReady(true);
    }, 0);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeStoredCart(items);
  }, [items, ready]);

  useEffect(() => {
    function syncFromStorage(event: StorageEvent) {
      if (event.key === CART_STORAGE_KEY) setItems(readStoredCart());
    }

    function syncWhenVisible() {
      if (document.visibilityState === "visible") setItems(readStoredCart());
    }

    window.addEventListener("storage", syncFromStorage);
    document.addEventListener("visibilitychange", syncWhenVisible);
    window.addEventListener("pageshow", syncWhenVisible);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      document.removeEventListener("visibilitychange", syncWhenVisible);
      window.removeEventListener("pageshow", syncWhenVisible);
    };
  }, []);

  const totals = useMemo(
    () =>
      items.reduce<CartTotals>(
        (acc, item) => ({
          itemCount: acc.itemCount + item.quantity,
          subtotalCop: acc.subtotalCop + item.unitPriceCop * item.quantity,
        }),
        { itemCount: 0, subtotalCop: 0 },
      ),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals,
      ready,
      drawerOpen,
      addItem: (incoming) => {
        setItems((current) => {
          const exists = current.find((item) => item.sku === incoming.sku && item.channel === incoming.channel);
          const next = !exists
            ? [...current, incoming]
            : current.map((item) =>
                item.sku === incoming.sku && item.channel === incoming.channel
                  ? { ...item, quantity: item.quantity + incoming.quantity }
                  : item,
              );
          writeStoredCart(next);
          return next;
        });
        setDrawerOpen(true);
      },
      removeItem: (sku, channel) =>
        setItems((current) => {
          const next = current.filter((item) => !(item.sku === sku && item.channel === channel));
          writeStoredCart(next);
          return next;
        }),
      updateQuantity: (sku, channel, quantity) => {
        if (quantity <= 0) {
          setItems((current) => {
            const next = current.filter((item) => !(item.sku === sku && item.channel === channel));
            writeStoredCart(next);
            return next;
          });
          return;
        }
        setItems((current) => {
          const next = current.map((item) =>
            item.sku === sku && item.channel === channel ? { ...item, quantity } : item,
          );
          writeStoredCart(next);
          return next;
        });
      },
      clearCart: () => {
        clearStoredCart();
        setItems([]);
      },
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [drawerOpen, items, ready, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
