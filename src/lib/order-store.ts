import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import type { CartItem, SalesChannel } from "@/types/cart";
import type { CheckoutCustomer } from "@/types/checkout";
import type { OrderRecord, OrderStatus, PaymentStatus } from "@/types/order";

const STORE_PATH = path.join(process.cwd(), "data", "orders.json");

type OrderStore = Record<string, OrderRecord>;
type SqlClient = ReturnType<typeof postgres>;

type OrderRow = {
  reference: string;
  channel: SalesChannel;
  customer: CheckoutCustomer | string;
  items: CartItem[] | string;
  subtotal_cop: number;
  shipping_cop: number;
  total_cop: number;
  free_shipping: boolean;
  shipping_zone: "bogota" | "national";
  payment_provider: "wompi" | "manual";
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  wompi_checkout_url: string | null;
  wompi_transaction_id: string | null;
  wompi_status: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

let sqlClient: SqlClient | null = null;
let schemaReady: Promise<void> | null = null;

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim();
}

function getSqlClient() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  if (!sqlClient) {
    sqlClient = postgres(databaseUrl, {
      connect_timeout: 10,
      idle_timeout: 20,
      max: 1,
      prepare: false,
    });
  }

  return sqlClient;
}

async function ensurePostgresSchema(sql: SqlClient) {
  schemaReady ??= sql`
    CREATE TABLE IF NOT EXISTS order_records (
      reference TEXT PRIMARY KEY,
      channel TEXT NOT NULL CHECK (channel IN ('retail', 'wholesale')),
      customer JSONB NOT NULL,
      items JSONB NOT NULL,
      subtotal_cop INTEGER NOT NULL,
      shipping_cop INTEGER NOT NULL,
      total_cop INTEGER NOT NULL,
      free_shipping BOOLEAN NOT NULL,
      shipping_zone TEXT NOT NULL CHECK (shipping_zone IN ('bogota', 'national')),
      payment_provider TEXT NOT NULL CHECK (payment_provider IN ('wompi', 'manual')),
      payment_status TEXT NOT NULL CHECK (payment_status IN ('initiated', 'pending', 'paid', 'failed')),
      order_status TEXT NOT NULL CHECK (order_status IN ('pending', 'confirmed')),
      wompi_checkout_url TEXT,
      wompi_transaction_id TEXT,
      wompi_status TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    )
  `.then(() => undefined);

  await schemaReady;
}

async function ensureJsonStoreFile() {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });

  try {
    await readFile(STORE_PATH, "utf8");
  } catch {
    await writeFile(STORE_PATH, "{}\n", "utf8");
  }

  return STORE_PATH;
}

async function readJsonStore(): Promise<OrderStore> {
  const storePath = await ensureJsonStoreFile();
  const raw = await readFile(storePath, "utf8");
  return raw.trim() ? (JSON.parse(raw) as OrderStore) : {};
}

async function writeJsonStore(store: OrderStore) {
  const storePath = await ensureJsonStoreFile();
  await writeFile(storePath, JSON.stringify(store, null, 2) + "\n", "utf8");
}

function readJsonField<T>(value: T | string) {
  return typeof value === "string" ? (JSON.parse(value) as T) : value;
}

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}

