"use client";

import type { CartItem } from "@/types/cart";

export const CART_STORAGE_KEY = "empire-essence-v3-cart";
const CHECKOUT_SNAPSHOT_KEY = "empire-essence-v3-checkout-cart";
const SNAPSHOT_TTL_MS = 1000 * 60 * 60 * 24;

type CartSnapshot = {
  items: CartItem[];
  savedAt: number;
};

export function readStoredCart() {
  if (typeof window === "undefined") return [];

  const cartItems = readCartItems(CART_STORAGE_KEY);
  if (cartItems.length) return cartItems;

  const snapshot = readSnapshot();
  if (!snapshot) return [];

  const fresh = Date.now() - snapshot.savedAt < SNAPSHOT_TTL_MS;
  return fresh ? snapshot.items : [];
}

export function writeStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can fail in private modes. Keep the in-memory cart usable.
  }
}

export function saveCheckoutCartSnapshot(items: CartItem[]) {
  if (typeof window === "undefined" || !items.length) return;

  try {
    const snapshot: CartSnapshot = { items, savedAt: Date.now() };
    window.localStorage.setItem(CHECKOUT_SNAPSHOT_KEY, JSON.stringify(snapshot));
    writeStoredCart(items);
  } catch {
    // Do not block checkout if storage is unavailable.
  }
}

export function clearStoredCart() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    window.localStorage.removeItem(CHECKOUT_SNAPSHOT_KEY);
  } catch {
    // The React state is still the source of truth for this tab.
  }
}

function readCartItems(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) return parsed.filter(isCartItem);
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore cleanup failures.
    }
  }

  return [];
}

function readSnapshot() {
  try {
    const raw = window.localStorage.getItem(CHECKOUT_SNAPSHOT_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartSnapshot) : null;
    if (!parsed || typeof parsed.savedAt !== "number" || !Array.isArray(parsed.items)) return null;

    return {
      savedAt: parsed.savedAt,
      items: parsed.items.filter(isCartItem),
    };
  } catch {
    return null;
  }
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;

  return (
    typeof item.productId === "string" &&
    typeof item.productSlug === "string" &&
    typeof item.productName === "string" &&
    typeof item.sku === "string" &&
    (item.sizeMl === 30 || item.sizeMl === 50 || item.sizeMl === 100) &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0 &&
    Number.isFinite(item.unitPriceCop) &&
    (item.channel === "retail" || item.channel === "wholesale")
  );
}
