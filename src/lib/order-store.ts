import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { OrderRecord, OrderStatus, PaymentStatus } from "@/types/order";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "orders.json");

type OrderStore = Record<string, OrderRecord>;

async function ensureStoreFile() {
  try {
    await mkdir(STORE_DIR, { recursive: true });
    await readFile(STORE_PATH, "utf8");
  } catch {
    try {
      await writeFile(STORE_PATH, "{}\n", "utf8");
    } catch {
      // Some runtimes are read-only. Keep Wompi usable even if persistence is unavailable.
    }
  }

  return STORE_PATH;
}

async function readStore(): Promise<OrderStore> {
  try {
    const storePath = await ensureStoreFile();
    const raw = await readFile(storePath, "utf8");
    return raw.trim() ? (JSON.parse(raw) as OrderStore) : {};
  } catch {
    return {};
  }
}

async function writeStore(store: OrderStore) {
  try {
    const storePath = await ensureStoreFile();
    await writeFile(storePath, JSON.stringify(store, null, 2) + "\n", "utf8");
  } catch {
    // Silent fallback: checkout/webhook should still work without blocking on local persistence.
  }
}

export async function saveOrder(order: OrderRecord) {
  const store = await readStore();
  store[order.reference] = order;
  await writeStore(store);
  return order;
}

export async function getOrder(reference: string) {
  const store = await readStore();
  return store[reference] ?? null;
}

export async function updateOrderPayment(
  reference: string,
  payment: {
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    wompiTransactionId?: string | null;
    wompiStatus?: string | null;
  },
) {
  const store = await readStore();
  const current = store[reference];
  if (!current) return null;

  const updated: OrderRecord = {
    ...current,
    ...payment,
    updatedAt: new Date().toISOString(),
  };

  store[reference] = updated;
  await writeStore(store);
  return updated;
}