function rowToOrder(row: OrderRow): OrderRecord {
  return {
    reference: row.reference,
    channel: row.channel,
    customer: readJsonField<CheckoutCustomer>(row.customer),
    items: readJsonField<CartItem[]>(row.items),
    subtotalCop: row.subtotal_cop,
    shippingCop: row.shipping_cop,
    totalCop: row.total_cop,
    freeShipping: row.free_shipping,
    shippingZone: row.shipping_zone,
    paymentProvider: row.payment_provider,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    wompiCheckoutUrl: row.wompi_checkout_url,
    wompiTransactionId: row.wompi_transaction_id,
    wompiStatus: row.wompi_status,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

async function saveOrderInPostgres(sql: SqlClient, order: OrderRecord) {
  await ensurePostgresSchema(sql);

  const [row] = await sql<OrderRow[]>`
    INSERT INTO order_records (
      reference,
      channel,
      customer,
      items,
      subtotal_cop,
      shipping_cop,
      total_cop,
      free_shipping,
      shipping_zone,
      payment_provider,
      payment_status,
      order_status,
      wompi_checkout_url,
      wompi_transaction_id,
      wompi_status,
      created_at,
      updated_at
    )
    VALUES (
      ${order.reference},
      ${order.channel},
      ${JSON.stringify(order.customer)}::jsonb,
      ${JSON.stringify(order.items)}::jsonb,
      ${order.subtotalCop},
      ${order.shippingCop},
      ${order.totalCop},
      ${order.freeShipping},
      ${order.shippingZone},
      ${order.paymentProvider},
      ${order.paymentStatus},
      ${order.orderStatus},
      ${order.wompiCheckoutUrl ?? null},
      ${order.wompiTransactionId ?? null},
      ${order.wompiStatus ?? null},
      ${order.createdAt},
      ${order.updatedAt}
    )
    ON CONFLICT (reference) DO UPDATE SET
      channel = EXCLUDED.channel,
      customer = EXCLUDED.customer,
      items = EXCLUDED.items,
      subtotal_cop = EXCLUDED.subtotal_cop,
      shipping_cop = EXCLUDED.shipping_cop,
      total_cop = EXCLUDED.total_cop,
      free_shipping = EXCLUDED.free_shipping,
      shipping_zone = EXCLUDED.shipping_zone,
      payment_provider = EXCLUDED.payment_provider,
      payment_status = EXCLUDED.payment_status,
      order_status = EXCLUDED.order_status,
      wompi_checkout_url = EXCLUDED.wompi_checkout_url,
      wompi_transaction_id = EXCLUDED.wompi_transaction_id,
      wompi_status = EXCLUDED.wompi_status,
      updated_at = EXCLUDED.updated_at
    RETURNING *
  `;

  return rowToOrder(row);
}

async function getOrderFromPostgres(sql: SqlClient, reference: string) {
  await ensurePostgresSchema(sql);

  const [row] = await sql<OrderRow[]>`
    SELECT *
    FROM order_records
    WHERE reference = ${reference}
    LIMIT 1
  `;

  return row ? rowToOrder(row) : null;
}

async function updateOrderPaymentInPostgres(
  sql: SqlClient,
  reference: string,
  payment: {
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    wompiTransactionId?: string | null;
    wompiStatus?: string | null;
  },
) {
  await ensurePostgresSchema(sql);

  const [row] = await sql<OrderRow[]>`
    UPDATE order_records
    SET
      payment_status = ${payment.paymentStatus},
      order_status = ${payment.orderStatus},
      wompi_transaction_id = ${payment.wompiTransactionId ?? null},
      wompi_status = ${payment.wompiStatus ?? null},
      updated_at = ${new Date().toISOString()}
    WHERE reference = ${reference}
    RETURNING *
  `;

  return row ? rowToOrder(row) : null;
}

export function getOrderStoreMode() {
  return getDatabaseUrl() ? "postgres" : "json";
}

export async function saveOrder(order: OrderRecord) {
  const sql = getSqlClient();
  if (sql) return saveOrderInPostgres(sql, order);

  const store = await readJsonStore();
  store[order.reference] = order;
  await writeJsonStore(store);
  return order;
}

export async function getOrder(reference: string) {
  const sql = getSqlClient();
  if (sql) return getOrderFromPostgres(sql, reference);

  const store = await readJsonStore();
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
  const sql = getSqlClient();
  if (sql) return updateOrderPaymentInPostgres(sql, reference, payment);

  const store = await readJsonStore();
  const current = store[reference];
  if (!current) return null;

  const updated: OrderRecord = {
    ...current,
    ...payment,
    updatedAt: new Date().toISOString(),
  };

  store[reference] = updated;
  await writeJsonStore(store);
  return updated;
}
