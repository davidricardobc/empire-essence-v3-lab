"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, CartTotals } from "@/types/cart";

const STORAGE_KEY = "empire-essence-v3-cart";

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
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          if (Array.isArray(parsed) && active) setItems(parsed);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        if (active) setReady(true);
      }
    }, 0);

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

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
          if (!exists) return [...current, incoming];
          return current.map((item) =>
            item.sku === incoming.sku && item.channel === incoming.channel
              ? { ...item, quantity: item.quantity + incoming.quantity }
              : item,
          );
        });
        setDrawerOpen(true);
      },
      removeItem: (sku, channel) =>
        setItems((current) => current.filter((item) => !(item.sku === sku && item.channel === channel))),
      updateQuantity: (sku, channel, quantity) => {
        if (quantity <= 0) {
          setItems((current) => current.filter((item) => !(item.sku === sku && item.channel === channel)));
          return;
        }
        setItems((current) =>
          current.map((item) => (item.sku === sku && item.channel === channel ? { ...item, quantity } : item)),
        );
      },
      clearCart: () => setItems([]),
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
