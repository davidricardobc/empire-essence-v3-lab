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
);

CREATE INDEX IF NOT EXISTS order_records_created_at_idx
  ON order_records (created_at DESC);

CREATE INDEX IF NOT EXISTS order_records_payment_status_idx
  ON order_records (payment_status);
